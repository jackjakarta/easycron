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
  },
  limits: {
    projectsAmount: 1,
    jobsAmount: 5,
    executionsPerMonth: 500,
    webhookEndpointsPerProject: 1,
  },
};

export const PRO_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'pro',
  features: {
    analytics: true,
  },
  limits: {
    projectsAmount: Infinity,
    jobsAmount: Infinity,
    executionsPerMonth: Infinity,
    webhookEndpointsPerProject: 10,
  },
};
