import { auth } from '@/auth';
import { dbGetUserById } from '@/db/functions/user';
import { getOrgActiveSubscription } from '@/stripe/subscription';
import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

import { type PermissionAction, type PermissionResource } from './permissions';
import { type UserAndContext } from './types';

export async function getMaybeSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function getValidSession() {
  const session = await getMaybeSession();

  if (session === null) {
    redirect('/login', RedirectType.replace);
  }

  return session;
}

export async function getUser(): Promise<UserAndContext> {
  const session = await getValidSession();
  const user = await dbGetUserById({ userId: session.user.id });

  if (user === undefined) {
    redirect('/login', RedirectType.replace);
  }

  const organizationId = session.session.activeOrganizationId;

  if (organizationId === null || organizationId === undefined) {
    redirect('/login', RedirectType.replace);
  }

  const subscription = await getOrgActiveSubscription({ referenceId: organizationId });

  return {
    ...user,
    organizationId,
    subscription,
  };
}

type PermissionSet = {
  resource: PermissionResource;
  permissions: PermissionAction[];
};

export async function checkPermissions(permissionSet: PermissionSet[]) {
  const permissions = permissionSet.reduce(
    (acc, { resource, permissions }) => {
      acc[resource] = permissions;
      return acc;
    },
    {} as Partial<Record<PermissionResource, PermissionAction[]>>,
  );

  const { success: hasPermission } = await auth.api.hasPermission({
    headers: await headers(),
    body: { permissions },
  });

  return hasPermission;
}
