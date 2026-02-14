// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // dsn: 'https://af178f679a1f90827ffc46dff859e11e@o4508270474231808.ingest.de.sentry.io/4510836282032208',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === 'development' ? 1.0 : 0.1,

  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ['error', 'assert'],
    }),
  ],

  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  beforeSend(event) {
    // Remove sensitive headers from Stripe webhooks
    if (event.request?.url?.includes('/stripe/webhook')) {
      delete event.request.headers;
    }

    // Remove PII from extra data
    if (event.extra) {
      delete event.extra.guestEmail;
      delete event.extra.guestPhone;
      delete event.extra.bookingId;
      delete event.extra.email;
    }

    // Do not send errors in development
    if (process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === 'development') {
      return null;
    }

    return event;
  },
});
