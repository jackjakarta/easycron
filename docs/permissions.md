# Permissions & Access Control

`src/auth/permissions.ts` defines the role-based access control (RBAC) system using Better Auth's `createAccessControl` API.

## How it works

There are two layers of permissions:

1. **App resources** — custom resources defined for easyCron (`project`, `job`, `apiKeys`)
2. **Org management resources** — built-in Better Auth resources for managing the organization itself (`organization`, `member`, `invitation`, `team`, `ac`)

The `statement` object declares every resource and its valid actions. `createAccessControl(statement)` returns `ac`, the typed controller used to define roles. Each call to `ac.newRole({...})` produces a role object whose `.statements` property is the plain `{resource: actions[]}` map.

---

## What `.statements` spread means

`ownerAc` and `adminAc` are **pre-built role objects** exported by Better Auth's organization plugin (`better-auth/plugins/organization/access`). They represent Better Auth's default understanding of what an owner/admin can do within an organization.

When you write:

```ts
export const owner = ac.newRole({
  project: permissionActionSchema.options,
  ...ownerAc.statements,  // ← spreads built-in org permissions into this role
});
```

You're merging Better Auth's built-in org permissions into the custom role definition. Without this spread, the `owner` role would only have access to app resources (`project`, `job`, `apiKeys`) but couldn't manage members, invitations, or the organization itself.

---

## Built-in statements (from Better Auth source)

### `adminAc.statements`

| Resource       | Allowed actions                      |
| -------------- | ------------------------------------ |
| `organization` | `update`                             |
| `member`       | `create`, `update`, `delete`         |
| `invitation`   | `create`, `cancel`                   |
| `team`         | `create`, `update`, `delete`         |
| `ac`           | `create`, `read`, `update`, `delete` |

### `ownerAc.statements`

| Resource       | Allowed actions                      |
| -------------- | ------------------------------------ |
| `organization` | `update`, **`delete`**               |
| `member`       | `create`, `update`, `delete`         |
| `invitation`   | `create`, `cancel`                   |
| `team`         | `create`, `update`, `delete`         |
| `ac`           | `create`, `read`, `update`, `delete` |

**The only difference between `adminAc` and `ownerAc`** is that the owner can `delete` the organization. Admins cannot.

---

## Roles in easyCron

### `owner`

Full access to everything.

| Resource       | Actions                              |
| -------------- | ------------------------------------ |
| `project`      | `view`, `create`, `update`, `delete` |
| `job`          | `view`, `create`, `update`, `delete` |
| `apiKeys`      | `view`, `create`, `update`, `delete` |
| `organization` | `update`, `delete`                   |
| `member`       | `create`, `update`, `delete`         |
| `invitation`   | `create`, `cancel`                   |
| `team`         | `create`, `update`, `delete`         |
| `ac`           | `create`, `read`, `update`, `delete` |

Assigned to: the user who created the organization.

---

### `admin`

Full access to app resources. Can manage the org but **cannot delete it**.

| Resource       | Actions                              |
| -------------- | ------------------------------------ |
| `project`      | `view`, `create`, `update`, `delete` |
| `job`          | `view`, `create`, `update`, `delete` |
| `apiKeys`      | `view`, `create`, `update`, `delete` |
| `organization` | `update` only                        |
| `member`       | `create`, `update`, `delete`         |
| `invitation`   | `create`, `cancel`                   |
| `team`         | `create`, `update`, `delete`         |
| `ac`           | `create`, `read`, `update`, `delete` |

---

### `member`

Restricted access. Read-only on projects, limited job/API key creation. No org management permissions.

| Resource  | Actions                    |
| --------- | -------------------------- |
| `project` | `view` only                |
| `job`     | `view`, `create`           |
| `apiKeys` | `view`, `create`, `update` |

No `organization`, `member`, `invitation`, `team`, or `ac` permissions.

---

## How permissions are checked

At runtime, `checkPermissions()` in `src/auth/utils.ts` calls `auth.api.hasPermission()`, passing a map of `{resource: actions[]}`. Better Auth resolves the user's active organization role and checks whether that role's statements cover all requested actions.

```ts
// Example: check if current user can create a project
const allowed = await checkPermissions([
  { resource: 'project', permissions: ['create'] },
]);
```

The check is against the **active organization** stored in the session (`session.session.activeOrganizationId`).

---

## Where permissions are enforced

### Server actions

- `src/app/(app)/projects/actions.ts` — calls `checkPermissions([{ resource: 'project', permissions: ['create'] }])` before creating a project
- `src/app/(app)/org/[organizationSlug]/actions.ts` — calls `auth.api.hasPermission` with `project: ['create']` before creating a job

### API routes (`/api/v1/...`)

- `src/app/api/v1/project/handlers.ts` and `job/handlers.ts` use `dbGetUserOwnedOrganizationId()` — only the **owner** of an org can use the REST API on its behalf

### Stripe / billing

- `src/auth/plugins/stripe.ts` — the `authorizeReference` hook checks `member.role === 'owner'`; only owners can manage subscriptions

### UI layer

- `src/app/(app)/org/.../org-members-table.tsx` — `canManage = role === 'owner' || role === 'admin'`; admins cannot act on other admins or the owner
- `src/app/(app)/org/.../invite-member-dialog.tsx` — invitations are limited to `'member'` or `'admin'`; the `'owner'` role cannot be assigned via invitation

### Org creation

- `src/auth/index.ts` — when a new user signs up and an organization is created for them, they are automatically assigned the `'owner'` role
