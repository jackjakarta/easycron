import { db } from '@/db';
import {
  accountTable,
  apiKeyTable,
  sessionTable,
  subscriptionTable,
  twoFactorTable,
  userTable,
  verificationTable,
} from '@/db/schema';
import { sendUserActionEmail } from '@/email/send';
import { env } from '@/env';
import { stripe as stripeClient } from '@/stripe';
import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { apiKey, haveIBeenPwned, twoFactor } from 'better-auth/plugins';

export const auth = betterAuth({
  appName: 'easyCron',
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const result = await sendUserActionEmail({
        action: 'reset-password',
        actionUrl: url,
        to: user.email,
      });

      if (!result.success) {
        console.error('Error sending password reset email:', result.error);
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const result = await sendUserActionEmail({
        action: 'verify-email',
        actionUrl: url,
        to: user.email,
      });

      if (!result.success) {
        console.error('Error sending email verification email:', result.error);
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      prompt: 'select_account',
      accessType: 'offline',
    },
    github: {
      clientId: env.githubClientId,
      clientSecret: env.githubClientSecret,
    },
  },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: env.stripeWebhookSecret,
      createCustomerOnSignUp: true,
      onCustomerCreate: async ({ stripeCustomer, user }) => {
        console.debug(`Customer ${stripeCustomer.id} created for user ${user.id}`);
      },
      subscription: {
        enabled: true,
        plans: [
          {
            name: 'pro',
            priceId: 'price_1SHBjdCl6l0YAcu7e40O6TGg',
            annualDiscountPriceId: 'price_1SHBjdCl6l0YAcu7BYK6hOtj',
            limits: {
              jobsTotal: 10,
              executionsPerMonth: 500,
            },
            freeTrial: {
              days: 7,
            },
          },
        ],
      },
    }),
    haveIBeenPwned({
      customPasswordCompromisedMessage: 'Please choose a more secure password.',
    }),
    apiKey({ apiKeyHeaders: 'x-api-key' }),
    twoFactor(),
    nextCookies(), // this must be the last plugin in the array
  ],

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user_entity: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
      twoFactor: twoFactorTable,
      apikey: apiKeyTable,
      subscription: subscriptionTable,
    },
  }),
  user: {
    modelName: 'user_entity',
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});
