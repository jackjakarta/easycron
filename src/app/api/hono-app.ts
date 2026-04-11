import { Hono } from 'hono';

import { organizationRouteGroup } from './organization';
import { queryRouteGroup } from './query';
import { utilityRouteGroup } from './utility';

export const app = new Hono().basePath('/api');

export const routes = app
  .route('/', queryRouteGroup)
  .route('/', utilityRouteGroup)
  .route('/', organizationRouteGroup);

export type AppType = typeof routes;
