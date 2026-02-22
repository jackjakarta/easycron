import { env } from '@/env';
import { JobsOptions, Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

let connection: IORedis | null = null;

export function getConnection(): IORedis {
  if (!connection) {
    connection = new IORedis(env.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
    connection.on('error', (err) => {
      console.error('[queue] Redis connection error:', err.message);
    });
  }
  return connection;
}

export type RunJobPayload = {
  jobId: string;
  scheduledForISO: string;
};

export const RUN_QUEUE_NAME = 'easycron-runs';

let runQueue: Queue<RunJobPayload> | null = null;

export function getRunQueue() {
  if (!runQueue) {
    runQueue = new Queue<RunJobPayload>(RUN_QUEUE_NAME, {
      connection: getConnection(),
      defaultJobOptions: {
        removeOnComplete: 1000,
        removeOnFail: 1000,
      } as JobsOptions,
    });
  }
  return runQueue;
}

export async function closeRunQueue() {
  if (runQueue) {
    await runQueue.close();
    runQueue = null;
  }
}

export function createQueueEvents() {
  return new QueueEvents(RUN_QUEUE_NAME, { connection: getConnection() });
}

export async function closeQueueResources() {
  await closeRunQueue();
  if (connection) {
    await connection.quit();
    connection = null;
  }
}
