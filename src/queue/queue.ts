import { env } from '@/env';
import { JobsOptions, Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

export const connection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export type RunJobPayload = {
  jobId: string;
  scheduledForISO: string;
};

export const RUN_QUEUE_NAME = 'easycron-runs';

export function getRunQueue() {
  return new Queue<RunJobPayload>(RUN_QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      removeOnComplete: 1000,
      removeOnFail: 1000,
    } satisfies JobsOptions,
  });
}

export function createQueueEvents() {
  return new QueueEvents(RUN_QUEUE_NAME, { connection });
}

export function closeQueueResources() {
  return connection.quit();
}
