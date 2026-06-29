#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

"$DIR/routines/01-dependencies.sh"
"$DIR/routines/02-env.sh"
"$DIR/routines/03-seeding.sh"
"$DIR/routines/04-sandbox.sh" "$@"

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
