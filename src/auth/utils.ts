import { auth } from '@/auth';
import { dbGetUserById } from '@/db/functions/user';
import { type UserModel } from '@/db/schema';
import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

import { getUserActiveSubscription } from './subscription';

export async function getMaybeSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function getValidSession() {
  const session = await getMaybeSession();

  if (session === null) {
    redirect('/login', RedirectType.replace);
  }

  return session;
}

type UserAndSubscription = UserModel & {
  subscription: {
    isValid: boolean;
    limits: {
      jobsTotal: number;
      executionsPerMonth: number;
    };
  };
};

export async function getUser(): Promise<UserAndSubscription> {
  const session = await getValidSession();
  const user = await dbGetUserById({ userId: session.user.id });

  if (user === undefined) {
    redirect('/login', RedirectType.replace);
  }

  const subscription = await getUserActiveSubscription({ userId: user.id });

  return {
    ...user,
    subscription,
  };
}
