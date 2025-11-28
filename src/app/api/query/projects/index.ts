import { getUser } from '@/auth/utils';
import { dbGetProjects } from '@/db/functions/project';
import { Context } from 'hono';

export async function getProjectsHandler(ctx: Context<{}>) {
  const user = await getUser();

  try {
    const projects = await dbGetProjects({ userId: user.id });
    return ctx.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return ctx.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
