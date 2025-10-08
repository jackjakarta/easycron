import { errorifyAsyncFn } from '@/utils/error';
import Stripe from 'stripe';

import { stripe } from '.';

export const stripeWebhooksConstructEventWithResult = errorifyAsyncFn(stripeWebhooksConstructEvent);

export async function stripeWebhooksConstructEvent({
  eventText,
  signature,
  stripeWebhookSecret,
}: {
  eventText: string;
  signature: string;
  stripeWebhookSecret: string;
}) {
  console.debug('stripeWebhooksConstructEvent', { eventText, signature, stripeWebhookSecret });
  return stripe.webhooks.constructEvent(eventText, signature, stripeWebhookSecret);
}

export function getMaybeCustomerIdFromStripeEvent({ event }: { event: Stripe.Event | null }) {
  if (event === null) return undefined;

  try {
    const { id: customerId } = event.data.object as {
      id: string;
    };

    return customerId;
  } catch (error) {
    console.error({ error, event });
    return undefined;
  }
}
