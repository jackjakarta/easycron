import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { dbGetUserById } from '@/db/functions/user';
import { type UserModel } from '@/db/schema';
import { unauthorized } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function verifyApiKeyOrGetUser({ key }: { key: string | null }): Promise<UserModel> {
  if (key === null) {
    const user = await getUser();
    return user;
  }

  const { error, key: verifiedApiKey } = await auth.api.verifyApiKey({
    body: { key },
  });

  if (error !== null || verifiedApiKey === null) {
    return unauthorized();
  }

  const _user = { id: verifiedApiKey.userId };
  const user = await dbGetUserById({ userId: _user.id });

  if (user === undefined) {
    return unauthorized();
  }

  return user;
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
