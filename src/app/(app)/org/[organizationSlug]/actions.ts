'use server';

import { auth } from '@/auth';
import { headers } from 'next/headers';

export async function createJobInOrganizationAction() {
  const data = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      permissions: {
        project: ['create'],
      },
    },
  });

  if (!data.success) {
    throw new Error('You do not have permission to create a job in this organization');
  }
}
