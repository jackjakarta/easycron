'use server';

import { auth } from '@/auth';
import { checkPermissions, getUser } from '@/auth/utils';
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

  const hasPermission = await checkPermissions([
    {
      resource: 'apiKeys',
      permissions: ['update'],
    },
  ]);

  if (!hasPermission) {
    throw new Error('You do not have permission to create update api keys in this organization');
  }

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
  const hasPermission = await checkPermissions([
    {
      resource: 'apiKeys',
      permissions: ['create'],
    },
  ]);

  if (!hasPermission) {
    throw new Error('You do not have permission to create a job in this organization');
  }

  const apiKey = await auth.api.createApiKey({
    body: {
      name,
      prefix: 'ec-',
    },
    headers: await headers(),
  });

  return apiKey;
}
