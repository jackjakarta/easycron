import { decryptSecret } from '@/utils/crypto';
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
  organizationId,
}: {
  projectId: string;
  organizationId: string;
}): Promise<SecretModel | undefined> {
  const [secret] = await db
    .select()
    .from(secretTable)
    .where(
      and(eq(secretTable.projectId, projectId), eq(secretTable.organizationId, organizationId)),
    );

  return secret;
}

export async function dbDeleteSecret({
  projectId,
  organizationId,
}: {
  projectId: string;
  organizationId: string;
}): Promise<SecretModel | undefined> {
  const [deletedSecret] = await db
    .delete(secretTable)
    .where(
      and(eq(secretTable.projectId, projectId), eq(secretTable.organizationId, organizationId)),
    )
    .returning();

  return deletedSecret;
}

export async function dbGetHmacSecretForWorker({
  projectId,
}: {
  projectId: string | null;
}): Promise<string | null> {
  if (projectId === null) {
    return null;
  }

  const [secretRow] = await db
    .select()
    .from(secretTable)
    .where(eq(secretTable.projectId, projectId));

  if (secretRow === undefined) {
    return null;
  }

  const { value: encrypted } = secretRow;
  const decrypted = decryptSecret(encrypted);

  return decrypted;
}
