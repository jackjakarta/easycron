'use server';

import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { dbInsertJob } from '@/db/functions/job';
import { headers } from 'next/headers';

import { type JobFormData } from '../../projects/[projectId]/schemas';

export async function createJobInOrganizationAction({
  job,
  projectId,
}: {
  job: JobFormData;
  projectId: string;
}) {
  try {
    const user = await getUser();

    const activeOrganization = await auth.api.getFullOrganization({
      headers: await headers(),
    });

    if (activeOrganization === null) {
      throw new Error('No active organization found');
    }

    const permission = await auth.api.hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          project: ['create'],
        },
      },
    });

    if (!permission.success) {
      throw new Error('You do not have permission to create a job in this organization');
    }

    const newJob = await dbInsertJob({
      ...job,
      projectId,
      userId: user.id,
      organizationId: activeOrganization.id,
      nextRunAt: new Date(),
    });

    if (newJob === undefined) {
      throw new Error('Failed to create job');
    }

    return newJob;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}
