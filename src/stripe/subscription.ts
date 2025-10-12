import { auth } from '@/auth';
import { headers } from 'next/headers';

export type SubscriptionLimits = {
  features: {
    analytics: boolean;
  };
  limits: {
    jobsTotal: number;
    executionsPerMonth: number;
  };
};

export async function getUserActiveSubscription({ userId }: { userId: string }) {
  const subscriptions = await auth.api.listActiveSubscriptions({
    query: {
      referenceId: userId,
    },
    headers: await headers(),
  });

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing',
  );

  const jobsTotalLimit = subscriptions?.[0]?.limits?.jobsTotal ?? 0;
  const executionsPerMonthLimit = subscriptions?.[0]?.limits?.executionsPerMonth ?? 0;

  if (activeSubscription === undefined) {
    return undefined;
  }

  const subscription: SubscriptionLimits = {
    features: {
      analytics: true,
    },
    limits: {
      jobsTotal: jobsTotalLimit,
      executionsPerMonth: executionsPerMonthLimit,
    },
  };

  return subscription;
}
