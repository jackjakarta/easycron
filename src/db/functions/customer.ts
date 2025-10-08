import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { db } from '..';
import { customerSubscriptionsStripeTable } from '../schema';

export async function dbGetCustomerSubscriptionsStripe({
  customerId,
}: {
  customerId: string | null;
}) {
  if (customerId === null) return [];

  const maybeCustomer = (
    await db
      .select()
      .from(customerSubscriptionsStripeTable)
      .where(eq(customerSubscriptionsStripeTable.customerId, customerId))
  )[0];

  if (maybeCustomer === undefined) return [];

  return maybeCustomer.subscriptions;
}

export async function dbUpdateCustomerSubscriptions({
  customerId,
  subscriptions,
}: {
  customerId: string | null;
  subscriptions: Stripe.Subscription[];
}) {
  if (customerId === null) return [];

  await db
    .insert(customerSubscriptionsStripeTable)
    .values({ customerId, subscriptions })
    .onConflictDoUpdate({
      target: customerSubscriptionsStripeTable.customerId,
      set: { subscriptions },
    });
}
