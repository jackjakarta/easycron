import { verifyApiKey } from '@/app/api/utils';
import { dbGetJobCountByUserId, dbInsertJob } from '@/db/functions/job';
import { dbGetProjectById } from '@/db/functions/project';
import { getUserActiveSubscriptionApi } from '@/stripe/subscription';
import { Context } from 'hono';

import { requestBodySchema } from './schemas';

export async function insertJobHandler(ctx: Context<{}>) {
  try {
    const maybeApiKey = ctx.req.header('x-api-key');
    const apiKeyResult = await verifyApiKey({ key: maybeApiKey ?? null });

    if (apiKeyResult.code >= 400 && apiKeyResult.code < 500) {
      return ctx.json(
        { success: false, errors: [{ message: 'Missing or invalid API key' }] },
        { status: 401 },
      );
    }

    const { user } = apiKeyResult;

    if (user === undefined) {
      return ctx.json({ success: false, errors: [{ message: 'User not found' }] }, { status: 404 });
    }

    const [subscription, jobCount] = await Promise.all([
      getUserActiveSubscriptionApi({ userId: user.id }),
      dbGetJobCountByUserId({ userId: user.id }),
    ]);

    if (jobCount >= subscription.limits.jobsAmount) {
      return ctx.json(
        {
          success: false,
          errors: [
            {
              message:
                'Job limit reached for free plan. Please upgrade your subscription to add more jobs.',
            },
          ],
        },
        { status: 402 },
      );
    }

    const json = await ctx.req.json();
    const body = requestBodySchema.safeParse(json);

    if (!body.success) {
      console.error('Validation errors:', body.error.issues);
      return ctx.json({ success: false, errors: body.error.issues }, { status: 400 });
    }

    const { projectId } = body.data;
    const project = await dbGetProjectById({ projectId, userId: user.id });

    if (project === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'Project not found or access denied' }] },
        { status: 404 },
      );
    }

    const job = await dbInsertJob({
      ...body.data,
      userId: user.id,
      projectId: project.id,
      nextRunAt: new Date(),
    });

    if (job === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'Failed to create job' }] },
        { status: 500 },
      );
    }

    return ctx.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error({ error });
    return ctx.json(
      { success: false, errors: [{ message: 'Internal Server Error' }] },
      { status: 500 },
    );
  }
}
