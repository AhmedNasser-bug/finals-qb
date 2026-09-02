#!/usr/bin/env bash
set -eo pipefail

echo "=================================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=================================================="

echo "=> Enabling pnpm..."
if command -v corepack &> /dev/null; then
    corepack enable pnpm || echo "Warning: corepack enable failed, assuming pnpm is available."
else
    echo "Warning: corepack not found. Assuming pnpm is installed globally."
fi

echo "=> Installing dependencies..."
pnpm install

echo "=> Spinning up Docker Compose tenants..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build --remove-orphans
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose up -d --build --remove-orphans
else
    echo "Warning: Docker is not available. Skipping tenant container spin-up."
fi

echo "=> Running database seeds..."
if [ -f "scripts/setup/03-seeding.sh" ]; then
    bash scripts/setup/03-seeding.sh
else
    echo "Warning: Seeding script not found at scripts/setup/03-seeding.sh"
fi

echo "=================================================="
echo "=> Sandbox bootstrap complete!"
echo "=================================================="
