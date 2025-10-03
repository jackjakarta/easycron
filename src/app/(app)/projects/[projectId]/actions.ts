'use server';

import { getUser } from '@/auth/utils';
import {
  dbDeleteJob,
  dbGetJobById,
  dbInsertJob,
  dbUpdateJob,
  dbUpdateProjects,
} from '@/db/functions/job';
import { dbGetProjectById } from '@/db/functions/project';
import { dbUpsertSecret } from '@/db/functions/secret';
import { getRunQueue } from '@/queue/queue';
import { encryptSecret } from '@/utils/crypto';
import { createHmacSigningKey } from '@/utils/hmac';

import { type JobFormData } from './schemas';

export async function runJobNowAction({ jobId }: { jobId: string }) {
  const user = await getUser();
  const job = await dbGetJobById({ jobId, userId: user.id });

  if (job === undefined) {
    throw new Error('Job not found');
  }

  const q = getRunQueue();
  const iso = new Date().toISOString();

  const payload = { jobId: job.id, scheduledForISO: iso };
  const customId = occurrenceJobId(job.id, payload.scheduledForISO);

  await q.add('run', payload, {
    jobId: customId,
    removeOnComplete: 1000,
    removeOnFail: 1000,
    priority: 2,
  });

  return;
}

export async function createJobAction({
  data,
  projectId,
}: {
  data: JobFormData;
  projectId: string;
}) {
  const user = await getUser();
  const newJob = await dbInsertJob({
    ...data,
    projectId,
    userId: user.id,
    nextRunAt: new Date(),
  });

  if (newJob === undefined) {
    throw new Error('Failed to create job');
  }

  return newJob;
}

export async function enableOrDisableJobAction({
  jobId,
  enabled,
}: {
  jobId: string;
  enabled: boolean;
}) {
  const user = await getUser();
  const updatedJob = await dbUpdateJob({ jobId, userId: user.id, data: { enabled } });

  if (updatedJob === undefined) {
    throw new Error('Failed to update job');
  }

  return updatedJob;
}

export async function deleteJobAction({ jobId }: { jobId: string }) {
  const user = await getUser();
  const deletedJob = await dbDeleteJob({ jobId, userId: user.id });

  if (deletedJob === undefined) {
    throw new Error('Failed to delete job');
  }

  return deletedJob;
}

export async function updateJobAction({ jobId, data }: { jobId: string; data: JobFormData }) {
  const user = await getUser();
  const updatedJob = await dbUpdateJob({ jobId, userId: user.id, data });

  if (updatedJob === undefined) {
    throw new Error('Failed to update job');
  }

  return updatedJob;
}

function occurrenceJobId(jobId: string, scheduledISO: string) {
  const safeISO = scheduledISO.replace(/[:.]/g, '');
  return `run-${jobId}-${safeISO}`;
}

export async function createProjectSecretAction({ projectId }: { projectId: string }) {
  const user = await getUser();
  const project = await dbGetProjectById({ projectId, userId: user.id });

  if (project === undefined) {
    throw new Error('Unauthorized');
  }

  const rawSecret = createHmacSigningKey();
  const encryptedSecret = encryptSecret(rawSecret);

  const newSecret = await dbUpsertSecret({
    name: 'HMAC Signing Key',
    value: encryptedSecret,
    projectId: project.id,
    userId: user.id,
  });

  if (newSecret === undefined) {
    throw new Error('Failed to create secret');
  }

  const updatedRows = await dbUpdateProjects({
    projectId: project.id,
    userId: user.id,
    data: { hmacSigningKeyId: newSecret.id },
  });

  if (updatedRows.length === 0) {
    throw new Error('Failed to update jobs with new secret');
  }

  return { ...newSecret, rawSecret };
}
