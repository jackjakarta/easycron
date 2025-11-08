import { auth } from '@/auth';
import { dbGetUserSubscriptions } from '@/db/functions/subscription';
import { headers } from 'next/headers';

import { FREE_SUBSCRIPTION, PRO_SUBSCRIPTION, TEAM_SUBSCRIPTION } from './const';
import { type SubscriptionFeaturesAndLimits } from './types';

export async function getUserActiveSubscription({
  referenceId,
}: {
  referenceId: string;
}): Promise<SubscriptionFeaturesAndLimits> {
  const subscriptions = await auth.api.listActiveSubscriptions({
    query: { referenceId },
    headers: await headers(),
  });

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing',
  );

  if (activeSubscription === undefined) {
    return FREE_SUBSCRIPTION;
  }

  if (activeSubscription.plan === 'team') {
    return TEAM_SUBSCRIPTION;
  }

  if (activeSubscription.plan === 'pro') {
    return PRO_SUBSCRIPTION;
  }

  return FREE_SUBSCRIPTION;
}

export async function getUserActiveSubscriptionApi({
  userId,
}: {
  userId: string;
}): Promise<SubscriptionFeaturesAndLimits> {
  const subscriptions = await dbGetUserSubscriptions({ userId });

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing',
  );

  if (activeSubscription === undefined) {
    return FREE_SUBSCRIPTION;
  }

  if (activeSubscription.plan === 'team') {
    return TEAM_SUBSCRIPTION;
  }

  if (activeSubscription.plan === 'pro') {
    return PRO_SUBSCRIPTION;
  }

  return FREE_SUBSCRIPTION;
}
