#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SETUP_DIR="$DIR/../setup"

# Make setup scripts idempotent directly in this orchestrated flow
echo "=> Ensuring dependencies are installed via pnpm install..."
pnpm install --prefer-offline --no-frozen-lockfile

echo "=> Setting up local environment variables..."
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
    else
        touch .env.local
    fi
fi

echo "=> Seeding mock data / workspace prep..."
mkdir -p .data/seeds
# Idempotently write the seed data
cat <<'SEED_EOF' > .data/seeds/default-tenant.json
{
  "tenants": ["tenant-a", "tenant-b"],
  "initializedAt": "2024-01-01T00:00:00Z"
}
SEED_EOF
echo "Mock database seeded."

echo "=> Starting multi-tenant sandbox..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build --remove-orphans
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose up -d --build --remove-orphans
else
    echo "Warning: docker/docker-compose not found. Skipping container startup."
fi

echo "=> Environment bootstrap complete."
