import { auth } from '@/auth';
import { headers } from 'next/headers';

import { FREE_SUBSCRIPTION, PRO_SUBSCRIPTION } from './const';
import { type SubscriptionFeaturesAndLimits } from './types';

export async function getUserActiveSubscription({
  userId,
}: {
  userId: string;
}): Promise<SubscriptionFeaturesAndLimits> {
  const subscriptions = await auth.api.listActiveSubscriptions({
    query: {
      referenceId: userId,
    },
    headers: await headers(),
  });

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing',
  );

  if (activeSubscription === undefined) {
    return FREE_SUBSCRIPTION;
  }

  if (activeSubscription.plan === 'pro') {
    return PRO_SUBSCRIPTION;
  }

  return FREE_SUBSCRIPTION;
}
