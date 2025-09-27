import { eq } from 'drizzle-orm';

import { db } from '..';
import { executionTable, jobTable, type JobModel, type UpdateJobModel } from '../schema';

export async function dbGetJobById({ jobId }: { jobId: string }): Promise<JobModel | undefined> {
  const [job] = await db.select().from(jobTable).where(eq(jobTable.id, jobId));

  return job;
}

export async function dbUpdateJob({
  jobId,
  data,
}: {
  jobId: string;
  data: UpdateJobModel;
}): Promise<JobModel | undefined> {
  const [updatedJob] = await db
    .update(jobTable)
    .set(data)
    .where(eq(jobTable.id, jobId))
    .returning();

  return updatedJob;
}

export async function dbDeleteJob({ jobId }: { jobId: string }): Promise<JobModel | undefined> {
  const deleted = await db.transaction(async (tx) => {
    await tx.delete(executionTable).where(eq(executionTable.jobId, jobId));
    const [deleted] = await tx.delete(jobTable).where(eq(jobTable.id, jobId)).returning();

    return deleted;
  });

  return deleted;
}
