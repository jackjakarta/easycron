import { verifyApiKey } from '@/app/api/utils';
import { dbInsertJob } from '@/db/functions/job';
import { dbGetProjectById } from '@/db/functions/project';
import { NextRequest, NextResponse } from 'next/server';

import { requestBodySchema } from './schemas';

export async function POST(req: NextRequest) {
  try {
    const maybeApiKey = req.headers.get('x-api-key');
    const apiKeyResult = await verifyApiKey({ key: maybeApiKey });

    if (apiKeyResult.code >= 400 && apiKeyResult.code <= 499) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Missing or invalid API key' }] },
        { status: 401 },
      );
    }

    const { user } = apiKeyResult;

    if (user === undefined) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'User not found' }] },
        { status: 404 },
      );
    }

    const json = await req.json();
    const body = requestBodySchema.safeParse(json);

    if (!body.success) {
      console.error('Validation errors:', body.error.issues);
      return NextResponse.json({ success: false, errors: body.error.issues }, { status: 400 });
    }

    const { projectId } = body.data;
    const project = await dbGetProjectById({ projectId, userId: user.id });

    if (project === undefined) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Project not found or access denied' }] },
        { status: 404 },
      );
    }

    const job = await dbInsertJob({
      ...body.data,
      userId: user.id,
      projectId: project.id,
      nextRunAt: new Date(),
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error({ error });
    return NextResponse.json(
      { success: false, errors: [{ message: 'Internal Server Error' }] },
      { status: 500 },
    );
  }
}
