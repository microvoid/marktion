#!/bin/bash
set -e

# build pkg
pnpm i
pnpm run prebuild
pnpm run build

# start
npx pm2 restart ./scripts/pm2.config.js --env production
