import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    databaseUrl: z.url(),
    redisUrl: z.url(),
    betterAuthSecret: z.string().min(1),
    googleClientId: z.string().min(1),
    googleClientSecret: z.string().min(1),
    githubClientId: z.string().min(1),
    githubClientSecret: z.string().min(1),
    mailjetApiKey: z.string().min(1),
    mailjetApiSecret: z.string().min(1),
    secretEncryptionKey: z.string().min(1),
    devMode: z.enum(['true', 'false']).default('false'),
  },
  client: {},
  runtimeEnv: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    mailjetApiKey: process.env.MAILJET_API_KEY,
    mailjetApiSecret: process.env.MAILJET_API_SECRET,
    secretEncryptionKey: process.env.SECRET_ENCRYPTION_KEY,
    devMode: process.env.DEV_MODE,
  },
});
