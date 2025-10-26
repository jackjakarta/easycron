import { eq } from 'drizzle-orm';

import { db } from '..';
import { subscriptionTable } from '../schema';

export async function dbGetUserSubscriptions({ userId }: { userId: string }) {
  const subscriptions = await db
    .select()
    .from(subscriptionTable)
    .where(eq(subscriptionTable.referenceId, userId));

  return subscriptions;
}
