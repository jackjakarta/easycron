import { and, desc, eq, isNotNull, sql } from 'drizzle-orm';

import { db } from '..';
import { executionTable, jobTable, projectTable, type ExecutionModel } from '../schema';

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
