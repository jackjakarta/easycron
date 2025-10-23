import { db } from '@/db';
import { dbGetUserById } from '@/db/functions/user';
import {
  accountTable,
  apiKeyTable,
  sessionTable,
  subscriptionTable,
  twoFactorTable,
  userTable,
  verificationTable,
} from '@/db/schema';
import { sendUserActionEmail, sendUserActionInformationEmail } from '@/email/send';
import { env } from '@/env';
import { stripe as stripeClient } from '@/stripe';
import { NUMBER_OF_TRIAL_DAYS } from '@/stripe/const';
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
            priceId: env.monthlyPriceId,
            annualDiscountPriceId: env.yearlyPriceId,
            freeTrial: {
              days: NUMBER_OF_TRIAL_DAYS,
              onTrialEnd: async ({ subscription }) => {
                try {
                  const user = await dbGetUserById({ userId: subscription.referenceId });

                  if (user === undefined) {
                    console.error(
                      `User with ID ${subscription.referenceId} not found for email notification`,
                    );
                    return;
                  }

                  await sendUserActionInformationEmail({
                    to: user.email,
                    information: { type: 'trial-ended' },
                  });
                } catch (error) {
                  console.error('Error sending trial ended email:', error);
                  return;
                }
              },
              onTrialExpired: async (subscription) => {
                try {
                  const user = await dbGetUserById({ userId: subscription.referenceId });

                  if (user === undefined) {
                    console.error(
                      `User with ID ${subscription.referenceId} not found for email notification`,
                    );
                    return;
                  }

                  await sendUserActionInformationEmail({
                    to: user.email,
                    information: { type: 'trial-expired' },
                  });
                } catch (error) {
                  console.error('Error sending trial expired email:', error);
                  return;
                }
              },
            },
          },
        ],
        getCheckoutSessionParams: async () => {
          return {
            params: {
              automatic_tax: {
                enabled: true,
              },
            },
          };
        },
        onSubscriptionComplete: async ({ subscription }) => {
          try {
            const user = await dbGetUserById({ userId: subscription.referenceId });

            if (user === undefined) {
              console.error(
                `User with ID ${subscription.referenceId} not found for email notification`,
              );
              return;
            }

            await sendUserActionInformationEmail({
              to: user.email,
              information: { type: 'subscription-purchased' },
            });
          } catch (error) {
            console.error('Error sending subscription purchased email:', error);
            return;
          }
        },
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
