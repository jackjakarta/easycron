'use server';

import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { dbGetProjectCountByOrganizationId, dbInsertProject } from '@/db/functions/project';
import { headers } from 'next/headers';

export async function createProjectAction({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const user = await getUser();
  const { subscription, organizationId } = user;

  const { success: hasPermission } = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      permissions: {
        project: ['view', 'create'],
      },
    },
  });

  if (!hasPermission) {
    return {
      success: false,
      error: 'You do not have permission.',
      code: 403,
    };
  }

  if (subscription.type === 'free') {
    const projectCount = await dbGetProjectCountByOrganizationId({ organizationId });

    if (projectCount >= subscription.limits.projectsAmount) {
      return {
        success: false,
        error: 'You have reached the maximum number of projects for your plan.',
        code: 402,
      };
    }
  }

  const newProject = await dbInsertProject({
    name,
    description,
    userId: user.id,
    organizationId,
  });

  if (newProject === undefined) {
    return {
      success: false,
      error: 'Failed to create project',
      code: 500,
    };
  }

  return { success: true, data: newProject, code: 201 };
}
