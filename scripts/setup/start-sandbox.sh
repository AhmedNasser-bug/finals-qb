#!/usr/bin/env bash
set -eo pipefail

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
fi
echo "Multi-tenant sandbox containers are spinning up..."
