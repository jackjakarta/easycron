import { connection, RUN_QUEUE_NAME, type RunJobPayload } from '@/queue/queue';
import { Worker } from 'bullmq';

import { runOnce } from './run';

const WORKER_CONCURRENCY = 20;

async function main() {
  console.info('Worker starting…');
  const concurrency = WORKER_CONCURRENCY;

  const worker = new Worker<RunJobPayload>(RUN_QUEUE_NAME, async (bullJob) => runOnce(bullJob), {
    connection,
    concurrency,
  });

  worker.on('ready', () => {
    console.info('Worker ready');
  });

  worker.on('active', (job) => {
    console.info('active', job.id);
  });

  worker.on('completed', (job) => {
    console.info('completed', job.id);
  });

  worker.on('failed', (job, err) => {
    console.error('worker failed', job?.id, err);
  });

  async function shutdown() {
    console.info('Worker shutting down…');
    await worker.close();
    await connection.quit();
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
