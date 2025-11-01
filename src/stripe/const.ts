import Stripe from 'stripe';

import { type SubscriptionFeaturesAndLimits } from './types';

export const NUMBER_OF_TRIAL_DAYS = 7;

export const PAYMENT_METHOD_TYPES = ['card'] satisfies Stripe.Emptyable<
  Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType[]
>;

export const FREE_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'free',
  features: {
    ai: false,
    analytics: false,
    webhooks: true,
    organizations: false,
  },
  limits: {
    projectsAmount: 1,
    jobsAmount: 2,
    executionsPerMonth: 500,
    webhookEndpointsPerProject: 1,
    organizations: 0,
  },
};

export const TEAM_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'team',
  features: {
    ai: true,
    analytics: true,
    organizations: true,
    webhooks: true,
  },
  limits: {
    projectsAmount: Infinity,
    jobsAmount: Infinity,
    executionsPerMonth: Infinity,
    webhookEndpointsPerProject: 20,
    organizations: 0,
  },
};

export const PRO_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'pro',
  features: {
    ai: true,
    analytics: true,
    organizations: true,
    webhooks: true,
  },
  limits: {
    projectsAmount: Infinity,
    jobsAmount: Infinity,
    executionsPerMonth: Infinity,
    webhookEndpointsPerProject: 10,
    organizations: 10,
  },
};
