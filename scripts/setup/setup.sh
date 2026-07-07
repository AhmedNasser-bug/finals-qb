#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

"$DIR/01-check-deps.sh"
"$DIR/02-env-setup.sh"
"$DIR/03-seed-data.sh"
"$DIR/04-start-sandbox.sh" "$1"

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
