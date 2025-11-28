import { getUser } from '@/auth/utils';
import { dbGetUserApiKeys } from '@/db/functions/api-key';
import { Context } from 'hono';

export async function getApiKeysHandler(ctx: Context<{}>) {
  const user = await getUser();

  try {
    const apiKeys = await dbGetUserApiKeys({ userId: user.id });
    return ctx.json(apiKeys, { status: 200 });
  } catch (error) {
    console.error('Error fetching api keys:', error);
    return ctx.json({ error: 'Failed to fetch api keys' }, { status: 500 });
  }
}
