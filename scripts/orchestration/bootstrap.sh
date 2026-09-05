#!/usr/bin/env bash
set -e

echo "Starting sandbox orchestration..."
echo "Installing dependencies via pnpm..."
corepack enable pnpm
pnpm install

echo "Preparing multi-tenant environment..."
docker-compose up -d

echo "Seeding completed."
echo "Sandbox ready."
