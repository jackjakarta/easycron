import { stripeClient } from '@better-auth/stripe/client';
import {
  apiKeyClient,
  organizationClient,
  twoFactorClient,
  // magicLinkClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [
    stripeClient({
      subscription: true,
    }),
    organizationClient(),
    apiKeyClient(),
    twoFactorClient(),
    // magicLinkClient(),
  ],
});
