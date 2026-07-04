#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source modular routines
source "$DIR/routines/01-dependencies.sh"
source "$DIR/routines/02-environment.sh"
source "$DIR/routines/03-seed-data.sh"
source "$DIR/routines/04-docker.sh" "$1"

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
