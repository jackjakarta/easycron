import { Hono } from 'hono';

import { deleteExecutionsHandler } from './delete-executions';
import { deleteWebhookEventsHandler } from './delete-webhook-events';

export const utilityRouteGroup = new Hono()
  .get('/health', (ctx) => {
    return ctx.json({ message: 'Ok' }, 200);
  })
  .delete('/delete-executions', async (ctx) => {
    return deleteExecutionsHandler(ctx);
  })
  .delete('/delete-webhook-events', async (ctx) => {
    return deleteWebhookEventsHandler(ctx);
  });
