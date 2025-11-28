import { dbDeleteOldExecutions } from '@/db/functions/execution';
import { env } from '@/env';
import { Context } from 'hono';

import { verifyRequestSignature } from '../../utils';

export async function deleteExecutionsHandler(ctx: Context<{}>) {
  try {
    const signature = ctx.req.header('x-easycron-signature');

    if (signature === undefined) {
      console.error({ success: false, error: 'Not found' });
      return ctx.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const payload = await ctx.req.text();
    const isValid = verifyRequestSignature({
      payload,
      signature,
      secret: env.easyCronWebhookSecret,
    });

    if (!isValid) {
      console.error({ success: isValid, error: 'Invalid signature' });
      return ctx.json({ success: isValid, error: 'Invalid signature' }, { status: 400 });
    }

    const deletedCount = await dbDeleteOldExecutions();

    return ctx.json({ deletedCount });
  } catch (error) {
    console.error('Error deleting old executions:', error);
    return ctx.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
