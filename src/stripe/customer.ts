import Stripe from 'stripe';

import { stripe } from '.';

export async function createCustomerByEmailStripe({
  email,
  userId,
}: {
  email: string;
  userId: string;
}): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create(
    {
      email,
      metadata: {
        userId,
      },
    },
    { idempotencyKey: userId },
  );

  return customer;
}
