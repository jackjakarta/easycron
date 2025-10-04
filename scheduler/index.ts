import { sleep, tick } from './utils';

const POLL_INTERVAL_MS = 1000;

async function main() {
  console.info('Scheduler started');
  let stopping = false;

  process.on('SIGINT', () => (stopping = true));
  process.on('SIGTERM', () => (stopping = true));

  while (!stopping) {
    try {
      await tick();
    } catch (e) {
      console.error('Scheduler error', e);
      await sleep(1000);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  console.info('Scheduler stopped');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
