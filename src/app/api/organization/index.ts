import { Hono } from 'hono';

import { organizationJobRouteGroup } from './job';

export const organizationRouteGroup = new Hono()
  .basePath('/organization')
  .route('/', organizationJobRouteGroup);
