'use server';

import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { dbUpdateApiKey } from '@/db/functions/api-key';
import { headers } from 'next/headers';

export async function updateApiKeyEnabledAction({
  apiKeyId,
  enabled,
}: {
  apiKeyId: string;
  enabled: boolean;
}) {
  const user = await getUser();

  const updated = await dbUpdateApiKey({
    apiKeyId,
    userId: user.id,
    data: { enabled },
  });

  if (updated === undefined) {
    throw new Error('API key not found or you do not have permission to update it');
  }

  return updated;
}

export async function createApiKeyAction({ name }: { name: string }) {
  const apiKey = await auth.api.createApiKey({
    body: {
      name,
      prefix: 'ec-',
    },
    headers: await headers(),
  });

  return apiKey;
}
