import { getUser } from '@/auth/utils';
import { dbGetUserApiKeys } from '@/db/functions/api-key';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();

  try {
    const apiKeys = await dbGetUserApiKeys({ userId: user.id });
    return NextResponse.json(apiKeys, { status: 200 });
  } catch (error) {
    console.error('Error fetching api keys:', error);
    return NextResponse.json({ error: 'Failed to fetch api keys' }, { status: 500 });
  }
}
