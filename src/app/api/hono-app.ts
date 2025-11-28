import { Hono } from 'hono';

import { queryRouteGroup } from './query';
import { utilityRouteGroup } from './utility';
import { v1RouteGroup } from './v1';

export const app = new Hono().basePath('/api');

export const routes = app
  .route('/', queryRouteGroup)
  .route('/', utilityRouteGroup)
  .route('/v1', v1RouteGroup);

export type AppType = typeof routes;
