import crypto from 'crypto';

import { db } from '@/db';
import { dbGetAmountOfExecutionsThisMonth } from '@/db/functions/execution';
import { dbGetJobForWorker, dbUpdateJob } from '@/db/functions/job';
import { dbGetHmacSecretForWorker } from '@/db/functions/secret';
import { dbGetWebhookEndpointsForEvent, dbInsertWebhookEvent } from '@/db/functions/webhook';
import { executionTable, type ExecutionStatus } from '@/db/schema';
import { type RunJobPayload } from '@/queue/queue';
import { getOrgActiveSubscriptionApi } from '@/stripe/subscription';
import { executeHttp } from '@/utils/http';
import { betterFetch } from '@better-fetch/fetch';
import { Job } from 'bullmq';

import { sleep } from './utils';

const RUN_DEFAULT_TIMEOUT_MS = 3214;
const RUN_MAX_RESPONSE_PREVIEW_BYTES = 4096;

export async function runOnce(bull: Job<RunJobPayload>) {
  const runId = crypto.randomUUID();
  const jobRow = await dbGetJobForWorker({ jobId: bull.data.jobId });

  if (jobRow === undefined) return;
  if (!jobRow.enabled) return;

  const [subscription, executionsThisMonth] = await Promise.all([
    getOrgActiveSubscriptionApi({ organizationId: jobRow.organizationId }),
    dbGetAmountOfExecutionsThisMonth({ jobId: jobRow.id }),
  ]);

  if (executionsThisMonth >= subscription.limits.executionsPerMonth) return;

  const startedAt = new Date();
  const scheduledFor = new Date(bull.data.scheduledForISO);

  const execId = crypto.randomUUID();
  const hmacSecret = await dbGetHmacSecretForWorker({ projectId: jobRow.projectId });

  let attempt = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lastError: any = null;
  let finalStatus: ExecutionStatus = 'failed';
  let httpStatus: number | null = null;
  let latencyMs: number | null = null;
  let responsePreview = '';
  let responseSize = 0;

  const maxAttempts = Math.max(1, 1 + jobRow.maxRetries);

  while (attempt < maxAttempts) {
    attempt++;

    const timeoutMs = jobRow.timeoutMs || RUN_DEFAULT_TIMEOUT_MS;

    try {
      const res = await executeHttp({
        method: jobRow.httpMethod,
        url: jobRow.url,
        headers: jobRow.headers ?? [],
        authorizationHeader: jobRow.authorizationHeader,
        body: jobRow.body ?? undefined,
        timeoutMs,
        runId,
        hmacSecret,
      });

      httpStatus = res.statusCode;
      latencyMs = res.latencyMs;
      responsePreview = res.responsePreview;
      responseSize = res.responseSize;

      const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
      finalStatus = isSuccess ? 'succeeded' : 'failed';
      lastError = isSuccess ? null : new Error(`HTTP ${res.statusCode}`);

      const payload = {
        jobId: jobRow.id,
        executionId: execId,
        status: finalStatus,
        httpStatus: res.statusCode,
        latencyMs: res.latencyMs,
        responseSize: res.responseSize,
      };

      const eventType = isSuccess ? 'job.execution.completed' : 'job.execution.failed';

      const sig =
        hmacSecret !== null
          ? crypto.createHmac('sha256', hmacSecret).update(JSON.stringify(payload)).digest('hex')
          : null;

      const webhookEndpoints = await dbGetWebhookEndpointsForEvent({
        projectId: jobRow.projectId,
        organizationId: jobRow.organizationId,
        eventType,
      });

      if (webhookEndpoints.length === 0) {
        if (isSuccess) {
          break;
        }

        continue;
      }

      const insertedEvent = await dbInsertWebhookEvent({
        eventType,
        projectId: jobRow.projectId,
        userId: jobRow.userId,
        organizationId: jobRow.organizationId,
        payload,
      });

      if (insertedEvent === undefined) {
        if (isSuccess) {
          break;
        }

        continue;
      }

      await Promise.all(
        webhookEndpoints.map((endpoint) =>
          betterFetch(endpoint.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(sig !== null ? { 'X-Easycron-Signature': `sha256=${sig}` } : {}),
            },
            body: JSON.stringify({
              eventType,
              projectId: jobRow.projectId,
              userId: jobRow.userId,
              payload,
            }),
            signal: AbortSignal.timeout(2000),
          }).catch((err) => {
            console.error(
              `Failed to deliver webhook to endpoint ${endpoint.id} for job ${jobRow.id}:`,
              err,
            );
          }),
        ),
      );

      if (isSuccess) {
        break;
      }

      continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      lastError = err?.name === 'AbortError' ? new Error('timeout') : err;
      finalStatus = err?.name === 'AbortError' ? 'timed_out' : 'failed';
    }

    if (attempt < maxAttempts) {
      const base = jobRow.backoffInitialMs;
      const factor = jobRow.backoffFactor;
      const jitter = Math.floor(Math.random() * (jobRow.jitterMs ?? 0));
      const sleepMs = Math.floor(base * Math.pow(factor, attempt - 1)) + jitter;
      await sleep(Math.min(sleepMs, 60_000));
    }
  }

  const finishedAt = new Date();

  await db.insert(executionTable).values({
    id: execId,
    jobId: jobRow.id,
    scheduledFor,
    startedAt,
    finishedAt,
    attempt,
    status: finalStatus,
    httpStatus,
    latencyMs,
    requestSize: Buffer.byteLength(jobRow.body ?? '', 'utf8'),
    responseSize,
    responseTruncated: responsePreview.length >= RUN_MAX_RESPONSE_PREVIEW_BYTES,
    errorMessage: lastError ? String(lastError?.message ?? lastError) : null,
    responsePreview,
  });

  const consecutiveFailures =
    finalStatus === 'succeeded' ? 0 : (jobRow.consecutiveFailures ?? 0) + 1;

  await dbUpdateJob({
    jobId: jobRow.id,
    organizationId: jobRow.organizationId,
    data: {
      consecutiveFailures,
      lastRunAt: finishedAt,
    },
  });
}
