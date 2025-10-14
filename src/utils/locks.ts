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

export async function tryLock(key: string, ttlMs: number): Promise<boolean> {
  const redisClient = await redis();
  const r = await redisClient.set(key, '1', { NX: true, PX: ttlMs });

  return r === 'OK';
}
