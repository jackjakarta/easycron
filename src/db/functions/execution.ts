import { and, desc, eq, isNotNull } from 'drizzle-orm';

import { db } from '..';
import { executionTable, jobTable, type ExecutionModel } from '../schema';

export async function dbGetFinishedExecutionsByJobId({
  jobId,
  userId,
}: {
  jobId: string;
  userId: string;
}): Promise<ExecutionModel[]> {
  const executions = await db.transaction(async (tx) => {
    const [job] = await tx
      .select()
      .from(jobTable)
      .where(and(eq(jobTable.id, jobId), eq(jobTable.userId, userId)));

    if (job === undefined) {
      throw new Error('Job not found');
    }

    const executions = await tx
      .select()
      .from(executionTable)
      .where(and(eq(executionTable.jobId, jobId), isNotNull(executionTable.finishedAt)))
      .orderBy(desc(executionTable.finishedAt));

    return executions;
  });

  return executions;
}
