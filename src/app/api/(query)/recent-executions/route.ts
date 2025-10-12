import { getUser } from '@/auth/utils';
import { dbGetRecentExecutions } from '@/db/functions/execution';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();

  try {
    const recentExecutions = await dbGetRecentExecutions({ userId: user.id });
    return NextResponse.json(recentExecutions, { status: 200 });
  } catch (error) {
    console.error('Error fetching job executions:', error);
    return NextResponse.json({ error: 'Failed to fetch job executions' }, { status: 500 });
  }
}
