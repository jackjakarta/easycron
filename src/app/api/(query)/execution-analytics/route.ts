import { getUser } from '@/auth/utils';
import { dbGetExecutionAnalytics } from '@/db/functions/execution-analytics';
import { dbGetJobById } from '@/db/functions/job';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  const user = await getUser();
  const { searchParams } = req.nextUrl;

  try {
    const _jobId = searchParams.get('jobId');
    const parsedJobId = z.uuid().safeParse(_jobId);

    if (!parsedJobId.success) {
      return NextResponse.json({ error: 'Invalid jobId' }, { status: 400 });
    }

    const jobId = parsedJobId.data;
    const job = await dbGetJobById({ jobId, userId: user.id });

    if (job === undefined) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const analytics = await dbGetExecutionAnalytics({ jobId: job.id });
    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Error fetching execution analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch execution analytics' }, { status: 500 });
  }
}
