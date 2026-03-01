import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements, ownerAc } from 'better-auth/plugins/organization/access';
import { z } from 'zod';

export const permissionActionSchema = z.enum(['read', 'create', 'update', 'delete']);
export type PermissionAction = z.infer<typeof permissionActionSchema>;

export type PermissionResource = 'project' | 'job' | 'apiKeys' | 'webHooks';

const statement = {
  ...defaultStatements,
  project: permissionActionSchema.options,
  job: permissionActionSchema.options,
  apiKeys: permissionActionSchema.options,
  webHooks: permissionActionSchema.options,
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  project: permissionActionSchema.options,
  job: permissionActionSchema.options,
  apiKeys: permissionActionSchema.options,
  webHooks: permissionActionSchema.options,
  ...ownerAc.statements,
});

export const admin = ac.newRole({
  project: permissionActionSchema.options,
  job: permissionActionSchema.options,
  apiKeys: permissionActionSchema.options,
  webHooks: permissionActionSchema.options,
  ...adminAc.statements,
});

export const member = ac.newRole({
  project: ['read'],
  job: ['read', 'create'],
  apiKeys: ['read', 'create'],
  webHooks: ['read', 'create', 'update'],
});
