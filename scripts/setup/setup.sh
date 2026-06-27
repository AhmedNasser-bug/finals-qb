#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

bash "$SCRIPT_DIR/routines/01-dependencies.sh"
bash "$SCRIPT_DIR/routines/02-env.sh"
bash "$SCRIPT_DIR/routines/03-seed.sh"
bash "$SCRIPT_DIR/routines/04-docker.sh" "$1"

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
