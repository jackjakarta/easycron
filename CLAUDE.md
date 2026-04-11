# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

easyCron is a full-stack SaaS cron job scheduler built with Next.js 15 (App Router). Users can schedule, manage, and monitor HTTP-based cron jobs with real-time execution tracking, webhook support, and multi-tenant organization management.

## Common Commands

```bash
pnpm dev                    # Start Next.js dev server (turbopack, requires 1Password CLI)
pnpm dev:worker             # Start BullMQ job worker
pnpm dev:scheduler          # Start cron scheduler
pnpm dev:services           # Start worker + scheduler + stripe listener + drizzle studio
pnpm dev:email              # Email template preview server (port 3001)

pnpm checks                 # Run all checks: format:check, lint, types, test
pnpm format                 # Format code with Prettier
pnpm lint                   # ESLint
pnpm types                  # TypeScript type check (tsc --noEmit)
pnpm test                   # Run tests (vitest --run)

pnpm db:generate            # Generate Drizzle migrations
pnpm db:migrate             # Run Drizzle migrations
pnpm db:studio              # Open Drizzle Studio

pnpm build                  # Build Next.js
pnpm build:worker           # Build worker (tsup)
pnpm build:scheduler        # Build scheduler (tsup)
```

Run a single test file: `pnpm vitest --run src/utils/date.test.ts`

**Local services:** `docker compose up -d postgres redis` (required for development). Add `mailhog` for email testing. Stripe webhook listener: `stripe listen --forward-to localhost:3000/api/auth/stripe/webhook`

**Environment:** Uses 1Password CLI (`op run`) for secrets injection. Use `pnpm fetch:env` to export to a `.env` file instead. Access env vars via `import { env } from '@/env'` (runtime-validated by `@t3-oss/env-nextjs` with Zod).

## Architecture

### Three-Process Model

The application runs as three separate processes:

1. **Next.js App** (`src/app/`) — Web UI and API routes
2. **Scheduler** (`scheduler/`) — Polls DB every 1s for due jobs, enqueues them to Redis via BullMQ. Uses Redis distributed locks (`SET NX PX`) to support horizontal scaling. Refreshes the `execution_hourly_stats` materialized view every 5 minutes.
3. **Worker** (`worker/`) — BullMQ worker executing HTTP cron jobs with 20 concurrency. Implements exponential backoff with jitter for retries. Checks subscription execution limits before running. Signs requests with HMAC-SHA256 (`X-Easycron-Signature` header).

### Source Layout

- `src/app/(app)/` — Authenticated routes (dashboard, projects, org, settings)
- `src/app/(auth)/` — Authentication routes (login, register, 2FA)
- `src/app/(landing)/` — Public landing page
- `src/app/api/` — Hono API (see API pattern below)
- `src/auth/` — Better-auth config with custom plugins (organization, stripe)
- `src/db/schema.ts` — Drizzle ORM schema (all tables in `app` PostgreSQL schema)
- `src/db/functions/` — Database query functions (repository pattern)
- `src/db/migrations/` — SQL migrations
- `src/queue/` — BullMQ queue configuration (singleton connection + queue)
- `src/components/ui/` — shadcn/ui components (Radix primitives)
- `src/hooks/query/` — React Query custom hooks
- `src/env/index.ts` — Type-safe env vars via @t3-oss/env-nextjs
- `src/email/emails/` — React Email templates
- `src/utils/` — Utility functions (crypto, cron, date, formatting, http)

### Hono API Pattern

All API routes funnel through a single catch-all route at `src/app/api/[[...route]]/route.ts`. The Hono app (`src/app/api/hono-app.ts`) composes route groups:

- `queryRouteGroup` — GET requests for data fetching
- `utilityRouteGroup` — Health checks, maintenance
- `organizationRouteGroup` — Org-scoped mutations
- `v1RouteGroup` — Versioned public API (authenticated via API key)

Each route group directory contains: `index.ts` (route definitions), `handlers.ts` (business logic), `schemas.ts` (Zod validation). Handler pattern: verify auth → check subscription limits → validate schema → authorize → execute DB operation → return `ctx.json({ success, data/errors }, { status })`.

The app exports `type AppType = typeof routes` which enables end-to-end type safety on the client via `hc<AppType>(baseUrl)`.

### Database Conventions

- Tables use snake_case in DB, camelCase in TypeScript (Drizzle `casing` option)
- Types: `typeof table.$inferSelect` for models, `.$inferInsert` for inserts
- DB functions in `src/db/functions/` follow naming: `dbGetXxx()`, `dbInsertXxx()`, `dbUpdateXxx()`, `dbDeleteXxx()`
- Every query includes organization ID for multi-tenancy isolation
- Sensitive fields (auth headers) encrypted with AES-256-GCM via `src/utils/crypto.ts` (format: `iv:authTag:encrypted`)

### Auth & Permissions

- Better-auth with email/password, OAuth (Google/GitHub), 2FA, API keys, passkeys
- `src/auth/utils.ts` exports `getUser()` (returns user + organizationId + subscription context) and `checkPermissions()` for RBAC
- `src/auth/permissions.ts` defines role-based access: Owner/Admin have full access; Member has limited actions
- On user creation, a personal organization is auto-created with `owner` role
- Session automatically sets `activeOrganizationId` if missing

### React Query Hooks

Hooks in `src/hooks/query/` follow the convention `use[Entity]Query`. Each hook auto-generates cache keys from params (including organization ID for tenant separation), normalizes date strings to Date objects in responses, and uses the type-safe Hono client.

### Key Technology Choices

- **Database:** PostgreSQL 17 + Drizzle ORM
- **API:** Hono framework with Zod validation
- **Queue:** BullMQ + Redis (queue name: `easycron-runs`)
- **HTTP client:** Undici for job execution (with streaming response capture up to 4KB)
- **UI:** shadcn/ui + Radix UI + Tailwind CSS 4 + React Hook Form
- **State:** React Query for server state, React context for UI state
- **Payments:** Stripe subscriptions via @better-auth/stripe plugin
- **Email:** React Email templates sent via Mailjet (primary) / Nodemailer (fallback)
- **Monitoring:** Sentry for error tracking
- **i18n:** next-intl

### TypeScript Configuration

- Strict mode enabled with `noUncheckedIndexedAccess`
- Path alias: `@/*` maps to `./src/*`
- Unused vars must be prefixed with `_` (ESLint rule)

### Multi-Tenancy

Organizations are the tenant boundary. Users belong to organizations with roles (owner, admin, member). Projects and jobs are scoped to organizations. The session tracks the active organization.

## Libraries

When working with libraries always use the context7 mcp tools, never guess APIs from memory.
