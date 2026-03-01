import { verifyApiKey } from '@/app/api/utils';
import { dbGetUserOwnedOrganizationId } from '@/db/functions/organization';
import {
  dbDeleteProject,
  dbGetProjectById,
  dbGetProjectCountByOrganizationId,
  dbInsertProject,
  dbUpdateProject,
} from '@/db/functions/project';
import { getOrgActiveSubscriptionApi } from '@/stripe/subscription';
import { toErrorMessage } from '@/utils/error';
import { Context } from 'hono';
import { z } from 'zod';

import { postRequestSchema, putRequestSchema } from './schemas';

export async function getProjectHandler(ctx: Context<{}>) {
  try {
    const maybeApiKey = ctx.req.header('x-api-key');
    const apiKeyResult = await verifyApiKey({ key: maybeApiKey ?? null });

    if (apiKeyResult.code >= 400 && apiKeyResult.code < 500) {
      return ctx.json(
        { success: false, errors: [{ message: 'Missing or invalid API key' }] },
        { status: 401 },
      );
    }

    const { user } = apiKeyResult;

    if (user === undefined) {
      return ctx.json({ success: false, errors: [{ message: 'User not found' }] }, { status: 404 });
    }

    const organizationId = await dbGetUserOwnedOrganizationId({ userId: user.id });

    if (organizationId === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'No organization found' }] },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(ctx.req.url);
    const _projectId = searchParams.get('projectId');
    const parsedProjectId = z.uuid().safeParse(_projectId);

    if (!parsedProjectId.success) {
      return ctx.json({ success: false, errors: parsedProjectId.error.issues }, { status: 400 });
    }

    const project = await dbGetProjectById({ projectId: parsedProjectId.data, organizationId });

    if (project === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'Project not found or access denied' }] },
        { status: 404 },
      );
    }

    return ctx.json({ success: true, data: project }, { status: 200 });
  } catch (error) {
    console.error({ error, errorMessage: toErrorMessage(error) });
    return ctx.json(
      {
        success: false,
        errors: [{ message: 'Internal Server Error' }],
      },
      { status: 500 },
    );
  }
}

export async function insertProjectHandler(ctx: Context<{}>) {
  try {
    const maybeApiKey = ctx.req.header('x-api-key');
    const apiKeyResult = await verifyApiKey({ key: maybeApiKey ?? null });

    if (apiKeyResult.code >= 400 && apiKeyResult.code < 500) {
      return ctx.json(
        { success: false, errors: [{ message: 'Missing or invalid API key' }] },
        { status: 401 },
      );
    }

    const { user } = apiKeyResult;

    if (user === undefined) {
      return ctx.json({ success: false, errors: [{ message: 'User not found' }] }, { status: 404 });
    }

    const organizationId = await dbGetUserOwnedOrganizationId({ userId: user.id });

    if (organizationId === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'No organization found' }] },
        { status: 404 },
      );
    }

    const [subscription, projectCount] = await Promise.all([
      getOrgActiveSubscriptionApi({ organizationId }),
      dbGetProjectCountByOrganizationId({ organizationId }),
    ]);

    if (projectCount >= subscription.limits.projectsAmount) {
      return ctx.json(
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

    const json = await ctx.req.json();
    const body = postRequestSchema.safeParse(json);

    if (!body.success) {
      return ctx.json({ success: false, errors: body.error.issues }, { status: 400 });
    }

    const { name: _name, description } = body.data;
    const name = _name.trim();

    const newProject = await dbInsertProject({
      name,
      description,
      userId: user.id,
      organizationId,
    });

    if (newProject === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'Failed to create project' }] },
        { status: 500 },
      );
    }

    return ctx.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error({ error, errorMessage: toErrorMessage(error) });
    return ctx.json(
      {
        success: false,
        errors: [{ message: 'Internal Server Error' }],
      },
      { status: 500 },
    );
  }
}

export async function updateProjectHandler(ctx: Context<{}>) {
  try {
    const maybeApiKey = ctx.req.header('x-api-key');
    const apiKeyResult = await verifyApiKey({ key: maybeApiKey ?? null });

    if (apiKeyResult.code >= 400 && apiKeyResult.code < 500) {
      return ctx.json(
        { success: false, errors: [{ message: 'Missing or invalid API key' }] },
        { status: 401 },
      );
    }

    const { user } = apiKeyResult;

    if (user === undefined) {
      return ctx.json({ success: false, errors: [{ message: 'User not found' }] }, { status: 404 });
    }

    const organizationId = await dbGetUserOwnedOrganizationId({ userId: user.id });

    if (organizationId === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'No organization found' }] },
        { status: 404 },
      );
    }

    const json = await ctx.req.json();
    const body = putRequestSchema.safeParse(json);

    if (!body.success) {
      console.error('Validation errors:', body.error.issues);
      return ctx.json({ success: false, errors: body.error.issues }, { status: 400 });
    }

    const { name, description, projectId } = body.data;

    const updated = await dbUpdateProject({
      projectId,
      organizationId,
      data: { name, description },
    });

    if (updated === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'Project not found or access denied' }] },
        { status: 404 },
      );
    }

    return ctx.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error({ error, errorMessage: toErrorMessage(error) });
    return ctx.json(
      {
        success: false,
        errors: [{ message: 'Internal Server Error' }],
      },
      { status: 500 },
    );
  }
}

export async function deleteProjectHandler(ctx: Context<{}>) {
  try {
    const maybeApiKey = ctx.req.header('x-api-key');
    const apiKeyResult = await verifyApiKey({ key: maybeApiKey ?? null });

    if (apiKeyResult.code >= 400 && apiKeyResult.code < 500) {
      return ctx.json(
        { success: false, errors: [{ message: 'Missing or invalid API key' }] },
        { status: 401 },
      );
    }

    const { user } = apiKeyResult;

    if (user === undefined) {
      return ctx.json({ success: false, errors: [{ message: 'User not found' }] }, { status: 404 });
    }

    const organizationId = await dbGetUserOwnedOrganizationId({ userId: user.id });

    if (organizationId === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'No organization found' }] },
        { status: 404 },
      );
    }

    const { searchParams: _searchParams } = new URL(ctx.req.url);
    const _projectId = _searchParams.get('projectId');
    const parsedProjectId = z.uuid().safeParse(_projectId);

    if (!parsedProjectId.success) {
      return ctx.json({ success: false, errors: parsedProjectId.error.issues }, { status: 400 });
    }

    const projectId = parsedProjectId.data;
    const deleted = await dbDeleteProject({ projectId, organizationId });

    if (deleted === undefined) {
      return ctx.json(
        { success: false, errors: [{ message: 'Project not found or access denied' }] },
        { status: 404 },
      );
    }

    return ctx.json({ success: true, data: deleted }, { status: 200 });
  } catch (error) {
    console.error({ error: JSON.stringify(error), errorMessage: toErrorMessage(error) });
    return ctx.json(
      { success: false, errors: [{ message: 'Internal Server Error' }] },
      { status: 500 },
    );
  }
}
