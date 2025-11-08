import { and, eq, sql } from 'drizzle-orm';

import { db } from '..';
import { memberTable, organizationTable, type MemberModel } from '../schema';

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

export async function dbGetUserOwnedOrganizationsCount({
  userId,
}: {
  userId: string;
}): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(distinct ${organizationTable.id})` })
    .from(organizationTable)
    .innerJoin(memberTable, eq(memberTable.organizationId, organizationTable.id))
    .where(and(eq(memberTable.userId, userId), eq(memberTable.role, 'owner')));

  return result?.count ?? 0;
}
