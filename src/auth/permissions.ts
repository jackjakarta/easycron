import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements, ownerAc } from 'better-auth/plugins/organization/access';
import { z } from 'zod';

export const permissionActionSchema = z.enum(['view', 'create', 'update', 'delete']);
export type PermissionAction = z.infer<typeof permissionActionSchema>;

const statement = {
  ...defaultStatements,
  project: permissionActionSchema.options,
  job: permissionActionSchema.options,
  apiKeys: permissionActionSchema.options,
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  project: permissionActionSchema.options,
  job: permissionActionSchema.options,
  apiKeys: permissionActionSchema.options,
  ...ownerAc.statements,
});

export const admin = ac.newRole({
  project: permissionActionSchema.options,
  job: permissionActionSchema.options,
  apiKeys: permissionActionSchema.options,
  ...adminAc.statements,
});

export const member = ac.newRole({
  project: ['view'],
  job: ['view', 'create'],
  apiKeys: ['view', 'create', 'update'],
});
