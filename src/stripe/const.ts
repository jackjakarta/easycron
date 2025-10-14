import Stripe from 'stripe';

import { type SubscriptionFeaturesAndLimits } from './types';

export const NUMBER_OF_TRIAL_DAYS = 7;

export const PAYMENT_METHOD_TYPES = ['card'] satisfies Stripe.Emptyable<
  Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType[]
>;

export const FREE_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'free' as const,
  features: {
    analytics: false,
  },
  limits: {
    projects: 1,
    jobsTotal: 2,
    executionsPerMonth: 500,
  },
};

export const PRO_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'pro',
  features: {
    analytics: true,
  },
  limits: {
    projects: Infinity,
    jobsTotal: Infinity,
    executionsPerMonth: Infinity,
  },
};
