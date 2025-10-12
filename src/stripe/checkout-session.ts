import { errorifyAsyncFn } from '@/utils/error';
import { getLocale } from 'next-intl/server';
import Stripe from 'stripe';

import { stripe } from '.';
import { NUMBER_OF_TRIAL_DAYS, PAYMENT_METHOD_TYPES } from './const';

export const stripeCreateCheckoutSessionWithResult = errorifyAsyncFn(stripeCreateCheckoutSession);

export async function stripeCreateCheckoutSession({
  customerId,
  priceId,
  redirectUrl,
  hasFreeTrial,
  trialDays,
}: {
  customerId: string;
  priceId: string;
  redirectUrl: string;
  hasFreeTrial: boolean;
  trialDays?: number;
}) {
  const locale = await getLocale();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_types: PAYMENT_METHOD_TYPES,
    success_url: redirectUrl,
    cancel_url: redirectUrl,
    allow_promotion_codes: true,
    locale: locale as Stripe.Checkout.Session.Locale,
    subscription_data: hasFreeTrial
      ? {
          trial_period_days: trialDays ?? NUMBER_OF_TRIAL_DAYS,
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'cancel',
            },
          },
        }
      : undefined,
  });

  return session;
}
