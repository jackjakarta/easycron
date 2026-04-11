import { Hono } from 'hono';

import {
  deleteProjectHandler,
  getProjectHandler,
  insertProjectHandler,
  updateProjectHandler,
} from './handlers';

export const projectRouteGroup = new Hono()
  .get('/', async (ctx) => {
    return getProjectHandler(ctx);
  })
  .post('/', async (ctx) => {
    return insertProjectHandler(ctx);
  })
  .put('/', async (ctx) => {
    return updateProjectHandler(ctx);
  })
  .delete('/', async (ctx) => {
    return deleteProjectHandler(ctx);
  });
