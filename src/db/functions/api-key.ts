import { desc, eq } from 'drizzle-orm';

import { db } from '..';
import { apiKeyTable, type ApiKeyModel } from '../schema';

export async function dbGetUserApiKeys({ userId }: { userId: string }): Promise<ApiKeyModel[]> {
  const keys = await db
    .select()
    .from(apiKeyTable)
    .where(eq(apiKeyTable.userId, userId))
    .orderBy(desc(apiKeyTable.updatedAt));

  return keys;
}
