import { setTimeout as sleep } from 'timers/promises';

import { tick } from './utils';

const POLL_INTERVAL_MS = 1000;
const FORCE_EXIT_MS = 3000;

async function main() {
  console.info('Scheduler started');

  const ac = new AbortController();
  let stopping = false;

  function stop() {
    if (!stopping) {
      console.info('\nGraceful shutdown requested...');
      stopping = true;
      ac.abort();

      setTimeout(() => {
        console.warn('Forcing exit...');
        process.exit(0);
      }, FORCE_EXIT_MS).unref();
    }
  }

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  try {
    while (!stopping) {
      try {
        await tick();
      } catch (e) {
        console.error('Scheduler error', e);

        if (stopping) {
          break;
        }

        await sleep(1000, { signal: ac.signal }).catch(() => {});
      }

      if (stopping) {
        break;
      }

      await sleep(POLL_INTERVAL_MS, { signal: ac.signal }).catch(() => {});
    }

    const handles = process.getActiveResourcesInfo();
    const requests = process.getActiveResourcesInfo();
    console.debug(
      'Active handles after shutdown:',
      handles.map((h) => h.constructor?.name ?? typeof h),
    );
    console.debug(
      'Active requests after shutdown:',
      requests.map((r) => r.constructor?.name ?? typeof r),
    );

    console.info('Scheduler stopped');
  } finally {
    process.removeAllListeners('SIGINT');
    process.removeAllListeners('SIGTERM');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
