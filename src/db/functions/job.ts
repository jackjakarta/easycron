import { and, eq } from 'drizzle-orm';

import { db } from '..';
import {
  executionTable,
  InsertJobModel,
  jobTable,
  type JobModel,
  type UpdateJobModel,
} from '../schema';

export async function dbGetJobById({
  jobId,
  userId,
}: {
  jobId: string;
  userId: string;
}): Promise<JobModel | undefined> {
  const [job] = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.id, jobId), eq(jobTable.userId, userId)));

  return job;
}

export async function dbUpdateJob({
  jobId,
  userId,
  data,
}: {
  jobId: string;
  userId: string;
  data: UpdateJobModel;
}): Promise<JobModel | undefined> {
  const [updatedJob] = await db
    .update(jobTable)
    .set(data)
    .where(and(eq(jobTable.id, jobId), eq(jobTable.userId, userId)))
    .returning();

  return updatedJob;
}

export async function dbDeleteJob({
  jobId,
  userId,
}: {
  jobId: string;
  userId: string;
}): Promise<JobModel | undefined> {
  const deleted = await db.transaction(async (tx) => {
    await tx.delete(executionTable).where(eq(executionTable.jobId, jobId));

    const [deleted] = await tx
      .delete(jobTable)
      .where(and(eq(jobTable.id, jobId), eq(jobTable.userId, userId)))
      .returning();

    return deleted;
  });

  return deleted;
}

export async function dbInsertJob(data: InsertJobModel): Promise<JobModel | undefined> {
  const [insertedJob] = await db.insert(jobTable).values(data).returning();

  return insertedJob;
}

export async function dbUpdateProjects({
  projectId,
  userId,
  data,
}: {
  projectId: string;
  userId: string;
  data: UpdateJobModel;
}): Promise<JobModel[]> {
  const updated = await db
    .update(jobTable)
    .set(data)
    .where(and(eq(jobTable.projectId, projectId), eq(jobTable.userId, userId)))
    .returning();

  return updated;
}
