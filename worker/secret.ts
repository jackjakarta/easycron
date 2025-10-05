import { db } from '@/db';
import { secretTable } from '@/db/schema';
import { decryptSecret } from '@/utils/crypto';
import { eq } from 'drizzle-orm';

export async function getHmacSecret({
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
