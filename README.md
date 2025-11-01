# Next.js Template

## Requirements

- [fnm](https://github.com/Schniz/fnm)
- [stripe-cli](https://docs.stripe.com/stripe-cli)
- [docker/docker-compose](https://www.docker.com/)
- [1password-cli](https://developer.1password.com/docs/cli/) (Optional)

> You can use a `.env` file instead of 1password. Just adjust the commands in `package.json`.

## Usage

Before the application can be started, you need to install the necessary tools.

```sh
fnm use  # set node version
corepack enable && corepack prepare  # set package manager
pnpm i  # install dependencies
```

You can start a local postgres and redis instance using docker compose.
This is needed for the app to work.

```sh
docker compose up -d postgres redis
```

You can generate and run db migrations for postgres like this:

```sh
pnpm db:generate
pnpm db:migrate
```

Start the services (worker, scheduler, stripe webhook listener, drizzle studio):

> Adjust the script at `scripts/start-dev.sh` as needed

```sh
pnpm dev:services
```

You can now start the application:

```sh
pnpm dev
```

You can start the services individually:

```sh
# run ts (no hot reload)

pnpm dev:worker
pnpm dev:scheduler

# or build

pnpm build:worker && pnpm start:worker
pnpm build:scheduler && pnpm start:scheduler

# stripe listener

stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
```

## Emails

If you want to test emails you can start the mailhog server:

```sh
docker compose up -d mailhog
```

## Code checks and format:

Checks:

```sh
pnpm checks
```

Code format:

```sh
pnpm format
```
