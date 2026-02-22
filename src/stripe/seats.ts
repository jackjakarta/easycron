import { stripe } from '@/stripe';

export async function updateStripeSubscriptionSeats({
  stripeSubscriptionId,
  newSeatCount,
}: {
  stripeSubscriptionId: string;
  newSeatCount: number;
}) {
  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const item = subscription.items.data[0];

  if (item === undefined) {
    console.error(`No subscription items found for subscription ${stripeSubscriptionId}`);
    return;
  }

  await stripe.subscriptionItems.update(item.id, {
    quantity: newSeatCount,
    proration_behavior: 'create_prorations',
  });
}
