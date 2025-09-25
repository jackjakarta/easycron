import { randomUUID } from 'crypto';

import { executeHttp } from '@/core/http';
import { db } from '@/db';
import { executionTable, jobTable, secretTable } from '@/db/schema';
import { connection, RUN_QUEUE_NAME, RunJobPayload } from '@/queue/queue';
import { Job, Worker } from 'bullmq';
import { eq } from 'drizzle-orm';

type Status = 'succeeded' | 'failed' | 'timed_out';

const RUN_DEFAULT_TIMEOUT_MS = 3214;
const RUN_MAX_RESPONSE_PREVIEW_BYTES = 4096;
const WORKER_CONCURRENCY = 20;

async function fetchHmacSecret(keyId: string | null): Promise<string | null> {
  if (!keyId) return null;
  const [row] = await db.select().from(secretTable).where(eq(secretTable.id, keyId));
  if (!row) return null;
  // decrypt your secret here if stored encrypted
  return row.value;
}

async function runOnce(bull: Job<RunJobPayload>) {
  const runId = randomUUID();

  // Load the job fresh
  const [jobRow] = await db.select().from(jobTable).where(eq(jobTable.id, bull.data.jobId));

  if (!jobRow) return; // deleted

  // If disabled after scheduling—skip
  if (!jobRow.enabled) return;

  const scheduledFor = new Date(bull.data.scheduledForISO);

  // Prepare execution record (attempt=1 initially)
  const execId = randomUUID();
  const startedAt = new Date();

  // Optional: enforce quotas/plan here; if exceeded, record skipped
  // if (await quotaExceeded(jobRow.projectId)) { ... }

  // Resolve HMAC secret if configured
  const hmacSecret = await fetchHmacSecret(jobRow.hmacSigningKeyId);

  let attempt = 0;
  let lastError: any = null;
  let finalStatus: Status = 'failed';
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

      // consider 2xx and 3xx as success
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
      // backoff with jitter
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

  // Update job failure streak
  const consecutiveFailures =
    finalStatus === 'succeeded' ? 0 : (jobRow.consecutiveFailures ?? 0) + 1;

  await db
    .update(jobTable)
    .set({ consecutiveFailures, lastRunAt: finishedAt, updatedAt: finishedAt })
    .where(eq(jobTable.id, jobRow.id));

  // Optional: emit alert when threshold reached (N consecutive failures).
  // (Do in a separate "alerter" job or here inline if N is small.)
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('Worker starting…');

  const concurrency = WORKER_CONCURRENCY;

  const worker = new Worker<RunJobPayload>(RUN_QUEUE_NAME, async (bullJob) => runOnce(bullJob), {
    connection,
    concurrency,
    // Important: disable internal attempts; we implement attempts inside runOnce()
    // If you prefer Bull attempts, set attempts here and simplify runOnce.
  });

  worker.on('active', (job) => {
    // console.log('active', job.id);
  });
  worker.on('completed', (job) => {
    // console.log('completed', job.id);
  });
  worker.on('failed', (job, err) => {
    console.error('worker failed', job?.id, err);
  });

  const shutdown = async () => {
    console.log('Worker shutting down…');
    await worker.close();
    await connection.quit();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
