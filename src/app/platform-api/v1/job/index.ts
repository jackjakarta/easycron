import { Hono } from 'hono';

import { insertJobHandler } from './handlers';

export const jobRouteGroup = new Hono().post('/', async (ctx) => {
  return insertJobHandler(ctx);
});
