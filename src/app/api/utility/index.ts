import { Hono } from 'hono';

import { deleteExecutionsHandler } from './delete-executions';

export const utilityRouteGroup = new Hono()
  .get('/health', (ctx) => {
    return ctx.json({ message: 'Ok' }, 200);
  })
  .delete('/delete-executions', async (ctx) => {
    return deleteExecutionsHandler(ctx);
  });
