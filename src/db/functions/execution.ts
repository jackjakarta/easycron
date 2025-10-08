import { and, desc, eq, isNotNull } from 'drizzle-orm';

import { db } from '..';
import { executionTable, jobTable, type ExecutionModel } from '../schema';

export async function dbGetFinishedExecutionsByJobId({
  jobId,
}: {
  jobId: string;
}): Promise<ExecutionModel[]> {
  const executions = await db
    .select()
    .from(executionTable)
    .where(and(eq(executionTable.jobId, jobId), isNotNull(executionTable.finishedAt)))
    .orderBy(desc(executionTable.finishedAt))
    .limit(25);

  return executions;
}

export async function dbGetRecentExecutions({ userId }: { userId: string }) {
  const recentExecutions = await db
    .select({
      id: executionTable.id,
      jobId: executionTable.jobId,
      status: executionTable.status,
      finishedAt: executionTable.finishedAt,
      startedAt: executionTable.startedAt,
      httpStatus: executionTable.httpStatus,
      jobName: jobTable.name,
      latencyMs: executionTable.latencyMs,
    })
    .from(executionTable)
    .innerJoin(jobTable, eq(executionTable.jobId, jobTable.id))
    .where(eq(jobTable.userId, userId))
    .orderBy(desc(executionTable.finishedAt))
    .limit(5);

  return recentExecutions;
}
