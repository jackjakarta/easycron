import { Hono } from 'hono';

import { v1RouteGroup } from './v1';

export const platformApp = new Hono();

export const routes = platformApp.route('/', v1RouteGroup);

export type AppType = typeof routes;
