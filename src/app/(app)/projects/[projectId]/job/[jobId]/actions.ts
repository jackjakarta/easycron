'use server';

import { getUser } from '@/auth/utils';
import { dbDuplicateJob } from '@/db/functions/job';

export async function duplicateJobAction({ jobId }: { jobId: string }) {
  const user = await getUser();
  const duplicatedJob = await dbDuplicateJob({
    jobId,
    organizationId: user.organizationId,
    userId: user.id,
  });

  if (duplicatedJob === undefined) {
    throw new Error('Job not found');
  }

  return duplicatedJob;
}
