import { type SubscriptionPlanModel } from '@/db/schema';

export const FREE_PLAN: SubscriptionPlanModel = {
  id: 'free',
  name: 'Free Plan',
  price: 0,
  description: 'Enjoy our free plan with limited features.',
  limits: {
    tokenLimit: 100000,
    messagesLimit: 5,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const PREMIUM_PLAN: SubscriptionPlanModel = {
  id: 'premium',
  name: 'Premium Plan',
  price: 999,
  description: 'Unlock premium features with our subscription plan.',
  limits: {
    tokenLimit: 800000,
    messagesLimit: null,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const SUBSCRIPTION_PLANS: SubscriptionPlanModel[] = [FREE_PLAN, PREMIUM_PLAN];
