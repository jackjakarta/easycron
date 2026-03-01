import { writeFileSync } from 'fs';

import { db } from '@/db';
import { dbRefreshExecutionAnalytics } from '@/db/functions/execution-analytics';
import { jobTable } from '@/db/schema';
import { getRunQueue } from '@/queue/queue';
import { computeNextRun, now } from '@/utils/cron';
import { occurrenceJobId } from '@/utils/job';
import { tryLock } from '@/utils/locks';
import { and, eq, lte } from 'drizzle-orm';

const BATCH_SIZE = 500;
const MV_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
let lastMvRefresh = 0;

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function tick() {
  const t0 = Date.now();

  if (t0 - lastMvRefresh >= MV_REFRESH_INTERVAL_MS) {
    try {
      await dbRefreshExecutionAnalytics();
      lastMvRefresh = t0;
      console.info('Scheduler: refreshed execution_hourly_stats materialized view');
    } catch (e) {
      console.warn('Scheduler: failed to refresh execution_hourly_stats', e);
    }
  }

  const q = getRunQueue();
  const current = now();

  const due = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.enabled, true), lte(jobTable.nextRunAt, current)))
    .limit(BATCH_SIZE);

  if (due.length === 0) return;

  for (const j of due) {
    try {
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
    } catch (e) {
      console.warn(`Scheduler: error processing job ${j.id}, skipping`, e);
    }
  }

  const dt = Date.now() - t0;
  if (dt > 500) {
    // optional: log slow ticks
    console.info(`Scheduler tick processed ${due.length} jobs in ${dt}ms`);
  }

  writeFileSync('/tmp/scheduler-heartbeat', Date.now().toString());
}
