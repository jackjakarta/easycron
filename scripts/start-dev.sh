#!/bin/bash

docker compose up -d
sleep 1

pnpm concurrently \
  --names "DRIZZLE STUDIO,WORKER,STRIPE,SCHEDULER" \
  --prefix-colors "blue,green,magenta,red" \
  "pnpm db:studio" \
  "pnpm dev:worker" \
  "stripe listen --forward-to localhost:3000/api/auth/stripe/webhook" \
  "pnpm dev:scheduler"
