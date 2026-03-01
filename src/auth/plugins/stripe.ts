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
    createCustomerOnSignUp: false,
    organization: {
      enabled: true,
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
      authorizeReference: async ({ user, referenceId, action }) => {
        const member = await dbGetOrganizationMember({
          userId: user.id,
          organizationId: referenceId,
        });

        if (member === undefined) {
          return false;
        }

        // Read-only: any member can view subscription status
        if (action === 'list-subscription') {
          return true;
        }

        // Write actions: restricted to owner/admin
        return member.role === 'owner' || member.role === 'admin';
      },
      onSubscriptionDeleted: async ({ subscription }) => {
        console.info(
          `Subscription ${subscription.id} deleted for organization ${subscription.referenceId}`,
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
