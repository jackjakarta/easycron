/**
 * Scheduler:
 * - finds due jobs (enabled AND next_run_at <= now)
 * - for each:
 *    - compute next_run_at
 *    - atomically update in DB
 *    - enqueue a run with a dedupe lock
 */

import { computeNextRun, now } from '@/core/cron';
import { tryLock } from '@/core/locks';
import { db } from '@/db';
import { jobTable } from '@/db/schema';
import { getRunQueue } from '@/queue/queue';
import { and, eq, lte } from 'drizzle-orm'; // adapt if your ORM imports differ

const POLL_INTERVAL_MS = 1000; // tight loop is fine; adjust
const BATCH_SIZE = 500;

async function tick() {
  const t0 = Date.now();
  const q = getRunQueue();
  const current = now();

  // fetch batch of due jobs
  const due = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.enabled, true), lte(jobTable.nextRunAt, current)))
    .limit(BATCH_SIZE);

  if (due.length === 0) return;

  for (const j of due) {
    // small lock to avoid multiple schedulers double-enqueueing this occurrence
    const lockKey = `lock:sched:${j.id}:${j.nextRunAt.toISOString()}`;
    const got = await tryLock(lockKey, 15_000);
    if (!got) continue;

    // compute *next* occurrence from "current", NOT from stale nextRunAt
    const next = computeNextRun(j.scheduleCron, j.timezone, current);

    // transaction: bump job pointers
    await db.transaction(async (tx) => {
      await tx
        .update(jobTable)
        .set({
          lastRunAt: j.nextRunAt,
          nextRunAt: next,
          updatedAt: new Date(),
        })
        .where(eq(jobTable.id, j.id));
    });

    // enqueue the actual run
    await q.add(
      'run',
      { jobId: j.id, scheduledForISO: j.nextRunAt.toISOString() },
      {
        // run immediately; worker handles retries
        jobId: `run:${j.id}:${j.nextRunAt.toISOString()}`, // dedupe per occurrence
        removeOnComplete: 1000,
        removeOnFail: 1000,
        priority: 2,
      },
    );
  }

  const dt = Date.now() - t0;
  if (dt > 500) {
    // optional: log slow ticks
    // console.log(`Scheduler tick processed ${due.length} jobs in ${dt}ms`);
  }
}

async function main() {
  console.log('Scheduler started');
  let stopping = false;

  process.on('SIGINT', () => (stopping = true));
  process.on('SIGTERM', () => (stopping = true));

  while (!stopping) {
    try {
      await tick();
    } catch (e) {
      console.error('Scheduler error', e);
      // small backoff on error
      await sleep(1000);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  console.log('Scheduler stopped');
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
