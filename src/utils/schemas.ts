import { z } from 'zod';

export const subscriptionLimitsSchema = z.object({
  jobsTotal: z.number().nullable(),
  executionsPerMonth: z.number().nullable(),
});
export type SubscriptionLimits = z.infer<typeof subscriptionLimitsSchema>;

export const subscriptionFeaturesSchema = z.object({
  analytics: z.boolean(),
});
export type SubscriptionFeatures = z.infer<typeof subscriptionFeaturesSchema>;

export const subscriptionPlanTypeSchema = z.enum(['free', 'premium']);
export type SubscriptionPlanType = z.infer<typeof subscriptionPlanTypeSchema>;
