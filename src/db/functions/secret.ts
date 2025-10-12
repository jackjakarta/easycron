import { and, eq } from 'drizzle-orm';

import { db } from '..';
import { secretTable, type InsertSecretModel, type SecretModel } from '../schema';

export async function dbUpsertSecret(data: InsertSecretModel): Promise<SecretModel | undefined> {
  const [secret] = await db
    .insert(secretTable)
    .values(data)
    .onConflictDoUpdate({
      target: [secretTable.projectId],
      set: { value: data.value },
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

export async function dbDeleteSecret({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}): Promise<SecretModel | undefined> {
  const [deletedSecret] = await db
    .delete(secretTable)
    .where(and(eq(secretTable.projectId, projectId), eq(secretTable.userId, userId)))
    .returning();

  return deletedSecret;
}
