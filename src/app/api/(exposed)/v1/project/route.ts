import { verifyApiKey } from '@/app/api/utils';
import {
  dbDeleteProject,
  dbGetProjectById,
  dbGetProjectCountByUserId,
  dbInsertProject,
  dbUpdateProject,
} from '@/db/functions/project';
import { getUserActiveSubscriptionApi } from '@/stripe/subscription';
import { toErrorMessage } from '@/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { postRequestSchema, putRequestSchema } from './schemas';

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

export async function POST(req: NextRequest) {
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

    const [subscription, projectCount] = await Promise.all([
      getUserActiveSubscriptionApi({ userId: user.id }),
      dbGetProjectCountByUserId({ userId: user.id }),
    ]);

    if (projectCount >= subscription.limits.projects) {
      return NextResponse.json(
        {
          success: false,
          errors: [
            {
              message:
                'Project limit reached for free plan. Please upgrade your subscription to add more projects.',
            },
          ],
        },
        { status: 402 },
      );
    }

    const json = await req.json();
    const body = postRequestSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json({ success: false, errors: body.error.issues }, { status: 400 });
    }

    const { name: _name, description } = body.data;
    const name = _name.trim();

    const newProject = await dbInsertProject({ name, description, userId: user.id });

    if (newProject === undefined) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Failed to create project' }] },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
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

export async function PUT(req: NextRequest) {
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

    const json = await req.json();
    const body = putRequestSchema.safeParse(json);

    if (!body.success) {
      console.error('Validation errors:', body.error.issues);
      return NextResponse.json({ success: false, errors: body.error.issues }, { status: 400 });
    }

    const { name, description, projectId } = body.data;

    const updated = await dbUpdateProject({
      projectId,
      userId: user.id,
      data: { name, description },
    });

    if (updated === undefined) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Project not found or access denied' }] },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
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

export async function DELETE(req: NextRequest) {
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

    const projectId = parsedProjectId.data;
    const deleted = await dbDeleteProject({ projectId, userId: user.id });

    if (deleted === undefined) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Project not found or access denied' }] },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
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
