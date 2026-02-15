import { type UserModel } from '@/db/schema';
import { type SubscriptionFeaturesAndLimits } from '@/stripe/types';
import { z } from 'zod';

import { getValidSession } from './utils';

export const credentialProviderSchema = z.literal('credential');
export const socialProviderSchema = z.enum(['google', 'github']);
export const authProviderSchema = z.union([credentialProviderSchema, socialProviderSchema]);

export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type AuthProvider = z.infer<typeof authProviderSchema>;

export type UserAnd<T> = UserModel & T;
export type BetterAuthSession = Awaited<ReturnType<typeof getValidSession>>;

type Subscription = { subscription: SubscriptionFeaturesAndLimits };
type OrganizationContext = { organizationId: string };
export type UserAndContext = UserAnd<Subscription & OrganizationContext>;
