import { decryptSecret, encryptSecret } from '@/utils/crypto';
import { eq } from 'drizzle-orm';

import { db } from '..';
import { secretTable } from '../schema';

export async function decryptOrEncryptAllSecrets({ skip = true }) {
  if (skip) {
    console.info('Skipping processing all secrets');
    return;
  }

  const secrets = await db.select().from(secretTable);

  if (secrets.length === 0) {
    return;
  }

  await Promise.all(
    secrets.map((secret) => {
      const isRaw = secret.value.startsWith('whsec_');
      const updatedValue = isRaw ? encryptSecret(secret.value) : decryptSecret(secret.value);

      console.info(
        `${isRaw ? 'Encrypting' : 'Decrypting'} secret id=${secret.id} projectId=${secret.projectId}`,
      );

      return db
        .update(secretTable)
        .set({ value: updatedValue })
        .where(eq(secretTable.id, secret.id));
    }),
  );
}

decryptOrEncryptAllSecrets({ skip: true })
  .then(() => {
    console.info(`Done processing all secrets`);
    process.exit(0);
  })
  .catch((err) => {
    console.info('Error processing secrets', err);
    process.exit(1);
  });
