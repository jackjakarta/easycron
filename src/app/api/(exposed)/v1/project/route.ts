import { verifyApiKey } from '@/app/api/utils';
import { dbGetProjectById } from '@/db/functions/project';
import { toErrorMessage } from '@/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const maybeApiKey = req.headers.get('x-api-key');
    const apiKeyResult = await verifyApiKey({ key: maybeApiKey });

    if (apiKeyResult.code >= 400 && apiKeyResult.code < 500) {
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

    const { searchParams } = req.nextUrl;
    const _projectId = searchParams.get('projectId');
    const parsedProjectId = z.uuid().safeParse(_projectId);

    if (!parsedProjectId.success) {
      return NextResponse.json(
        { success: false, errors: parsedProjectId.error.issues },
        { status: 400 },
      );
    }

    const project = await dbGetProjectById({ projectId: parsedProjectId.data, userId: user.id });

    if (project === undefined) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Project not found or access denied' }] },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    console.error({ error, errorMessage: toErrorMessage(error) });
    return NextResponse.json(
      {
        success: false,
        errors: [{ message: 'Internal Server Error' }],
      },
      { status: 500 },
    );
  }
}
