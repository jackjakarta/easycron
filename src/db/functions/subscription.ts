import { eq } from 'drizzle-orm';

import { db } from '..';
import { subscriptionTable } from '../schema';

export async function dbGetOrganizationSubscriptions({
  organizationId,
}: {
  organizationId: string;
}) {
  const subscriptions = await db
    .select()
    .from(subscriptionTable)
    .where(eq(subscriptionTable.referenceId, organizationId));

  return subscriptions;
}
