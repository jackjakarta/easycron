'use server';

import { getUser } from '@/auth/utils';
import {
  dbDeleteJob,
  dbGetJobById,
  dbGetJobCountByOrganizationId,
  dbInsertJob,
  dbUpdateJob,
} from '@/db/functions/job';
import { dbDeleteProject, dbGetProjectById } from '@/db/functions/project';
import { dbDeleteSecret, dbUpsertSecret } from '@/db/functions/secret';
import { getRunQueue, type RunJobPayload } from '@/queue/queue';
import { generateCronExpression } from '@/utils/ai';
import { encryptSecret } from '@/utils/crypto';
import { createHmacSigningKey } from '@/utils/hmac';
import { occurrenceJobId } from '@/utils/job';

import { type JobFormData } from './schemas';

export async function runJobNowAction({ jobId }: { jobId: string }) {
  const user = await getUser();
  const job = await dbGetJobById({ jobId, organizationId: user.organizationId });

  if (job === undefined) {
    throw new Error('Job not found');
  }

  const q = getRunQueue();
  const iso = new Date().toISOString();

  const payload: RunJobPayload = { jobId: job.id, scheduledForISO: iso };
  const customId = occurrenceJobId(payload.jobId, payload.scheduledForISO);

  await q.add('run', payload, {
    jobId: customId,
    removeOnComplete: 1000,
    removeOnFail: 1000,
    priority: 2,
  });
}

export async function createJobAction({
  data,
  projectId,
}: {
  data: JobFormData;
  projectId: string;
}) {
  const user = await getUser();
  const { subscription, organizationId } = user;

  if (subscription.type === 'free') {
    const jobsCount = await dbGetJobCountByOrganizationId({ organizationId });

    if (jobsCount >= subscription.limits.jobsAmount) {
      return { success: false, error: 'Job limit reached for free plan', code: 402 };
    }
  }

  const newJob = await dbInsertJob({
    ...data,
    projectId,
    userId: user.id,
    organizationId,
    nextRunAt: new Date(),
  });

  if (newJob === undefined) {
    return { success: false, error: 'Failed to create job', code: 500 };
  }

  return { success: true, data: newJob, code: 201 };
}

export async function enableOrDisableJobAction({
  jobId,
  enabled,
}: {
  jobId: string;
  enabled: boolean;
}) {
  const user = await getUser();
  const updatedJob = await dbUpdateJob({
    jobId,
    organizationId: user.organizationId,
    data: { enabled },
  });

  if (updatedJob === undefined) {
    throw new Error('Failed to update job');
  }

  return updatedJob;
}

export async function deleteJobAction({ jobId }: { jobId: string }) {
  const user = await getUser();
  const deletedJob = await dbDeleteJob({ jobId, organizationId: user.organizationId });

  if (deletedJob === undefined) {
    throw new Error('Failed to delete job');
  }

  return deletedJob;
}

export async function updateJobAction({ jobId, data }: { jobId: string; data: JobFormData }) {
  const user = await getUser();
  const updatedJob = await dbUpdateJob({ jobId, organizationId: user.organizationId, data });

  if (updatedJob === undefined) {
    throw new Error('Failed to update job');
  }

  return updatedJob;
}

export async function createOrUpdateProjectSecretAction({ projectId }: { projectId: string }) {
  const user = await getUser();
  const { organizationId } = user;
  const project = await dbGetProjectById({ projectId, organizationId });

  if (project === undefined) {
    throw new Error('Unauthorized');
  }

  const rawSecret = createHmacSigningKey();
  const encryptedSecret = encryptSecret(rawSecret);

  const newSecret = await dbUpsertSecret({
    name: `${project.name} - HMAC Signing Key`,
    value: encryptedSecret,
    projectId: project.id,
    userId: user.id,
    organizationId,
  });

  if (newSecret === undefined) {
    throw new Error('Failed to create or update secret');
  }

  return { ...newSecret, rawSecret };
}

export async function generateCronExpressionAction({ prompt }: { prompt: string }) {
  await getUser();
  const { cronExpression } = await generateCronExpression(prompt);

  return cronExpression;
}

export async function deleteProjectSecretAction({ projectId }: { projectId: string }) {
  const user = await getUser();
  const deletedSecret = await dbDeleteSecret({
    projectId,
    organizationId: user.organizationId,
  });

  if (deletedSecret === undefined) {
    throw new Error('Failed to delete secret');
  }

  return deletedSecret;
}

export async function deleteProjectAction({ projectId }: { projectId: string }) {
  const user = await getUser();
  const deletedProject = await dbDeleteProject({
    projectId,
    organizationId: user.organizationId,
  });

  if (deletedProject === undefined) {
    throw new Error('Failed to delete project');
  }

  return deletedProject;
}
