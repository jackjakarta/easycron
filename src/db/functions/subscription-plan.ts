import { type SubscriptionState } from '@/stripe/subscription';
import { eq } from 'drizzle-orm';

import { db } from '..';
import { subscriptionPlanTable, type SubscriptionPlanModel } from '../schema';

type SubscriptionPlanId = Exclude<SubscriptionState, 'trialing'>;

export async function dbGetSubscriptionPlanById({
  planId,
}: {
  planId: SubscriptionPlanId;
}): Promise<SubscriptionPlanModel | undefined> {
  const [subscriptionPlan] = await db
    .select()
    .from(subscriptionPlanTable)
    .where(eq(subscriptionPlanTable.id, planId));

  return subscriptionPlan;
}

export async function dbGetSubscriptionPlans(): Promise<SubscriptionPlanModel[]> {
  const subscriptionPlans = await db.select().from(subscriptionPlanTable);

  return subscriptionPlans;
}
