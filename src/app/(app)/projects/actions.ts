'use server';

import { getUser } from '@/auth/utils';
import { dbGetProjectCountByUserId, dbInsertProject } from '@/db/functions/project';

export async function createProjectAction({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const user = await getUser();
  const { subscription } = user;

  if (subscription.type === 'free') {
    const userProjectCount = await dbGetProjectCountByUserId({ userId: user.id });

    if (userProjectCount >= subscription.limits.projectsAmount) {
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
