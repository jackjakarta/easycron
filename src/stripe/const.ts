import Stripe from 'stripe';

import { type SubscriptionFeaturesAndLimits } from './types';

export const NUMBER_OF_TRIAL_DAYS = 7;

export const PAYMENT_METHOD_TYPES = ['card'] satisfies Stripe.Emptyable<
  Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType[]
>;

export const FREE_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'free',
  features: {
    analytics: false,
    ai: false,
  },
  limits: {
    projects: 5,
    jobsTotal: 10,
    executionsPerMonth: 500,
  },
};

export const PRO_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'pro',
  features: {
    analytics: true,
    ai: true,
  },
  limits: {
    projects: Infinity,
    jobsTotal: Infinity,
    executionsPerMonth: Infinity,
  },
};
