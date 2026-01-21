import { Hono } from 'hono';

import { getApiKeysHandler } from './api-keys';
import { getExecutionsHandler } from './executions';
import { getProjectsHandler } from './projects';
import { getRecentExecutionsHandler } from './recent-executions';

export const queryRouteGroup = new Hono()
  .get('/apiKeys', async (ctx) => {
    return getApiKeysHandler(ctx);
  })
  .get('/executions', async (ctx) => {
    return getExecutionsHandler(ctx);
  })
  .get('/projects', async (ctx) => {
    return getProjectsHandler(ctx);
  })
  .get('/recentExecutions', async (ctx) => {
    return getRecentExecutionsHandler(ctx);
  });
