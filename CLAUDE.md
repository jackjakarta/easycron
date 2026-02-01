This file provides guidance when working with code in this repository.

## Project Overview

EasyCron is a cron job management service built with Next.js 15. It schedules and executes HTTP-based jobs using a distributed architecture with separate scheduler and worker processes. Jobs are defined with cron expressions, stored in PostgreSQL, queued in Redis (via BullMQ), and executed by workers with retry logic, webhook notifications, and HMAC signing.

## Architecture

### Three-Process System

1. **Next.js App** (`pnpm dev`): Web UI and API routes
2. **Scheduler** (`pnpm dev:scheduler`): Polls database for due jobs and enqueues them to Redis
3. **Worker** (`pnpm dev:worker`): Consumes jobs from Redis queue and executes HTTP requests

### Data Flow

- **Scheduler** (scheduler/utils.ts): Queries `job` table for jobs where `nextRunAt <= now()`, creates BullMQ jobs with payload `{jobId, scheduledForISO}`, updates `nextRunAt` using cron-parser
- **Worker** (worker/run.ts): Processes BullMQ jobs, executes HTTP requests with retry/backoff, records `execution` rows, sends webhook notifications with HMAC signatures, updates job `consecutiveFailures`
- **Queue** (src/queue/queue.ts): BullMQ queue named `easycron-runs` with Redis connection

### Database Schema

All tables are in the `app` PostgreSQL schema (src/db/schema.ts):

- **User system**: `user_entity`, `session`, `account`, `verification`, `two_factor`, `api_key`
- **Core entities**: `project`, `job`, `execution`, `secret`, `webhook_endpoint`, `webhook_event`
- **Billing**: `subscription` (integrated with Stripe via better-auth)

Key relationships:

- Jobs belong to projects and users
- Executions track individual job runs with status (succeeded/failed/timed_out/skipped)
- Secrets are encrypted project-level values (one per project)
- Webhook endpoints subscribe to events (`job.execution.completed`, `job.execution.failed`)

### Authentication & Authorization

Uses `better-auth` (src/auth/index.ts) with:

- Email/password auth with email verification
- Social auth (Google, GitHub)
- Two-factor authentication (TOTP)
- API key authentication for programmatic access
- Stripe integration for subscriptions with trial periods
- All auth tables use custom naming (`user_entity` instead of `user`)

## Development Commands

### Initial Setup

```bash
fnm use                          # Set Node.js version from .nvmrc
corepack enable && corepack prepare
pnpm i
docker compose up -d postgres redis
pnpm db:generate                 # Generate migrations from schema changes
pnpm db:migrate                  # Apply migrations
```

### Running Services

```bash
# All services together (recommended)
pnpm dev:services               # Starts postgres, redis, mailhog, drizzle studio, worker, scheduler, stripe listener

# Or start main app separately
pnpm dev                        # Next.js dev server with Turbopack

# Individual services
pnpm dev:worker                 # BullMQ worker (processes jobs)
pnpm dev:scheduler              # Job scheduler (enqueues due jobs)
pnpm db:studio                  # Drizzle Studio on default port
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
```

### Building

```bash
pnpm build                      # Build Next.js app for production
pnpm build:worker              # Build worker with tsup (outputs to dist/worker/)
pnpm build:scheduler           # Build scheduler with tsup (outputs to dist/scheduler/)
```

### Code Quality

```bash
pnpm checks                     # Runs type checking, linting, and format check
pnpm format                     # Format code with Prettier
pnpm lint                       # Run ESLint
pnpm types                      # Type check without emitting (tsc --noEmit)
pnpm test                       # Run Vitest tests
```

## Environment & Secrets

Uses 1Password CLI for secret management (optional, can use `.env` file instead):

- `.env.op` contains 1Password secret references
- All scripts use `op run --env-file=".env.op"` to inject secrets
- To export to `.env`: `pnpm fetch:env`
- Custom encryption key generation: `pnpm generate:encryption-key`
- Secrets in DB are encrypted; decrypt with: `pnpm decrypt:secrets`

## Key Technical Details

### Database Operations

- Uses Drizzle ORM with PostgreSQL
- Schema is in `src/db/schema.ts` with all tables in `app` schema
- Database functions are in `src/db/functions/*.ts` (organized by entity)
- Migrations in `src/db/migrations/` (managed by drizzle-kit)
- Connection via `src/db/index.ts`

### Job Execution

Jobs (src/db/schema.ts jobTable) have:

- Cron schedule with timezone support
- HTTP method, URL, headers, body
- Retry configuration (maxRetries, backoffInitialMs, backoffFactor, jitterMs)
- Timeout (default 10s)
- HMAC signing for webhook security

Execution flow (worker/run.ts):

1. Fetch job from DB
2. Attempt HTTP request with configured timeout
3. Retry with exponential backoff if failed
4. Record execution in `execution` table
5. Update job `consecutiveFailures` counter
6. Send webhook notifications to registered endpoints with HMAC signature

### Webhook System

- Webhook endpoints (src/db/schema.ts webhookEndpointTable) subscribe to event types
- Events: `job.execution.completed`, `job.execution.failed`
- Payloads include jobId, executionId, status, httpStatus, latencyMs, responseSize
- HMAC signatures sent as `X-Easycron-Signature: sha256={hash}` header
- Endpoint failures tracked via `consecutiveFailures`

### App Structure

- Route groups: `(auth)`, `(app)`, `(policies)`
- Main routes: `/projects`, `/projects/[projectId]`, `/projects/[projectId]/job/[jobId]`
- Developer routes: `/developers/api-keys`, `/developers/webhooks`
- Settings: `/settings/account`, `/settings/billing`
- Uses Next.js App Router with React Server Components
- Internationalization via next-intl (messages in `messages/en.json`)

## Testing

- Framework: Vitest with jsdom environment
- Config: vitest.config.mts
- Test files: `*.test.ts` or `*.spec.ts`
- Run tests: `pnpm test`
- Limited test coverage currently (mainly utils)

## Docker & Production

- Development: `docker-compose.yml` (postgres, redis, mailhog)
- Production: `docker-compose.production.yml` with full stack
- Dockerfile included for containerized deployment
- Uses Traefik for routing in production

## Email System

- Development: MailHog SMTP server (`docker compose up -d mailhog`, UI at http://localhost:8025)
- Email templates in `src/email/emails/` using React Email
- Preview emails: `pnpm dev:email` (runs on port 3001)
- Sending logic in `src/email/send.ts`
- Supports user actions (verify email, reset password) and subscription notifications

## Common Patterns

### Adding New Database Tables

1. Define schema in `src/db/schema.ts` within `appSchema`
2. Add type exports (`Model`, `InsertModel`, `UpdateModel`)
3. Create functions in `src/db/functions/{entity}.ts`
4. Generate migration: `pnpm db:generate`
5. Apply migration: `pnpm db:migrate`

### Working with Jobs

- Job scheduling uses `cron-parser` library (src/utils/cron.ts)
- Scheduler creates unique BullMQ job IDs: `run-{jobId}-{scheduledISO}` (colons removed)
- Distributed locking via Redis (`src/utils/locks.ts`) prevents duplicate scheduling
- Jobs execute via `executeHttp` utility (src/utils/http.ts)

### API Routes

Better-auth handles all auth routes via `/api/auth/*`. Custom API routes follow Next.js App Router conventions in `src/app/api/`.
