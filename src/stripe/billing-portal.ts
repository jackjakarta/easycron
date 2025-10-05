import { errorifyAsyncFn } from '@/utils/error';
import { getLocale } from 'next-intl/server';
import Stripe from 'stripe';

import { stripe } from '.';

export const createBillingPortalSessionWithResult = errorifyAsyncFn(createBillingPortalSession);

export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const locale = await getLocale();

  const createCustomerPortalSessionResponse = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    locale: locale as Stripe.Checkout.Session.Locale,
  });

  return createCustomerPortalSessionResponse;
}
