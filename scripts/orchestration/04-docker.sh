#!/usr/bin/env bash
set -eo pipefail

if [ "$1" = "--multi-tenant" ]; then
    echo "=> Starting multi-tenant sandbox..."
    if [ ! -f docker-compose.yml ]; then
        echo "Error: docker-compose.yml not found."
    elif command -v docker-compose &> /dev/null; then
        # Check if already running
        if docker-compose ps | grep -q "Up"; then
             echo "Containers are already running. Skipping."
        else
             # Use idempotent up command, and restart conditionally if needed
             docker-compose up -d --build --remove-orphans
        fi
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        if docker compose ps | grep -q "Up"; then
             echo "Containers are already running. Skipping."
        else
             # Use idempotent up command
             docker compose up -d --build --remove-orphans
        fi
    else
        echo "Error: docker-compose or docker compose is required for multi-tenant setup."
    fi
    echo "Multi-tenant sandbox containers are spinning up..."
fi

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
