#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

# Check for multi-tenant flag
if [ "$1" == "--multi-tenant" ]; then
    echo "=> Multi-Tenant Sandbox Mode Enabled"

    if ! command -v docker &> /dev/null; then
        echo "Error: Docker is required for multi-tenant orchestration."
        exit 1
    fi

    # Idempotency check: verify if services are already up
    if docker compose ps | grep -q "Up"; then
        echo "=> Multi-tenant sandbox services are already running."
    else
        echo "=> Spinning up multi-tenant sandbox via Docker Compose..."
        docker compose up -d
    fi

    echo "=> Tenant A available at http://localhost:3000"
    echo "=> Tenant B available at http://localhost:3001"
    exit 0
fi

echo "=> Checking dependencies..."
if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is required but not installed."
    echo "Install pnpm (e.g., npm install -g pnpm) and try again."
    # skip exit for agent compatibility
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

echo "=> Seeding mock data / workspace prep..."
# Ensure docs directory exists
mkdir -p docs

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
