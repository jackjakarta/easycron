'use server';

import { auth } from '@/auth';
import { getUser } from '@/auth/utils';
import { slugifyName } from '@/utils/format';
import { headers } from 'next/headers';

export async function createOrganizationAction({
  name,
  logoS3Key,
}: {
  name: string;
  logoS3Key?: string;
}) {
  const user = await getUser();

  const slugBase = slugifyName({ name });
  const slugWithNanoId = slugifyName({ name, withNanoId: true });

  const isSlugAvailable = await checkOrganizationSlugAvailability(slugBase);

  const organization = await auth.api.createOrganization({
    body: {
      name,
      slug: isSlugAvailable ? slugBase : slugWithNanoId,
      logo: logoS3Key ?? 'assets/placeholder-organization-logo.png',
      userId: user.id,
      keepCurrentActiveOrganization: false,
    },
    headers: await headers(),
  });

  if (organization === null) {
    throw new Error('Failed to create organization');
  }

  return organization;
}

async function checkOrganizationSlugAvailability(slug: string): Promise<boolean> {
  try {
    const { status } = await auth.api.checkOrganizationSlug({
      body: {
        slug,
      },
    });

    return status;
  } catch (error) {
    throw error;
  }
}
