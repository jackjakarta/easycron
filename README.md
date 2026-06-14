<div align="center">
  <img src="public/favicon.png" alt="easyCron logo" width="96" height="96" />

  <h1>easyCron</h1>

  <p><strong>A full-stack SaaS cron job scheduler — schedule, run, and monitor HTTP cron jobs with ease.</strong></p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" />
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-17-4169e1?logo=postgresql&logoColor=white" />
    <img alt="Redis" src="https://img.shields.io/badge/Redis-BullMQ-d82c20?logo=redis&logoColor=white" />
  </p>
</div>

---

easyCron is a multi-tenant cron job scheduler built with Next.js 15 (App Router). Users can schedule HTTP-based cron jobs, monitor their executions in real time, get alerted on failures, and manage everything through organizations and projects. Jobs are dispatched by a dedicated scheduler and executed by a horizontally-scalable worker pool backed by Redis/BullMQ.

## Features

- **Flexible scheduling** — cron expressions or simple intervals, with timezone support and precision down to the second.
- **Reliable execution** — distributed locking (`SET NX`) lets multiple schedulers run safely; the worker pool executes with configurable concurrency.
- **Automatic retries** — exponential backoff with jitter and per-job retry/timeout settings.
- **Real-time monitoring** — detailed execution logs, latency, HTTP status, and a 4 KB response preview for every run.
- **Analytics** — success rates and execution trends backed by a materialized view.
- **Webhooks** — subscribe to `job.execution.completed` / `job.execution.failed` events; deliveries are signed with HMAC-SHA256.
- **Signed requests** — outbound job requests are signed with `X-Easycron-Signature` so your endpoints can verify authenticity.
- **Multi-tenancy & RBAC** — organizations, projects, and roles (owner / admin / member).
- **Full auth** — email/password, Google & GitHub OAuth, 2FA, passkeys, and API keys (via Better-auth).
- **Billing** — Stripe subscriptions with per-plan execution limits.
- **Encryption at rest** — sensitive fields (e.g. auth headers) are encrypted with AES-256-GCM.

## Architecture

easyCron runs as **three separate processes** that communicate through a Redis-backed BullMQ queue:

| Process       | Entry point          | Role                                                                 |
| ------------- | -------------------- | -------------------------------------------------------------------- |
| **Next.js**   | `src/app/`           | Web UI and API routes (CRUD for jobs, projects, orgs, billing, etc.) |
| **Scheduler** | `scheduler/index.ts` | Polls the DB every 1 s for due jobs and enqueues them to Redis       |
| **Worker**    | `worker/index.ts`    | BullMQ consumer that executes the HTTP requests (20 concurrency)     |

The scheduler also refreshes the `execution_hourly_stats` materialized view every 5 minutes. For a deep dive into the full execution lifecycle, see [`docs/job-execution-flow.md`](docs/job-execution-flow.md).

