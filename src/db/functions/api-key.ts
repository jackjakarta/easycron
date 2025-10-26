import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '..';
import { apiKeyTable, type ApiKeyModel, type UpdateApiKeyModel } from '../schema';

export async function dbGetUserApiKeys({ userId }: { userId: string }): Promise<ApiKeyModel[]> {
  const keys = await db
    .select()
    .from(apiKeyTable)
    .where(eq(apiKeyTable.userId, userId))
    .orderBy(desc(apiKeyTable.enabled), desc(apiKeyTable.updatedAt));

  return keys;
}

export async function dbUpdateApiKey({
  apiKeyId,
  userId,
  data,
}: {
  apiKeyId: string;
  userId: string;
  data: UpdateApiKeyModel;
}): Promise<ApiKeyModel | undefined> {
  const [updatedKey] = await db
    .update(apiKeyTable)
    .set(data)
    .where(and(eq(apiKeyTable.id, apiKeyId), eq(apiKeyTable.userId, userId)))
    .returning();

  return updatedKey;
}

export async function dbGetTotalRequestsCountByUserId({
  userId,
}: {
  userId: string;
}): Promise<number> {
  const [row] = await db
    .select({
      count: sql<number>`SUM(${apiKeyTable.requestCount})`,
    })
    .from(apiKeyTable)
    .where(eq(apiKeyTable.userId, userId));

  const { count } = row ?? { count: 0 };

  return count;
}
