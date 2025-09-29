import { AuthProvider } from '@/auth/types';
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
  providerId: text('provider_id').$type<AuthProvider>().notNull(),
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

export const apiKeyTable = appSchema.table('api_key', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  start: text('start'),
  prefix: text('prefix'),
  key: text('key').notNull().unique(),
  userId: uuid('user_id')
    .references(() => userTable.id)
    .notNull(),
  refillInterval: integer('refill_interval'),
  refillAmount: integer('refill_amount'),
  lastRefillAt: timestamp('last_refill_at', { withTimezone: true }),
  enabled: boolean('enabled').default(true).notNull(),
  rateLimitEnabled: boolean('rate_limit_enabled').default(false).notNull(),
  rateLimitTimeWindow: integer('rate_limit_time_window'),
  rateLimitMax: integer('rate_limit_max'),
  requestCount: integer('request_count').default(0).notNull(),
  remaining: integer('remaining'),
  lastRequest: timestamp('last_request', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  permissions: text('permissions'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ApiKeyModel = typeof apiKeyTable.$inferSelect;
export type InsertApiKeyModel = typeof apiKeyTable.$inferInsert;

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

export type JobRequestHeaders = {
  k: string;
  v: string;
};

export const jobTable = appSchema.table(
  'job',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    enabled: boolean('enabled').default(true).notNull(),
    scheduleCron: text('schedule_cron').notNull(),
    timezone: text('timezone').default('UTC').notNull(),
    httpMethod: httpMethodPgEnum('http_method').notNull().default('GET'),
    url: text('url').notNull(),
    headers: jsonb('headers').$type<JobRequestHeaders[]>().notNull().default([]),
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
    projectId: uuid('project_id')
      .references(() => projectTable.id)
      .notNull(),
    userId: uuid('user_id')
      .references(() => userTable.id)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('jobs_project_id_user_id_next_run_at_idx').on(
      table.nextRunAt,
      table.projectId,
      table.userId,
    ),
    index('jobs_project_id_user_id_idx').on(table.projectId, table.userId),
  ],
);

export type JobModel = typeof jobTable.$inferSelect;
export type InsertJobModel = typeof jobTable.$inferInsert;
export type UpdateJobModel = UpdateDbRow<JobModel>;

export const exectutionStatusSchema = z.enum(['succeeded', 'failed', 'timed_out', 'skipped']);
export const executionStatusPgEnum = appSchema.enum(
  'execution_status',
  exectutionStatusSchema.enum,
);
export type ExecutionStatus = z.infer<typeof exectutionStatusSchema>;

export const executionTable = appSchema.table(
  'execution',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    jobId: uuid('job_id')
      .references(() => jobTable.id)
      .notNull(),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    attempt: integer('attempt').notNull().default(1),
    status: executionStatusPgEnum('status').notNull(),
    httpStatus: integer('http_status'),
    latencyMs: integer('latency_ms'),
    requestSize: integer('request_size'),
    responseSize: integer('response_size'),
    responseTruncated: boolean('response_truncated').notNull().default(false),
    errorMessage: text('error_message'),
    responsePreview: text('response_preview'),
  },
  (table) => [index('exec_job_started_idx').on(table.startedAt, table.jobId)],
);

export type ExecutionModel = typeof executionTable.$inferSelect;
export type InsertExecutionModel = typeof executionTable.$inferInsert;
export type UpdateExecutionModel = UpdateDbRow<ExecutionModel>;

export const secretTable = appSchema.table('secret', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projectTable.id),
  name: text('name').notNull(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SecretModel = typeof secretTable.$inferSelect;
export type InsertSecretModel = typeof secretTable.$inferInsert;
export type UpdateSecretModel = UpdateDbRow<SecretModel>;
