import { handle } from 'hono/vercel';

import { platformApp } from '../platform-app';

export const GET = handle(platformApp);
export const POST = handle(platformApp);
export const PUT = handle(platformApp);
export const PATCH = handle(platformApp);
export const DELETE = handle(platformApp);
