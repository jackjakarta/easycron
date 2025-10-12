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
      throw new Error(
        'Exceeded the number of projects allowed in the Free plan. Please upgrade to create more.',
      );
    }
  }

  const newProject = await dbInsertProject({
    name,
    description,
    userId: user.id,
  });

  return newProject;
}
