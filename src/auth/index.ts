import { db } from '@/db';
import {
  accountTable,
  sessionTable,
  twoFactorTable,
  userTable,
  verificationTable,
} from '@/db/schema';
import { env } from '@/env';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { haveIBeenPwned, twoFactor } from 'better-auth/plugins';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      console.info({ user, url });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.info({ user, url });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      prompt: 'select_account',
      accessType: 'offline',
    },
    github: {
      clientId: env.githubClientId,
      clientSecret: env.githubClientSecret,
    },
  },
  appName: 'easyCron',
  plugins: [
    haveIBeenPwned({
      customPasswordCompromisedMessage: 'Please choose a more secure password.',
    }),
    twoFactor(),
    nextCookies(), // this must be the last plugin in the array
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user_entity: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
      two_factor: twoFactorTable,
    },
  }),
  user: {
    modelName: 'user_entity',
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});
