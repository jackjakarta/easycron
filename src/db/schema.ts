import {
  boolean,
  index,
  integer,
  jsonb,
  pgSchema,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';

import { type UpdateDbRow } from './types';

export const appSchema = pgSchema('app');

export const userTable = appSchema.table('user_entity', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type UserModel = typeof userTable.$inferSelect;
export type InsertUserModel = typeof userTable.$inferSelect;
export type UpdateUserModel = Omit<UpdateDbRow<UserModel>, 'email'>;

export const sessionTable = appSchema.table('session', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SessionModel = typeof sessionTable.$inferSelect;
export type InsertSessionModel = typeof sessionTable.$inferInsert;

export const accountTable = appSchema.table('account', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AccountModel = typeof accountTable.$inferSelect;
export type InsertAccountModel = typeof accountTable.$inferInsert;

export const verificationTable = appSchema.table('verification', {
  id: uuid('id').defaultRandom().primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type VerificationModel = typeof verificationTable.$inferSelect;
export type InsertVerificationModel = typeof verificationTable.$inferInsert;

export const twoFactorTable = appSchema.table('two_factor', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id)
    .unique(),
  secret: text('secret'),
  backupCodes: text('backup_codes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type TwoFactorModel = typeof twoFactorTable.$inferSelect;
export type InsertTwoFactorModel = typeof twoFactorTable.$inferInsert;
export type UpdateTwoFactorModel = UpdateDbRow<TwoFactorModel>;

export const projectTable = appSchema.table('project', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ProjectModel = typeof projectTable.$inferSelect;
export type InsertProjectModel = typeof projectTable.$inferInsert;
export type UpdateProjectModel = UpdateDbRow<ProjectModel>;

export const httpMethodSchema = z.enum(['GET', 'POST']);
export const httpMethodPgEnum = appSchema.enum('http_method', httpMethodSchema.enum);
export type HttpMethod = z.infer<typeof httpMethodSchema>;

type RequestHeaders = { k: string; v: string };

export const jobs = appSchema.table(
  'jobs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projectTable.id),
    name: text('name').notNull(),
    enabled: boolean('enabled').default(true).notNull(),
    scheduleCron: text('schedule_cron').notNull(),
    timezone: text('timezone').default('UTC').notNull(),
    httpMethod: httpMethodPgEnum('http_method').notNull().default('GET'),
    url: text('url').notNull(),
    headers: jsonb('headers')
      .$type<RequestHeaders[]>()
      .notNull()
      .default('[]' as any),
    body: text('body'),
    timeoutMs: integer('timeout_ms').notNull().default(10000),
    maxRetries: integer('max_retries').notNull().default(2),
    backoffInitialMs: integer('backoff_initial_ms').notNull().default(5000),
    backoffFactor: real('backoff_factor').notNull().default(2.0),
    jitterMs: integer('jitter_ms').notNull().default(500),
    hmacSigningKeyId: uuid('hmac_signing_key_id'),
    lastRunAt: timestamp('last_run_at', { withTimezone: true }),
    nextRunAt: timestamp('next_run_at', { withTimezone: true }).notNull(),
    consecutiveFailures: integer('consecutive_failures').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('jobs_project_id_idx').on(table.nextRunAt, table.projectId)],
);

export type JobModel = typeof jobs.$inferSelect;
export type InsertJobModel = typeof jobs.$inferInsert;
export type UpdateJobModel = UpdateDbRow<JobModel>;
