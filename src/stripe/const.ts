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
  },
  limits: {
    projectsAmount: 1,
    jobsAmount: 2,
    executionsPerMonth: 500,
    webhookEndpointsPerProject: 1,
    organizationsAmount: 1,
  },
};

export const HOBBY_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'hobby',
  features: {
    ai: true,
    analytics: true,
  },
  limits: {
    projectsAmount: 5,
    jobsAmount: 20,
    executionsPerMonth: 1000,
    webhookEndpointsPerProject: 2,
    organizationsAmount: 1,
  },
};

export const PRO_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'pro',
  features: {
    ai: true,
    analytics: true,
  },
  limits: {
    projectsAmount: Infinity,
    jobsAmount: 100,
    executionsPerMonth: 50000,
    webhookEndpointsPerProject: 10,
    organizationsAmount: 3,
  },
};

export const TEAM_SUBSCRIPTION: SubscriptionFeaturesAndLimits = {
  type: 'team',
  features: {
    ai: true,
    analytics: true,
  },
  limits: {
    projectsAmount: Infinity,
    jobsAmount: Infinity,
    executionsPerMonth: Infinity,
    webhookEndpointsPerProject: 20,
    organizationsAmount: 10,
  },
};
