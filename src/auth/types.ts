import { z } from 'zod';

export const credentialProvider = z.literal('credential');
export const socialProviderSchema = z.enum(['google', 'github']);
export const authProviderSchema = z.union([credentialProvider, socialProviderSchema]);

export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type AuthProvider = z.infer<typeof authProviderSchema>;
