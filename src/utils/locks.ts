import { env } from '@/env';
import IORedis from 'ioredis';

let client: IORedis | null = null;

function getClient(): IORedis {
  if (!client) {
    client = new IORedis(env.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
    client.on('error', (err) => {
      console.error('[locks] Redis connection error:', err.message);
    });
  }
  return client;
}

export async function tryLock(key: string, ttlMs: number): Promise<boolean> {
  const r = await getClient().set(key, '1', 'PX', ttlMs, 'NX');
  return r === 'OK';
}

export async function disconnectRedis() {
  if (client) {
    await client.quit();
    client = null;
  }
}
