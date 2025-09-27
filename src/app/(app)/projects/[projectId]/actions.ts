'use server';

import { getUser } from '@/auth/utils';
import { dbDeleteJob, dbUpdateJob } from '@/db/functions/job';

export async function enableOrDisableJobAction({
  jobId,
  enabled,
}: {
  jobId: string;
  enabled: boolean;
}) {
  await getUser();
  const updatedJob = await dbUpdateJob({ jobId, data: { enabled } });

  if (updatedJob === undefined) {
    throw new Error('Failed to update job');
  }

  return updatedJob;
}

export async function deleteJobAction({ jobId }: { jobId: string }) {
  await getUser();
  const deletedJob = await dbDeleteJob({ jobId });

  if (deletedJob === undefined) {
    throw new Error('Failed to delete job');
  }

  return deletedJob;
}
