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
pnpm install

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

./scripts/setup/seed-tenant.sh
./scripts/setup/start-sandbox.sh "$1"

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
