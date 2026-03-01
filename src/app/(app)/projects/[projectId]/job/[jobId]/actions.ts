'use server';

import { checkPermissions, getUser } from '@/auth/utils';
import { dbDuplicateJob } from '@/db/functions/job';

export async function duplicateJobAction({ jobId }: { jobId: string }) {
  const user = await getUser();

  const hasPermission = await checkPermissions([
    {
      resource: 'job',
      permissions: ['create', 'update'],
    },
  ]);

  if (!hasPermission) {
    return {
      success: false,
      error: 'You do not have permission to create a job in this organization',
      code: 403,
    };
  }

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
