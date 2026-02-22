import { desc, eq } from 'drizzle-orm';

import { db } from '..';
import { executionHourlyStatsView } from '../schema';

export type ExecutionHourlyStats = typeof executionHourlyStatsView.$inferSelect;

export async function dbGetExecutionAnalytics({
  jobId,
}: {
  jobId: string;
}): Promise<ExecutionHourlyStats[]> {
  return db
    .select()
    .from(executionHourlyStatsView)
    .where(eq(executionHourlyStatsView.jobId, jobId))
    .orderBy(desc(executionHourlyStatsView.bucket))
    .limit(168);
}

export async function dbRefreshExecutionAnalytics(): Promise<void> {
  await db.refreshMaterializedView(executionHourlyStatsView).concurrently();
}
