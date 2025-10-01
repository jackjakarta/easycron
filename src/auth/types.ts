import { z } from 'zod';

export const credentialProviderSchema = z.literal('credential');
export const socialProviderSchema = z.enum(['google', 'github']);
export const authProviderSchema = z.union([credentialProviderSchema, socialProviderSchema]);

export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type AuthProvider = z.infer<typeof authProviderSchema>;
