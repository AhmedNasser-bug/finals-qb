#!/bin/bash
set -e

# Multi-Tenant Sandbox Bootstrap Orchestration

echo "Bootstrapping Multi-Tenant Sandbox..."

# Install dependencies idempotently
if [ ! -d "node_modules" ] || ! command -v pnpm &> /dev/null; then
    echo "Installing dependencies via pnpm..."
    pnpm install
else
    echo "Dependencies are already installed."
fi

# Apply environment configurations (e.g., test databases or local flags)
# Here we ensure local storage mock data is seeded or environment vars are set
echo "Seeding local workspace environment..."
export NODE_ENV=development

echo "Sandbox ready for multi-tenant development."
