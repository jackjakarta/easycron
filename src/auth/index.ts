import { ac, admin, member, owner } from '@/auth/permissions';
import { db } from '@/db';
import {
  dbGetOrganizationMember,
  dbGetUserOwnedOrganizationsCount,
} from '@/db/functions/organization';
import {
  accountTable,
  apiKeyTable,
  invitationTable,
  memberTable,
  organizationTable,
  sessionTable,
  subscriptionTable,
  twoFactorTable,
  userTable,
  verificationTable,
} from '@/db/schema';
import { sendSubscriptionInformationEmail, sendUserActionEmail } from '@/email/send';
import { env } from '@/env';
import { stripe as stripeClient } from '@/stripe';
import { NUMBER_OF_TRIAL_DAYS } from '@/stripe/const';
import { getUserActiveSubscription } from '@/stripe/subscription';
import { getBaseUrlFromHeaders } from '@/utils/host';
import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { apiKey, haveIBeenPwned, organization, twoFactor } from 'better-auth/plugins';

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
        throw new Error('Could not send password reset email');
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
        throw new Error('Could not send email verification email');
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
                await sendSubscriptionInformationEmail({
                  subscription,
                  informationType: 'trial-ended',
                });
              },
              onTrialExpired: async (subscription) => {
                await sendSubscriptionInformationEmail({
                  subscription,
                  informationType: 'trial-expired',
                });
              },
            },
          },
          {
            name: 'team',
            priceId: 'price_1SOlbmE85tPzaCYUP5CichDd',
            annualDiscountPriceId: 'price_1SOlc5E85tPzaCYU567G2VsQ',
            freeTrial: {
              days: NUMBER_OF_TRIAL_DAYS,
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
        authorizeReference: async ({ user, referenceId }) => {
          const member = await dbGetOrganizationMember({
            userId: user.id,
            organizationId: referenceId,
          });

          if (member === undefined) {
            return false;
          }

          return member.role === 'owner';
        },
        onSubscriptionDeleted: async ({ subscription }) => {
          console.info(
            `Subscription ${subscription.id} deleted for user ${subscription.referenceId}`,
          );
        },
        onSubscriptionCancel: async ({ subscription }) => {
          await sendSubscriptionInformationEmail({
            subscription,
            informationType: 'subscription-canceled',
          });
        },
        onSubscriptionComplete: async ({ subscription }) => {
          await sendSubscriptionInformationEmail({
            subscription,
            informationType: 'subscription-purchased',
          });
        },
      },
    }),
    organization({
      ac,
      roles: {
        owner,
        admin,
        member,
      },
      requireEmailVerificationOnInvitation: true,
      allowUserToCreateOrganization: async (user) => {
        const [subscription, userOrganziationsCount] = await Promise.all([
          getUserActiveSubscription({ referenceId: user.id }),
          dbGetUserOwnedOrganizationsCount({ userId: user.id }),
        ]);

        if (userOrganziationsCount >= subscription.limits.organizationsAmount) {
          return false;
        }

        return true;
      },
      async sendInvitationEmail(data) {
        const { organization, invitation } = data;
        const searchParams = new URLSearchParams({ inviteId: invitation.id });

        const baseUrl = await getBaseUrlFromHeaders();
        const inviteLink = `${baseUrl}/org/${organization.slug}/accept-invitation?${searchParams.toString()}`;

        const result = await sendUserActionEmail({
          to: invitation.email,
          action: 'organization-invite',
          actionUrl: inviteLink,
          extra: { organizationName: organization.name },
        });

        if (!result.success) {
          console.error('Error sending organization invite email:', result.error);
          throw new Error('Could not send organization invitation email');
        }
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
      organization: organizationTable,
      member: memberTable,
      invitation: invitationTable,
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
