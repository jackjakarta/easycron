import { Hono } from 'hono';

import { jobRouteGroup } from './job';
import { projectRouteGroup } from './project';

export const v1RouteGroup = new Hono()
  .route('/project', projectRouteGroup)
  .route('/job', jobRouteGroup);
