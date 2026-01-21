import { dbGetOrganizationMember } from '@/db/functions/organization';
import { sendSubscriptionInformationEmail } from '@/email/send';
import { env } from '@/env';
import { stripe as stripeClient } from '@/stripe';
import { NUMBER_OF_TRIAL_DAYS } from '@/stripe/const';
import { stripe } from '@better-auth/stripe';

export function getStripePlugin() {
  return stripe({
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
  });
}
