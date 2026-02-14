// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://af178f679a1f90827ffc46dff859e11e@o4508270474231808.ingest.de.sentry.io/4510836282032208',

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
      block: ['.sensitive', '[data-sensitive]', 'input[type="password"]'],
    }),
    Sentry.captureConsoleIntegration({
      levels: ['error', 'assert'],
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === 'development' ? 1.0 : 0.1,

  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === 'development' ? 1.0 : 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  beforeSend(event) {
    // Redact tokens from URLs
    if (event.request?.url) {
      event.request.url = event.request.url.replace(/token=[^&]+/g, 'token=REDACTED');
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
