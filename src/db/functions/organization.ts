import { and, eq } from 'drizzle-orm';

import { db } from '..';
import { memberTable, type MemberModel } from '../schema';

export async function dbGetOrganizationMember({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<MemberModel | undefined> {
  const [member] = await db
    .select()
    .from(memberTable)
    .where(and(eq(memberTable.userId, userId), eq(memberTable.organizationId, organizationId)));

  return member;
}
