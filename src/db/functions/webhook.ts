import { and, eq, sql } from 'drizzle-orm';

import { db } from '..';
import { webhookEndpointTable, webhookEventTable, type InsertWebhookEventModel } from '../schema';

export async function dbGetUserWebhookEndpoints({ userId }: { userId: string }) {
  const endpoints = await db
    .select()
    .from(webhookEndpointTable)
    .where(and(eq(webhookEndpointTable.userId, userId), eq(webhookEndpointTable.isActive, true)));

  return endpoints;
}

export async function dbGetWebhookEndpointById({
  webhookEndpointId,
}: {
  webhookEndpointId: string;
}) {
  const [endpoint] = await db
    .select()
    .from(webhookEndpointTable)
    .where(eq(webhookEndpointTable.id, webhookEndpointId));

  return endpoint;
}

export async function dbInsertWebhookEvent(event: InsertWebhookEventModel) {
  const inserted = await db.insert(webhookEventTable).values(event).returning();

  return inserted;
}

export async function dbGetWebhookEndpointsJobSuccessEvents({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const endpoints = await db
    .select()
    .from(webhookEndpointTable)
    .where(
      and(
        eq(webhookEndpointTable.projectId, projectId),
        eq(webhookEndpointTable.userId, userId),
        sql`${webhookEndpointTable.enabledEventTypes} @> ${JSON.stringify(['job.execution.completed'])}`,
      ),
    );

  return endpoints;
}

export async function dbGetWebhookEndpointsJobFailureEvents({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const endpoints = await db
    .select()
    .from(webhookEndpointTable)
    .where(
      and(
        eq(webhookEndpointTable.projectId, projectId),
        eq(webhookEndpointTable.userId, userId),
        sql`${webhookEndpointTable.enabledEventTypes} @> ${JSON.stringify(['job.execution.failed'])}`,
      ),
    );

  return endpoints;
}
