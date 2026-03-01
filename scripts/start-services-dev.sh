#!/bin/bash

docker compose up -d
sleep 1

pnpm concurrently \
  --names "STRIPE,WORKER,SCHEDULER" \
  --prefix-colors "green,magenta,red" \
  "stripe listen --forward-to localhost:3000/api/auth/stripe/webhook" \
  "pnpm dev:worker" \
  "pnpm dev:scheduler"
