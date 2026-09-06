#!/bin/bash
set -e

# Multi-Tenant Sandbox Bootstrap Orchestration

echo "Starting bootstrap process..."

# 1. Dependency installation
echo "Installing dependencies..."
pnpm install

# 2. Environment setup & Database seeding placeholders
echo "Setting up environment variables and seeding placeholders..."
export NEXT_DIST_DIR_A=.next-tenant-a
export NEXT_DIST_DIR_B=.next-tenant-b

# 3. Spin up Docker Compose tenants
echo "Spinning up multi-tenant development environments..."
docker-compose up -d

echo "Bootstrap completed successfully."
