import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { dbGetUserById } from '@/db/functions/user';

export async function verifyApiKeyOrGetUser({ key }: { key: string | null }) {
  if (key === null) {
    const user = await getUser();
    return { success: true, user, code: 200 };
  }

  const { error, key: verifiedApiKey } = await auth.api.verifyApiKey({
    body: { key },
  });

  if (error !== null || verifiedApiKey === null) {
    console.error('API Key verification error:', error);
    return { success: false, error: error?.message, code: 401 };
  }

  const _user = { id: verifiedApiKey.userId };
  const user = await dbGetUserById({ userId: _user.id });

  return { success: true, user, code: 200 };
}

export async function verifyApiKey({ key }: { key: string }) {
  try {
    const { error, key: verifiedApiKey } = await auth.api.verifyApiKey({
      body: { key },
    });

    if (error !== null || verifiedApiKey === null) {
      return { success: false, error: error?.message, code: 401 };
    }

    const _user = { id: verifiedApiKey.userId };
    const user = await dbGetUserById({ userId: _user.id });

    return { success: true, user, code: 200 };
  } catch (error) {
    return { success: false, error, code: 401 };
  }
}
