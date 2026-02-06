import { Hono } from 'hono';

export const organizationJobRouteGroup = new Hono()
  .basePath('/job')
  .post('/create', async (ctx) => {
    return ctx.json({ message: 'Get job in organization' }, { status: 200 });
  });
