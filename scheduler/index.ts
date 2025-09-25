import { computeNextRun, now } from '@/core/cron';
import { tryLock } from '@/core/locks';
import { db } from '@/db';
import { jobTable } from '@/db/schema';
import { getRunQueue } from '@/queue/queue';
import { and, eq, lte } from 'drizzle-orm';

const POLL_INTERVAL_MS = 1000;
const BATCH_SIZE = 500;

async function tick() {
  const t0 = Date.now();
  const q = getRunQueue();
  const current = now();

  const due = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.enabled, true), lte(jobTable.nextRunAt, current)))
    .limit(BATCH_SIZE);

  if (due.length === 0) return;

  for (const j of due) {
    const lockKey = `lock:sched:${j.id}:${j.nextRunAt.toISOString()}`;
    const got = await tryLock(lockKey, 15_000);
    if (!got) continue;

    const current = now();
    const next = computeNextRun(j.scheduleCron, j.timezone, current);

    // 1) enqueue with colon-free jobId
    const payload = { jobId: j.id, scheduledForISO: j.nextRunAt.toISOString() };
    const customId = occurrenceJobId(j.id, payload.scheduledForISO);
    await q.add('run', payload, {
      jobId: customId,
      removeOnComplete: 1000,
      removeOnFail: 1000,
      priority: 2,
    });

    console.info(
      `Scheduler picked up job: ${j.id} (scheduled for ${j.nextRunAt.toISOString()}, next run: ${next?.toISOString() || 'none'})`,
    );

    await db
      .update(jobTable)
      .set({ lastRunAt: j.nextRunAt, nextRunAt: next, updatedAt: new Date() })
      .where(eq(jobTable.id, j.id));
  }

  const dt = Date.now() - t0;
  if (dt > 500) {
    // optional: log slow ticks
    console.info(`Scheduler tick processed ${due.length} jobs in ${dt}ms`);
  }
}

async function main() {
  console.info('Scheduler started');
  let stopping = false;

  process.on('SIGINT', () => (stopping = true));
  process.on('SIGTERM', () => (stopping = true));

  while (!stopping) {
    try {
      await tick();
    } catch (e) {
      console.error('Scheduler error', e);
      await sleep(1000);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  console.info('Scheduler stopped');
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function occurrenceJobId(jobId: string, scheduledISO: string) {
  const safeISO = scheduledISO.replace(/[:.]/g, '');
  return `run-${jobId}-${safeISO}`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
