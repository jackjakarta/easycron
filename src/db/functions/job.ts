import { decryptSecret, encryptSecret } from '@/utils/crypto';
import { and, eq, sql } from 'drizzle-orm';

import { db } from '..';
import {
  executionTable,
  jobTable,
  type InsertJobModel,
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
  const authorizationHeader =
    data.authorizationHeader?.k?.trim() && data.authorizationHeader?.v?.trim()
      ? { k: data.authorizationHeader.k.trim(), v: encryptSecret(data.authorizationHeader.v.trim()) }
      : null;

  const [updatedJob] = await db
    .update(jobTable)
    .set({ ...data, authorizationHeader })
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
  const [insertedJob] = await db
    .insert(jobTable)
    .values({
      ...data,
      authorizationHeader:
        data.authorizationHeader?.k?.trim() && data.authorizationHeader?.v?.trim()
          ? {
              k: data.authorizationHeader.k.trim(),
              v: encryptSecret(data.authorizationHeader.v.trim()),
            }
          : undefined,
    })
    .returning();

  return insertedJob;
}

export async function dbGetJobCountByUserId({ userId }: { userId: string }): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobTable)
    .where(eq(jobTable.userId, userId));

  const count = result?.count ?? 0;

  return count;
}

export async function dbGetEnabledJobCountByUserId({
  userId,
}: {
  userId: string;
}): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobTable)
    .where(and(eq(jobTable.userId, userId), eq(jobTable.enabled, true)));

  const count = result?.count ?? 0;

  return count;
}

export async function dbGetJobForWorker({ jobId }: { jobId: string }) {
  const [job] = await db.select().from(jobTable).where(eq(jobTable.id, jobId));

  if (job === undefined) {
    return undefined;
  }

  return {
    ...job,
    authorizationHeader:
      job.authorizationHeader !== null
        ? {
            v: decryptSecret(job.authorizationHeader.v),
            k: job.authorizationHeader.k,
          }
        : undefined,
  };
}
