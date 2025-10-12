import { headers } from 'next/headers';

import { auth } from '.';

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

  const subscription = {
    isValid: activeSubscription !== undefined,
    limits: {
      jobsTotal: jobsTotalLimit,
      executionsPerMonth: executionsPerMonthLimit,
    },
  };

  return subscription;
}
