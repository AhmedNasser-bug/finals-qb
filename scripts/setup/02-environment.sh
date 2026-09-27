#!/usr/bin/env bash
set -eo pipefail

echo "=> Setting up local environment variables..."
if [ ! -f .env.local ]; then
    echo "Creating .env.local from .env.example (if exists)..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
    else
        echo "Warning: .env.example not found. Creating empty .env.local"
        touch .env.local
    fi
else
    echo ".env.local already exists."
fi
