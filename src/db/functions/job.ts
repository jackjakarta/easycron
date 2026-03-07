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
  organizationId,
}: {
  jobId: string;
  organizationId: string;
}): Promise<JobModel | undefined> {
  const [job] = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.id, jobId), eq(jobTable.organizationId, organizationId)));

  return job;
}

export async function dbUpdateJob({
  jobId,
  organizationId,
  data,
}: {
  jobId: string;
  organizationId: string;
  data: UpdateJobModel;
}): Promise<JobModel | undefined> {
  const updateData: UpdateJobModel = { ...data };

  if ('authorizationHeader' in data) {
    updateData.authorizationHeader =
      data.authorizationHeader?.k?.trim() && data.authorizationHeader?.v?.trim()
        ? {
            k: data.authorizationHeader.k.trim(),
            v: encryptSecret(data.authorizationHeader.v.trim()),
          }
        : null;
  } else {
    delete updateData.authorizationHeader;
  }

  const [updatedJob] = await db
    .update(jobTable)
    .set(updateData)
    .where(and(eq(jobTable.id, jobId), eq(jobTable.organizationId, organizationId)))
    .returning();

  return updatedJob;
}

export async function dbDeleteJob({
  jobId,
  organizationId,
}: {
  jobId: string;
  organizationId: string;
}): Promise<JobModel | undefined> {
  const deleted = await db.transaction(async (tx) => {
    await tx.delete(executionTable).where(eq(executionTable.jobId, jobId));

    const [deleted] = await tx
      .delete(jobTable)
      .where(and(eq(jobTable.id, jobId), eq(jobTable.organizationId, organizationId)))
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

export async function dbGetJobCountByOrganizationId({
  organizationId,
}: {
  organizationId: string;
}): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobTable)
    .where(eq(jobTable.organizationId, organizationId));

  const count = result?.count ?? 0;

  return count;
}

export async function dbGetEnabledJobCountByOrganizationId({
  organizationId,
}: {
  organizationId: string;
}): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobTable)
    .where(and(eq(jobTable.organizationId, organizationId), eq(jobTable.enabled, true)));

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

export async function dbDuplicateJob({
  jobId,
  organizationId,
  userId,
}: {
  jobId: string;
  organizationId: string;
  userId: string;
}): Promise<JobModel | undefined> {
  const currentJob = await dbGetJobById({ jobId, organizationId });

  if (currentJob === undefined) {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, ...data } = currentJob;

  const duplicateJob = await dbInsertJob({
    ...data,
    name: `${data.name} (Copy)`,
    userId,
    organizationId,
    enabled: false,
  });

  return duplicateJob;
}
