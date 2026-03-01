import { eq, isNull, sql } from 'drizzle-orm';

import { db } from '..';
import {
  jobTable,
  memberTable,
  projectTable,
  secretTable,
  webhookEndpointTable,
  webhookEventTable,
} from '../schema';

async function migrateResourcesToOrgs() {
  const ownerOrgSubquery = db
    .select({
      userId: memberTable.userId,
      organizationId: memberTable.organizationId,
    })
    .from(memberTable)
    .where(eq(memberTable.role, 'owner'))
    .as('owner_org');

  // Migrate projects
  const projectResult = await db
    .update(projectTable)
    .set({
      organizationId: sql`${ownerOrgSubquery.organizationId}`,
    })
    .from(ownerOrgSubquery)
    .where(eq(projectTable.userId, ownerOrgSubquery.userId));
  console.info(`Migrated projects: ${projectResult.rowCount} rows updated`);

  // Migrate jobs
  const jobResult = await db
    .update(jobTable)
    .set({
      organizationId: sql`${ownerOrgSubquery.organizationId}`,
    })
    .from(ownerOrgSubquery)
    .where(eq(jobTable.userId, ownerOrgSubquery.userId));
  console.info(`Migrated jobs: ${jobResult.rowCount} rows updated`);

  // Migrate secrets
  const secretResult = await db
    .update(secretTable)
    .set({
      organizationId: sql`${ownerOrgSubquery.organizationId}`,
    })
    .from(ownerOrgSubquery)
    .where(eq(secretTable.userId, ownerOrgSubquery.userId));
  console.info(`Migrated secrets: ${secretResult.rowCount} rows updated`);

  // Migrate webhook endpoints
  const webhookEndpointResult = await db
    .update(webhookEndpointTable)
    .set({
      organizationId: sql`${ownerOrgSubquery.organizationId}`,
    })
    .from(ownerOrgSubquery)
    .where(eq(webhookEndpointTable.userId, ownerOrgSubquery.userId));
  console.info(`Migrated webhook endpoints: ${webhookEndpointResult.rowCount} rows updated`);

  // Migrate webhook events
  const webhookEventResult = await db
    .update(webhookEventTable)
    .set({
      organizationId: sql`${ownerOrgSubquery.organizationId}`,
    })
    .from(ownerOrgSubquery)
    .where(eq(webhookEventTable.userId, ownerOrgSubquery.userId));
  console.info(`Migrated webhook events: ${webhookEventResult.rowCount} rows updated`);

  // Verify no orphans remain
  const tables = [
    { name: 'project', table: projectTable },
    { name: 'job', table: jobTable },
    { name: 'secret', table: secretTable },
    { name: 'webhook_endpoint', table: webhookEndpointTable },
    { name: 'webhook_event', table: webhookEventTable },
  ] as const;

  for (const { name, table } of tables) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(table)
      .where(isNull(table.organizationId));

    if ((result?.count ?? 0) > 0) {
      console.warn(`WARNING: ${result?.count} ${name} rows still have NULL organizationId`);
    }
  }
}

migrateResourcesToOrgs()
  .then(() => {
    console.info('Done migrating resources to organizations.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error migrating resources to organizations:', err);
    process.exit(1);
  });