### Tech stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript (strict mode)
- **API:** [Hono](https://hono.dev) with Zod validation and end-to-end type safety
- **Database:** PostgreSQL 17 + [Drizzle ORM](https://orm.drizzle.team)
- **Queue:** [BullMQ](https://bullmq.io) + Redis (queue: `easycron-runs`)
- **HTTP client:** [undici](https://undici.nodejs.org) for job execution
- **Auth:** [Better-auth](https://www.better-auth.com) (OAuth, 2FA, passkeys, API keys)
- **UI:** shadcn/ui + Radix UI + Tailwind CSS 4
- **State:** TanStack Query (server state) + React context (UI state)
- **Payments:** Stripe (`@better-auth/stripe`)
- **Email:** [React Email](https://react.email) sent via Mailjet (Nodemailer fallback)
- **i18n:** next-intl
- **Monitoring:** Sentry

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) (version pinned in `.nvmrc`; [fnm](https://github.com/Schniz/fnm) recommended)
- [pnpm](https://pnpm.io) (via Corepack)
- [Docker / Docker Compose](https://www.docker.com/) — for local Postgres, Redis, and MailHog
- [Stripe CLI](https://docs.stripe.com/stripe-cli) — for billing webhooks (optional)
- [1Password CLI](https://developer.1password.com/docs/cli/) — for secret injection (optional, see [Environment variables](#environment-variables))

### 1. Install tooling and dependencies

```sh
fnm use                                # set the node version
corepack enable && corepack prepare    # set up pnpm
pnpm i                                  # install dependencies
```

### 2. Start local infrastructure

```sh
docker compose up -d postgres redis    # required
docker compose up -d mailhog           # optional, for email testing (UI on :8025)
```

### 3. Configure environment variables

See [Environment variables](#environment-variables) below. Access in code is type-safe via `import { env } from '@/env'`.

### 4. Run database migrations

```sh
pnpm db:generate    # generate Drizzle migrations (only when the schema changes)
pnpm db:migrate     # apply migrations
```

### 5. Start the background services and the app

```sh
# scheduler + worker + stripe listener + drizzle studio
pnpm dev:services

# in another terminal — the Next.js app
pnpm dev
```

The app is now available at [http://localhost:3000](http://localhost:3000).

You can also run the services individually:

```sh
pnpm dev:worker       # BullMQ worker
pnpm dev:scheduler    # cron scheduler

# Stripe webhook listener (for local billing)
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# or build + run the compiled services
pnpm build:worker && pnpm start:worker
pnpm build:scheduler && pnpm start:scheduler
```

## Environment variables

Secrets are managed with the [1Password CLI](https://developer.1password.com/docs/cli/) — the `pnpm` scripts wrap commands in `op run` using `.env.op` as the template (run `pnpm op:inject` to resolve it into a static `.env`). **You don't need 1Password:** create a plain `.env` file with the variables below and drop the `op run --env-file=".env.op" --` prefix from the relevant scripts in `package.json`.

| Variable                                                    | Description                                           |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| `DATABASE_URL`                                              | PostgreSQL connection string                          |
| `REDIS_URL` / `REDIS_PASSWORD`                              | Redis connection for BullMQ                           |
| `BETTER_AUTH_URL` / `BETTER_AUTH_SECRET`                    | Better-auth base URL and signing secret               |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`                 | Google OAuth credentials                              |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`                 | GitHub OAuth credentials                              |
| `SECRET_ENCRYPTION_KEY`                                     | AES-256-GCM key for encrypting sensitive fields       |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`                        | Next.js server actions encryption key                 |
| `EASY_CRON_WEBHOOK_SECRET`                                  | HMAC secret for signing outbound job/webhook requests |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`               | Stripe API and webhook secrets                        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`                        | Stripe publishable key (client)                       |
| `MONTHLY_PRICE_ID` / `YEARLY_PRICE_ID`                      | Stripe price IDs for the subscription plans           |
| `MAILJET_API_KEY` / `MAILJET_API_SECRET`                    | Mailjet credentials for transactional email           |
| `OPENAI_API_KEY`                                            | OpenAI key (AI features)                              |
| `NEXT_PUBLIC_SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Sentry DSN and environment (client)                   |
| `SENTRY_AUTH_TOKEN`                                         | Sentry auth token for source map uploads              |
| `DEV_MODE`                                                  | `true` / `false` — toggles development-only behavior  |

> Generate an encryption key for `SECRET_ENCRYPTION_KEY` with `pnpm generate:encryption-key`.

## Project structure

```
.
├── src/
│   ├── app/
│   │   ├── (app)/        # authenticated routes (dashboard, projects, org, settings)
│   │   ├── (auth)/       # login, register, 2FA
│   │   ├── (landing)/    # public landing page
│   │   └── api/          # Hono API (query / utility / organization route groups)
│   ├── auth/             # Better-auth config (organization + stripe plugins)
│   ├── components/       # UI components (shadcn/ui + Radix)
│   ├── db/               # Drizzle schema, query functions, migrations
│   ├── email/            # React Email templates
│   ├── env/              # type-safe env validation (@t3-oss/env-nextjs)
│   ├── hooks/query/      # React Query hooks
│   ├── queue/            # BullMQ queue config
│   └── utils/            # crypto, cron, date, http helpers
├── scheduler/            # cron scheduler process
├── worker/               # BullMQ worker process
├── docs/                 # architecture docs
└── messages/             # i18n message catalogs
```

## Scripts

| Command              | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `pnpm dev`           | Start the Next.js dev server (Turbopack)                    |
| `pnpm dev:services`  | Start worker + scheduler + stripe listener + Drizzle Studio |
| `pnpm dev:worker`    | Start the BullMQ worker                                     |
| `pnpm dev:scheduler` | Start the cron scheduler                                    |
| `pnpm dev:email`     | Email template preview server (port 3001)                   |
| `pnpm db:generate`   | Generate Drizzle migrations                                 |
| `pnpm db:migrate`    | Run Drizzle migrations                                      |
| `pnpm db:studio`     | Open Drizzle Studio                                         |
| `pnpm build`         | Build the Next.js app                                       |
| `pnpm checks`        | Run all checks: `format:check`, `lint`, `types`, `test`     |
| `pnpm format`        | Format code with Prettier                                   |
| `pnpm test`          | Run tests (Vitest)                                          |

Run a single test file:

```sh
pnpm vitest --run src/utils/date.test.ts
```

## Code quality

Before opening a pull request, make sure all checks pass:

```sh
pnpm checks    # format:check + lint + types + test
pnpm format    # auto-format
```

## Documentation

- [Job execution flow](docs/job-execution-flow.md) — full lifecycle of a cron job run
- [Permissions](docs/permissions.md) — role-based access control model
- [`CLAUDE.md`](CLAUDE.md) — in-depth architecture and conventions
