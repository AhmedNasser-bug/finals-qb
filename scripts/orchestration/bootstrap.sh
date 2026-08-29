#!/bin/sh
set -e

echo "Starting sandbox bootstrap orchestration..."

# Ensure corepack and pnpm are available
if ! command -v pnpm >/dev/null 2>&1; then
  echo "Enabling corepack for pnpm..."
  corepack enable pnpm
fi

echo "Installing workspace dependencies..."
pnpm install

# Setup multi-tenant containers
if [ -f "docker-compose.yml" ]; then
  echo "Starting multi-tenant Docker sandbox..."
  docker compose up -d
else
  echo "docker-compose.yml not found. Skipping container setup."
fi

# Run existing workspace prep and seeding routines
if [ -f "scripts/setup/03-seeding.sh" ]; then
  bash scripts/setup/03-seeding.sh
else
  echo "Seeding script not found. Skipping."
fi

echo "Multi-tenant Sandbox Bootstrap Complete."
