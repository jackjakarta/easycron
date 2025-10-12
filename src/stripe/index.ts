import { env } from '@/env';
import Stripe from 'stripe';

export const stripe = new Stripe(env.stripeSecretKey, {
  // @ts-expect-error - this works
  apiVersion: '2025-02-24.acacia',
});
