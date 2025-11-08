import { z } from 'zod';

export const subscriptionTypeSchema = z.enum(['free', 'hobby', 'pro', 'team']);
export type SubscriptionType = z.infer<typeof subscriptionTypeSchema>;

export type SubscriptionFeaturesAndLimits = {
  type: SubscriptionType;
  features: {
    ai: boolean;
    analytics: boolean;
  };
  limits: {
    projectsAmount: number;
    jobsAmount: number;
    executionsPerMonth: number;
    organizationsAmount: number;
    webhookEndpointsPerProject: number;
  };
};
