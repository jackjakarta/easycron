import { auth } from '@/auth';
import { dbGetOrganizationSubscriptions } from '@/db/functions/subscription';
import { headers } from 'next/headers';

import { FREE_SUBSCRIPTION, PRO_SUBSCRIPTION } from './const';
import { type SubscriptionFeaturesAndLimits } from './types';

export async function getOrgActiveSubscription({
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

  if (activeSubscription.plan === 'pro') {
    return PRO_SUBSCRIPTION;
  }

  return FREE_SUBSCRIPTION;
}

export async function getOrgActiveSubscriptionApi({
  organizationId,
}: {
  organizationId: string;
}): Promise<SubscriptionFeaturesAndLimits> {
  const subscriptions = await dbGetOrganizationSubscriptions({ organizationId });

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
