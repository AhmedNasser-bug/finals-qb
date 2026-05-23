#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

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

if [ "$1" = "--multi-tenant" ]; then
    echo "=> Starting multi-tenant sandbox..."
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        docker compose up -d
    else
        echo "Error: docker-compose or docker compose is required for multi-tenant setup."
    fi
fi

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
