import { db } from '@/db';
import {
  accountTable,
  apiKeyTable,
  invitationTable,
  memberTable,
  organizationTable,
  sessionTable,
  subscriptionTable,
  twoFactorTable,
  userTable,
  verificationTable,
} from '@/db/schema';
import { sendUserActionEmail } from '@/email/send';
import { env } from '@/env';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { apiKey, haveIBeenPwned, magicLink, twoFactor } from 'better-auth/plugins';

import { getOrganizationPlugin } from './plugins/organization';
import { getStripePlugin } from './plugins/stripe';

export const auth = betterAuth({
  appName: 'easyCron',
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const result = await sendUserActionEmail({
        action: 'reset-password',
        actionUrl: url,
        to: user.email,
      });

      if (!result.success) {
        console.error('Error sending password reset email:', result.error);
        throw new Error('Could not send password reset email');
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const result = await sendUserActionEmail({
        action: 'verify-email',
        actionUrl: url,
        to: user.email,
      });

      if (!result.success) {
        console.error('Error sending email verification email:', result.error);
        throw new Error('Could not send email verification email');
      }
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
  plugins: [
    getStripePlugin(),
    getOrganizationPlugin(),
    haveIBeenPwned({
      customPasswordCompromisedMessage: 'Please choose a more secure password.',
    }),
    apiKey({ apiKeyHeaders: 'x-api-key' }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.debug({ email, url });

        // await sendUserActionEmail({
        //   to: email,
        //   actionUrl: url,
        //   action: 'magic-link',
        // });
      },
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
      twoFactor: twoFactorTable,
      apikey: apiKeyTable,
      subscription: subscriptionTable,
      organization: organizationTable,
      member: memberTable,
      invitation: invitationTable,
    },
  }),
  user: {
    modelName: 'user_entity',
  },
  account: {
    accountLinking: {
      trustedProviders: ['google', 'github'],
    },
  },
  trustedOrigins: ['http://localhost:3000', 'https://jakarta.ngrok.app'],
  advanced: {
    database: {
      generateId: false,
    },
  },
});
