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

export async function dbGetOrganizationWebhookEndpoints({
  organizationId,
}: {
  organizationId: string;
}) {
  const endpoints = await db
    .select()
    .from(webhookEndpointTable)
    .where(eq(webhookEndpointTable.organizationId, organizationId))
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
  organizationId,
  eventType,
}: {
  projectId: string;
  organizationId: string;
  eventType: EventType;
}) {
  const endpoints = await db
    .select()
    .from(webhookEndpointTable)
    .where(
      and(
        eq(webhookEndpointTable.projectId, projectId),
        eq(webhookEndpointTable.organizationId, organizationId),
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
