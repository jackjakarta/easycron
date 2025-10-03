import { encryptSecret } from '@/utils/crypto';
import { createHmacSigningKey } from '@/utils/hmac';
import { and, eq } from 'drizzle-orm';

import { db } from '..';
import { secretTable, type InsertSecretModel, type SecretModel } from '../schema';

export async function dbUpsertSecret(data: InsertSecretModel): Promise<SecretModel | undefined> {
  const rawSecret = createHmacSigningKey();
  const encryptedSecret = encryptSecret(rawSecret);

  const [secret] = await db
    .insert(secretTable)
    .values(data)
    .onConflictDoUpdate({
      target: [secretTable.projectId],
      set: { value: encryptedSecret },
    })
    .returning();

  return secret;
}

export async function dbGetSecretByProjectId({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}): Promise<SecretModel | undefined> {
  const [secret] = await db
    .select()
    .from(secretTable)
    .where(and(eq(secretTable.projectId, projectId), eq(secretTable.userId, userId)));

  return secret;
}
