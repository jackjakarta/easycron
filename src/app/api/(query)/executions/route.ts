import { getUser } from '@/auth/utils';
import { dbGetFinishedExecutionsByJobId } from '@/db/functions/execution';
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
      console.error({ error: parsedJobId.error.issues });
      return NextResponse.json({ error: 'Invalid jobId' }, { status: 400 });
    }

    const jobId = parsedJobId.data;
    const job = await dbGetJobById({ jobId, userId: user.id });

    if (job === undefined) {
      console.error({ error: 'Job not found' });
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const jobExecutions = await dbGetFinishedExecutionsByJobId({ jobId: job.id });
    return NextResponse.json(jobExecutions, { status: 200 });
  } catch (error) {
    console.error('Error fetching job executions:', error);
    return NextResponse.json({ error: 'Failed to fetch job executions' }, { status: 500 });
  }
}
