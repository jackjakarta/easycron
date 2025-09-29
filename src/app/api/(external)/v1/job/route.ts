import { dbInsertJob } from '@/db/functions/job';
import { dbGetProjectById } from '@/db/functions/project';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyApiKey } from '../../utils';

const requestBodySchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
    url: z.url('Invalid URL').max(2000, 'URL must be at most 2000 characters'),
    httpMethod: z.enum(['GET', 'POST']),
    scheduleCron: z
      .string()
      .min(1, 'Cron expression is required')
      .max(100, 'Cron expression must be at most 100 characters'),
    timezone: z
      .string()
      .min(1, 'Timezone is required')
      .max(100, 'Timezone must be at most 100 characters'),
    body: z.string().max(5000, 'Body must be at most 5000 characters').optional(),
    projectId: z.uuid(),
    headers: z.array(
      z.object({
        k: z
          .string()
          .min(1, 'Header name is required')
          .max(200, 'Header name must be at most 200 characters'),
        v: z.string().max(1000, 'Header value must be at most 1000 characters'),
      }),
    ),
  })
  .strict();

export async function POST(req: NextRequest) {
  try {
    const maybeApiKey = req.headers.get('x-api-key');
    const parsedApiKey = z.string().safeParse(maybeApiKey);

    if (!parsedApiKey.success) {
      return NextResponse.json({ error: 'Api key is required' }, { status: 401 });
    }

    const result = await verifyApiKey({ key: parsedApiKey.data });

    if (result.code === 401) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { user } = result;

    if (user === undefined) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const json = await req.json();
    const body = requestBodySchema.safeParse(json);

    if (!body.success) {
      console.error('Validation errors:', body.error.issues);
      return NextResponse.json({ error: body.error.issues }, { status: 400 });
    }

    const project = await dbGetProjectById({ projectId: body.data.projectId, userId: user.id });

    if (project === undefined) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const parsedData = body.data;
    const job = await dbInsertJob({
      ...parsedData,
      userId: user.id,
      projectId: project.id,
      nextRunAt: new Date(),
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/(external)/v1/job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
