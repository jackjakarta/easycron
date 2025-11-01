import { and, desc, eq, gte, inArray, isNotNull, lt, sql } from 'drizzle-orm';

import { db } from '..';
import { executionTable, jobTable, projectTable, type ExecutionModel } from '../schema';

export async function dbGetAmountOfExecutionsThisMonth({
  jobId,
}: {
  jobId: string;
}): Promise<number> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [result] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(executionTable)
    .where(and(eq(executionTable.jobId, jobId), gte(executionTable.startedAt, monthStart)));

  return result?.count ?? 0;
}

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

export type ExecutionWithDetails = Pick<
  ExecutionModel,
  'id' | 'jobId' | 'status' | 'finishedAt' | 'startedAt' | 'httpStatus' | 'latencyMs'
> & {
  jobName: string;
  projectName: string;
};

export async function dbGetRecentExecutions({
  userId,
}: {
  userId: string;
}): Promise<ExecutionWithDetails[]> {
  const recentExecutions = await db
    .select({
      id: executionTable.id,
      jobId: executionTable.jobId,
      status: executionTable.status,
      finishedAt: executionTable.finishedAt,
      startedAt: executionTable.startedAt,
      httpStatus: executionTable.httpStatus,
      jobName: jobTable.name,
      projectName: projectTable.name,
      latencyMs: executionTable.latencyMs,
    })
    .from(executionTable)
    .innerJoin(jobTable, eq(executionTable.jobId, jobTable.id))
    .innerJoin(projectTable, eq(jobTable.projectId, projectTable.id))
    .where(eq(jobTable.userId, userId))
    .orderBy(desc(executionTable.finishedAt))
    .limit(5);

  return recentExecutions;
}

export async function dbGetJobsExecutionsSuccessRate({ userId }: { userId: string }) {
  const [result] = await db
    .select({
      successRate: sql<number>`
        COUNT(*) FILTER (WHERE ${executionTable.status} = 'succeeded')::float
        / NULLIF(COUNT(*), 0) * 100
      `,
      avgLatencyMs: sql<number>`AVG(${executionTable.latencyMs})`,
    })
    .from(executionTable)
    .innerJoin(jobTable, eq(executionTable.jobId, jobTable.id))
    .where(eq(jobTable.userId, userId));

  return {
    successRate: result?.successRate ?? 0,
    avgLatencyMs: result?.avgLatencyMs ?? 0,
  };
}

export async function dbDeleteOldExecutions() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const deletedCount = await db.transaction(async (tx) => {
    const idsToDelete = await tx
      .select({ id: executionTable.id })
      .from(executionTable)
      .where(lt(executionTable.startedAt, oneWeekAgo))
      .limit(10_000);

    if (idsToDelete.length > 0) {
      await tx.delete(executionTable).where(
        inArray(
          executionTable.id,
          idsToDelete.map((r) => r.id),
        ),
      );
    }

    return idsToDelete.length;
  });

  return deletedCount;
}
