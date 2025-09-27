'use server';

import { getUser } from '@/auth/utils';
import { dbDeleteJob, dbGetJobById, dbUpdateJob } from '@/db/functions/job';
import { getRunQueue } from '@/queue/queue';

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

function occurrenceJobId(jobId: string, scheduledISO: string) {
  const safeISO = scheduledISO.replace(/[:.]/g, '');
  return `run-${jobId}-${safeISO}`;
}
