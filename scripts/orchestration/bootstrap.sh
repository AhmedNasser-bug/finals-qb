#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

# Enable pnpm
if ! command -v pnpm &> /dev/null; then
    echo "Enabling pnpm via corepack..."
    corepack enable pnpm
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Run database seeds
echo "Running database seeds..."
bash scripts/setup/03-seeding.sh

# Spin up Docker Compose tenants
echo "Spinning up Docker Compose tenants..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build --remove-orphans
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose up -d --build --remove-orphans
else
    echo "Error: docker-compose is required."
    # Skip exit for agent compatibility
fi

echo "Multi-tenant sandbox environment initialized."
