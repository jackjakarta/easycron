import { slugifyName } from '@/utils/format';
import { notInArray } from 'drizzle-orm';

import { db } from '..';
import { memberTable, organizationTable, userTable } from '../schema';

async function createDefaultOrganizations() {
  const usersWithOrg = db.select({ userId: memberTable.userId }).from(memberTable);

  const usersWithoutOrg = await db
    .select({ id: userTable.id, name: userTable.name })
    .from(userTable)
    .where(notInArray(userTable.id, usersWithOrg));

  if (usersWithoutOrg.length === 0) {
    console.info('All users already have an organization. Nothing to do.');
    return;
  }

  console.info(`Found ${usersWithoutOrg.length} user(s) without an organization.`);

  for (const user of usersWithoutOrg) {
    try {
      await db.transaction(async (tx) => {
        const orgName = `${user.name}'s Organization`;
        const slug = slugifyName({ name: orgName, withNanoId: true });

        const [org] = await tx
          .insert(organizationTable)
          .values({ name: orgName, slug })
          .returning({ id: organizationTable.id });

        if (!org) {
          throw new Error('Failed to insert organization');
        }

        await tx.insert(memberTable).values({
          userId: user.id,
          organizationId: org.id,
          role: 'owner',
        });

        console.info(`Created organization for user ${user.id} (${user.name})`);
      });
    } catch (error) {
      console.error(`Failed to create organization for user ${user.id}:`, error);
    }
  }
}

createDefaultOrganizations()
  .then(() => {
    console.info('Done creating default organizations.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error creating default organizations:', err);
    process.exit(1);
  });
