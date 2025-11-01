import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '..';
import {
  webhookEndpointTable,
  webhookEventTable,
  type EventType,
  type InsertWebhookEndpointModel,
  type InsertWebhookEventModel,
  type WebhookEndpointModel,
} from '../schema';

export async function dbGetUserWebhookEndpoints({ userId }: { userId: string }) {
  const endpoints = await db
    .select()
    .from(webhookEndpointTable)
    .where(eq(webhookEndpointTable.userId, userId))
    .orderBy(desc(webhookEndpointTable.isActive), desc(webhookEndpointTable.updatedAt));

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
  const [inserted] = await db.insert(webhookEventTable).values(event).returning();

  return inserted;
}

export async function dbGetWebhookEndpointsForEvent({
  projectId,
  userId,
  eventType,
}: {
  projectId: string;
  userId: string;
  eventType: EventType;
}) {
  const endpoints = await db
    .select()
    .from(webhookEndpointTable)
    .where(
      and(
        eq(webhookEndpointTable.projectId, projectId),
        eq(webhookEndpointTable.userId, userId),
        sql`${webhookEndpointTable.enabledEventTypes} @> ${JSON.stringify([eventType])}`,
      ),
    );

  return endpoints;
}

export async function dbInsertWebhookEndpoint(
  data: InsertWebhookEndpointModel,
): Promise<WebhookEndpointModel | undefined> {
  const [inserted] = await db.insert(webhookEndpointTable).values(data).returning();

  return inserted;
}
