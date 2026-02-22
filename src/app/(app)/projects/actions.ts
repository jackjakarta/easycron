'use server';

import { checkPermissions, getUser } from '@/auth/utils';
import { dbGetProjectCountByOrganizationId, dbInsertProject } from '@/db/functions/project';

export async function createProjectAction({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const user = await getUser();
  const { subscription, organizationId } = user;

  const hasPermission = await checkPermissions([
    {
      resource: 'project',
      permissions: ['create'],
    },
  ]);

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
