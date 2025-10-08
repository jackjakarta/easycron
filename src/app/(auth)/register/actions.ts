'use server';

import { auth } from '@/auth';
import { dbUpdateUser } from '@/db/functions/user';
import { createCustomerByEmailStripe } from '@/stripe/customer';

export async function registerUserAction({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const result = await auth.api.signUpEmail({ body: { name, email, password } });
  const { user, token } = result;

  if (token !== null) {
    throw new Error('Failed to register user');
  }

  const stripeCustomer = await createCustomerByEmailStripe({
    email: user.email,
    userId: user.id,
  });

  const updated = await dbUpdateUser({ userId: user.id, data: { customerId: stripeCustomer.id } });

  if (updated === undefined) {
    throw new Error('Failed to update user with customer ID');
  }

  return updated;
}
