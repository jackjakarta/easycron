import { z } from 'zod';

export const subscriptionTypeSchema = z.enum(['free', 'pro']);
export type SubscriptionType = z.infer<typeof subscriptionTypeSchema>;

export type SubscriptionFeaturesAndLimits = {
  type: SubscriptionType;
  features: {
    analytics: boolean;
    ai: boolean;
    organizations: boolean;
    webhooks: boolean;
  };
  limits: {
    projectsAmount: number;
    jobsAmount: number;
    executionsPerMonth: number;
    organizations: number;
    webhookEndpointsPerProject: number;
  };
};
