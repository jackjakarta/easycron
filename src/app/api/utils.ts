import crypto from 'crypto';

import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { dbGetUserById } from '@/db/functions/user';
import { z } from 'zod';

export async function verifyApiKeyOrGetUser({ key }: { key: string | null }) {
  if (key === null) {
    const user = await getUser();
    return { success: true, user, code: 200 };
  }

  const parsedApiKey = z.string().nonempty().safeParse(key);

  if (!parsedApiKey.success) {
    return { success: false, error: parsedApiKey.error.issues, code: 400 };
  }

  try {
    const { error, key: verifiedApiKey } = await auth.api.verifyApiKey({
      body: { key: parsedApiKey.data },
    });

    if (error !== null || verifiedApiKey === null) {
      console.error('API Key verification error:', error);
      return { success: false, error: error?.message, code: 401 };
    }

    const _user = { id: verifiedApiKey.userId };
    const user = await dbGetUserById({ userId: _user.id });

    return { success: true, user, code: 200 };
  } catch (error) {
    console.error('Unexpected error during API Key verification:', error);
    return { success: false, error, code: 401 };
  }
}

export async function verifyApiKey({ key }: { key: string | null }) {
  const parsedApiKey = z.string().nonempty().safeParse(key);

  if (!parsedApiKey.success) {
    return { success: false, error: parsedApiKey.error.issues, code: 400 };
  }

  try {
    const { error, key: verifiedApiKey } = await auth.api.verifyApiKey({
      body: { key: parsedApiKey.data },
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

export function verifyRequestSignature({
  payload,
  signature,
  secret,
}: {
  payload: string;
  signature: string;
  secret: string;
}): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
  const [, sanitizedSignature] = signature.split('=');

  if (sanitizedSignature === undefined) {
    return false;
  }

  try {
    const sigBuffer = Buffer.from(sanitizedSignature, 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}
