import { db } from '@/db';
import { webhookEventTable } from '@/db/schema';
import { env } from '@/env';
import { inArray } from 'drizzle-orm';
import { Context } from 'hono';

import { verifyRequestSignature } from '../../utils';

export async function deleteWebhookEventsHandler(ctx: Context<{}>) {
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

    const events = await db.select().from(webhookEventTable).limit(10_000);

    if (events.length === 0) {
      return ctx.json({ deleted: 0 }, { status: 200 });
    }

    await db.delete(webhookEventTable).where(
      inArray(
        webhookEventTable.id,
        events.map((e) => e.id),
      ),
    );

    return ctx.json({ deletedCount: events.length });
  } catch (error) {
    console.error('Error deleting old webhook events:', error);
    return ctx.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
