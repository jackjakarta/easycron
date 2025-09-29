#!/bin/sh

pnpm format:check && pnpm lint && pnpm types && pnpm test && pnpm audit --audit-level=critical && pnpm build:dev
