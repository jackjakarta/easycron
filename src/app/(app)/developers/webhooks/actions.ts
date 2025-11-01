'use server';

import { getUser } from '@/auth/utils';
import { dbInsertWebhookEndpoint } from '@/db/functions/webhook';
import { type InsertWebhookEndpointModel } from '@/db/schema';

export async function createWebhookEndpointAction(
  data: Omit<InsertWebhookEndpointModel, 'userId'>,
) {
  const user = await getUser();

  const endpoint = await dbInsertWebhookEndpoint({
    ...data,
    userId: user.id,
  });

  if (endpoint === undefined) {
    throw new Error('Failed to create webhook endpoint');
  }

  return endpoint;
}
