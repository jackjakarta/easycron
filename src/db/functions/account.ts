import { type AuthProvider } from '@/auth/types';
import { and, eq } from 'drizzle-orm';

import { db } from '..';
import { accountTable, type AccountModel } from '../schema';

export async function dbGetAccountByUserIdAndProvider({
  userId,
  provider,
}: {
  userId: string;
  provider: AuthProvider;
}): Promise<AccountModel | undefined> {
  const [account] = await db
    .select()
    .from(accountTable)
    .where(and(eq(accountTable.userId, userId), eq(accountTable.providerId, provider)));

  return account;
}
