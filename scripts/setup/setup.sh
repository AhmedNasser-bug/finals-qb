#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

"$DIR/01-deps.sh"
"$DIR/02-env.sh"
"$DIR/03-seed.sh"
"$DIR/04-docker.sh" "$@"
