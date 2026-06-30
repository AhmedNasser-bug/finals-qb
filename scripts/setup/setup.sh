#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

# Source modularized setup routines
source scripts/setup/routines/01-dependencies.sh
source scripts/setup/routines/02-env.sh
source scripts/setup/routines/03-seed.sh
source scripts/setup/routines/04-docker.sh "$1"

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
