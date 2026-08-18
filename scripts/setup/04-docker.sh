#!/usr/bin/env bash
set -eo pipefail

if [ "$1" = "--multi-tenant" ]; then
    echo "=> Starting multi-tenant sandbox..."
    if [ ! -f docker-compose.yml ]; then
        echo "Error: docker-compose.yml not found."
    elif command -v docker-compose &> /dev/null; then
        # Use idempotent up command, and restart conditionally if needed
        docker-compose up -d --build --remove-orphans
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        # Use idempotent up command
        docker compose up -d --build --remove-orphans
    else
        echo "Error: docker-compose or docker compose is required for multi-tenant setup."
        exit 1
    fi
    echo "Multi-tenant sandbox containers are spinning up..."
fi

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
