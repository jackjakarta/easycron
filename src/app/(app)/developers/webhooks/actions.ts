'use server';

import { checkPermissions, getUser } from '@/auth/utils';
import { dbInsertWebhookEndpoint } from '@/db/functions/webhook';
import { type InsertWebhookEndpointModel } from '@/db/schema';

export async function createWebhookEndpointAction(
  data: Omit<InsertWebhookEndpointModel, 'userId' | 'organizationId'>,
) {
  const user = await getUser();

  const hasPermission = await checkPermissions([
    {
      resource: 'webHooks',
      permissions: ['create'],
    },
  ]);

  if (!hasPermission) {
    throw new Error('You do not have permission to create a job in this organization');
  }

  const endpoint = await dbInsertWebhookEndpoint({
    ...data,
    userId: user.id,
    organizationId: user.organizationId,
  });

  if (endpoint === undefined) {
    throw new Error('Failed to create webhook endpoint');
  }

  return endpoint;
}
