import { getUser } from '@/auth/utils';
import { dbGetRecentExecutions } from '@/db/functions/execution';
import { Context } from 'hono';

export async function getRecentExecutionsHandler(ctx: Context<{}>) {
  const user = await getUser();

  try {
    const recentExecutions = await dbGetRecentExecutions({ organizationId: user.organizationId });
    return ctx.json(recentExecutions, { status: 200 });
  } catch (error) {
    console.error('Error fetching job executions:', error);
    return ctx.json({ error: 'Failed to fetch job executions' }, { status: 500 });
  }
}
