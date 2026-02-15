import { getUser } from '@/auth/utils';
import { dbGetFinishedExecutionsByJobId } from '@/db/functions/execution';
import { dbGetJobById } from '@/db/functions/job';
import { Context } from 'hono';
import { z } from 'zod';

export async function getExecutionsHandler(ctx: Context<{}>) {
  const user = await getUser();
  const { searchParams } = new URL(ctx.req.url);

  try {
    const _jobId = searchParams.get('jobId');
    const parsedJobId = z.uuid().safeParse(_jobId);

    if (!parsedJobId.success) {
      console.error({ error: parsedJobId.error.issues });
      return ctx.json({ error: 'Invalid jobId' }, { status: 400 });
    }

    const jobId = parsedJobId.data;
    const job = await dbGetJobById({ jobId, organizationId: user.organizationId });

    if (job === undefined) {
      console.error({ error: 'Job not found' });
      return ctx.json({ error: 'Job not found' }, { status: 404 });
    }

    const jobExecutions = await dbGetFinishedExecutionsByJobId({ jobId: job.id });
    return ctx.json(jobExecutions, { status: 200 });
  } catch (error) {
    console.error('Error fetching job executions:', error);
    return ctx.json({ error: 'Failed to fetch job executions' }, { status: 500 });
  }
}
