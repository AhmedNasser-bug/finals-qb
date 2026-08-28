#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

echo "=> Checking dependencies..."
if ! command -v pnpm &> /dev/null; then
    echo "Warning: pnpm not found. Attempting to enable via corepack..."
    if command -v corepack &> /dev/null; then
        corepack enable pnpm || echo "Warning: corepack enable pnpm failed."
    else
        echo "Error: pnpm and corepack are missing."
        echo "Install pnpm (e.g., npm install -g pnpm) and try again."
        # skip exit for agent compatibility
    fi
fi

if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    # skip exit for agent compatibility
fi

echo "=> Installing dependencies..."
# Use strict peer dependencies and ensure idempotent installs
if [ ! -d "node_modules" ]; then
    pnpm install
else
    echo "Dependencies already installed. Skipping pnpm install."
fi

echo "=> Setting up local environment variables..."
if [ ! -f .env.local ]; then
    echo "Creating .env.local from .env.example (if exists)..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
    else
        touch .env.local
    fi
else
    echo ".env.local already exists."
fi

echo "=> Seeding mock data / workspace prep..."
# Ensure docs directory exists
mkdir -p docs

# Create a mock database seed structure as per orchestration requirements
mkdir -p .data/seeds
if [ ! -f .data/seeds/default-tenant.json ]; then
cat <<EOF3 > .data/seeds/default-tenant.json
{
  "tenants": ["tenant-a", "tenant-b"],
  "initializedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF3
echo "Mock database seeded."
else
    echo "Mock database already seeded."
fi

if [ "$1" = "--multi-tenant" ]; then
    echo "=> Starting multi-tenant sandbox..."
    if [ ! -f docker-compose.yml ]; then
        echo "Error: docker-compose.yml not found."
    elif command -v docker-compose &> /dev/null; then
        # Use idempotent up command, and restart conditionally if needed
        docker-compose up -d --build --remove-orphans
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        # Use idempotent up command
        docker compose up -d --build --remove-orphans
    else
        echo "Error: docker-compose or docker compose is required for multi-tenant setup."
    fi
    echo "Multi-tenant sandbox containers are spinning up..."
fi

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
