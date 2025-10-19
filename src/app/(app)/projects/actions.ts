'use server';

import { getUser } from '@/auth/utils';
import { dbGetProjects, dbInsertProject } from '@/db/functions/project';

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
    const userProjects = await dbGetProjects({ userId: user.id });

    if (userProjects.length >= subscription.limits.projects) {
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
