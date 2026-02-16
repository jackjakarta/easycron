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

**Local services:** `docker compose up -d postgres redis` (required for development). Add `mailhog` for email testing.

**Environment:** Uses 1Password CLI (`op run`) for secrets injection. Alternatively, use a `.env` file and adjust package.json commands.

## Architecture

### Three-Process Model

The application runs as three separate processes:

1. **Next.js App** (`src/app/`) — Web UI and API routes
2. **Scheduler** (`scheduler/`) — Polls DB every 1s for due jobs, enqueues them to Redis via BullMQ
3. **Worker** (`worker/`) — BullMQ worker executing cron jobs with 20 concurrent workers

### Source Layout

- `src/app/(app)/` — Authenticated routes (dashboard, projects, org, settings)
- `src/app/(auth)/` — Authentication routes (login, register, 2FA)
- `src/app/(landing)/` — Public landing page
- `src/app/api/` — API routes using Hono framework with Zod validation
- `src/auth/` — Better-auth config with custom plugins (organization, stripe)
- `src/db/schema.ts` — Drizzle ORM schema (PostgreSQL)
- `src/db/functions/` — Database query functions (repository pattern)
- `src/db/migrations/` — SQL migrations
- `src/queue/` — BullMQ queue configuration
- `src/components/ui/` — shadcn/ui components (Radix primitives)
- `src/hooks/query/` — React Query custom hooks
- `src/env/index.ts` — Type-safe env vars via @t3-oss/env-nextjs
- `src/email/emails/` — React Email templates
- `src/utils/` — Utility functions (crypto, cron, date, formatting)

### Key Technology Choices

- **Database:** PostgreSQL 17 + Drizzle ORM (type-safe queries with `$inferSelect`)
- **Auth:** Better-auth with email/password, OAuth (Google/GitHub), 2FA, API keys, passkeys
- **API:** Hono framework with @hono/zod-validator for request validation
- **Queue:** BullMQ + Redis for distributed job scheduling and execution
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

### Testing

Tests are in `src/utils/*.test.ts` and use Vitest with jsdom environment. Run a single test file:

```bash
pnpm vitest --run src/utils/date.test.ts
```

### Multi-Tenancy

Organizations are the tenant boundary. Users belong to organizations with roles (owner, admin, member). Projects and jobs are scoped to organizations. The session tracks the active organization.
