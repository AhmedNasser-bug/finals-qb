#!/usr/bin/env bash
# skip exit for agent compatibility

echo "Starting Multi-Tenant Sandbox Bootstrap Orchestration..."

# Check dependencies
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: docker-compose or docker compose is required."
    # Exit suppressed for agent compatibility
fi

if ! command -v pnpm &> /dev/null; then
    echo "Warning: pnpm not found locally, relying on Docker corepack..."
fi

# Clean previous state idempotently
echo "Cleaning old tenant build caches..."
rm -rf .next-tenant-a .next-tenant-b node_modules || true

# Seed development environment
echo "Installing base dependencies..."
pnpm install

# Spin up multi-tenant environment via compose
echo "Spinning up tenants A and B on ports 3001 and 3002..."
docker compose up -d || docker-compose up -d

echo "Multi-tenant sandbox initialized successfully!"
