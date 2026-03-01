import { z } from 'zod';

export const subscriptionTypeSchema = z.enum(['free', 'pro']);
export type SubscriptionType = z.infer<typeof subscriptionTypeSchema>;

export type SubscriptionFeaturesAndLimits = {
  type: SubscriptionType;
  features: {
    analytics: boolean;
  };
  limits: {
    projectsAmount: number;
    jobsAmount: number;
    executionsPerMonth: number;
    webhookEndpointsPerProject: number;
  };
};
