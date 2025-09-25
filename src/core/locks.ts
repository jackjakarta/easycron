import { env } from '@/env';
import { createClient } from 'redis';

const client = createClient({ url: env.redisUrl });
let connected = false;
export async function redis() {
  if (!connected) {
    await client.connect();
    connected = true;
  }
  return client;
}

/** Try to acquire a short-lived lock. Returns true if acquired. */
export async function tryLock(key: string, ttlMs: number): Promise<boolean> {
  const r = await (await redis()).set(key, '1', { NX: true, PX: ttlMs });
  return r === 'OK';
}
