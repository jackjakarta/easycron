import { randomUUID } from 'crypto';

import { executeHttp } from '@/core/http';
import { db } from '@/db';
import { dbUpdateJob } from '@/db/functions/job';
import { executionTable, jobTable, type ExecutionStatus } from '@/db/schema';
import { type RunJobPayload } from '@/queue/queue';
import { Job } from 'bullmq';
import { eq } from 'drizzle-orm';

import { getHmacSecret } from './secret';
import { sleep } from './utils';

const RUN_DEFAULT_TIMEOUT_MS = 3214;
const RUN_MAX_RESPONSE_PREVIEW_BYTES = 4096;

export async function runOnce(bull: Job<RunJobPayload>) {
  const runId = randomUUID();
  const [jobRow] = await db.select().from(jobTable).where(eq(jobTable.id, bull.data.jobId));

  if (jobRow === undefined) return;
  if (!jobRow.enabled) return;

  const execId = randomUUID();
  const scheduledFor = new Date(bull.data.scheduledForISO);
  const startedAt = new Date();

  // Optional: enforce quotas/plan here; if exceeded, record skipped
  // if (await quotaExceeded(jobRow.projectId)) { ... }

  const projectId = jobRow.projectId;
  const hmacSecret = await getHmacSecret({ projectId });

  let attempt = 0;
  let lastError: any = null;
  let finalStatus: ExecutionStatus = 'failed';
  let httpStatus: number | null = null;
  let latencyMs: number | null = null;
  let responsePreview = '';
  let responseSize = 0;

  const maxAttempts = Math.max(1, 1 + jobRow.maxRetries); // initial try + retries

  while (attempt < maxAttempts) {
    attempt++;

    const timeoutMs = jobRow.timeoutMs || RUN_DEFAULT_TIMEOUT_MS;

    try {
      const res = await executeHttp({
        method: jobRow.httpMethod,
        url: jobRow.url,
        headers: jobRow.headers ?? [],
        body: jobRow.body ?? undefined,
        timeoutMs,
        runId,
        hmacSecret,
      });

      httpStatus = res.statusCode;
      latencyMs = res.latencyMs;
      responsePreview = res.responsePreview;
      responseSize = res.responseSize;

      if (res.statusCode >= 200 && res.statusCode < 400) {
        finalStatus = 'succeeded';
        lastError = null;
        break;
      } else {
        lastError = new Error(`HTTP ${res.statusCode}`);
      }
    } catch (err: any) {
      lastError = err?.name === 'AbortError' ? new Error('timeout') : err;
      finalStatus = err?.name === 'AbortError' ? 'timed_out' : 'failed';
    }

    if (attempt < maxAttempts) {
      const base = jobRow.backoffInitialMs;
      const factor = jobRow.backoffFactor;
      const jitter = Math.floor(Math.random() * (jobRow.jitterMs ?? 0));
      const sleepMs = Math.floor(base * Math.pow(factor, attempt - 1)) + jitter;
      await sleep(Math.min(sleepMs, 60_000)); // cap at 60s between attempts
    }
  }

  const finishedAt = new Date();

  // Record execution
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
    userId: jobRow.userId,
    data: {
      consecutiveFailures,
      lastRunAt: finishedAt,
    },
  });

  // Optional: emit alert when threshold reached (N consecutive failures).
  // (Do in a separate "alerter" job or here inline if N is small.)
}
