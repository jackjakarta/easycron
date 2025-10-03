import { randomUUID } from 'crypto';

import { executeHttp } from '@/core/http';
import { db } from '@/db';
import { dbUpdateJob } from '@/db/functions/job';
import { executionTable, jobTable, secretTable, type ExecutionStatus } from '@/db/schema';
import { connection, RUN_QUEUE_NAME, type RunJobPayload } from '@/queue/queue';
import { decryptSecret } from '@/utils/crypto';
import { Job, Worker } from 'bullmq';
import { eq } from 'drizzle-orm';

const RUN_DEFAULT_TIMEOUT_MS = 3214;
const RUN_MAX_RESPONSE_PREVIEW_BYTES = 4096;
const WORKER_CONCURRENCY = 20;

async function getHmacSecret({ keyId }: { keyId: string | null }): Promise<string | null> {
  if (keyId === null) {
    return null;
  }

  const [secretRow] = await db.select().from(secretTable).where(eq(secretTable.id, keyId));

  if (secretRow === undefined) {
    return null;
  }

  const encrypted = secretRow.value;
  const decrypted = decryptSecret(encrypted);

  return decrypted;
}

async function runOnce(bull: Job<RunJobPayload>) {
  const runId = randomUUID();
  const [jobRow] = await db.select().from(jobTable).where(eq(jobTable.id, bull.data.jobId));

  if (jobRow === undefined) return;
  if (!jobRow.enabled) return;

  const scheduledFor = new Date(bull.data.scheduledForISO);

  const execId = randomUUID();
  const startedAt = new Date();

  // Optional: enforce quotas/plan here; if exceeded, record skipped
  // if (await quotaExceeded(jobRow.projectId)) { ... }

  const hmacSecret = await getHmacSecret({ keyId: jobRow.hmacSigningKeyId });

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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.info('Worker starting…');
  const concurrency = WORKER_CONCURRENCY;

  const worker = new Worker<RunJobPayload>(RUN_QUEUE_NAME, async (bullJob) => runOnce(bullJob), {
    connection,
    concurrency,
  });

  worker.on('active', (job) => {
    console.info('active', job.id);
  });

  worker.on('completed', (job) => {
    console.info('completed', job.id);
  });

  worker.on('failed', (job, err) => {
    console.error('worker failed', job?.id, err);
  });

  async function shutdown() {
    console.info('Worker shutting down…');
    await worker.close();
    await connection.quit();
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
