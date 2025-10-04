import { and, desc, eq, isNotNull } from 'drizzle-orm';

import { db } from '..';
import { executionTable, type ExecutionModel } from '../schema';

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
