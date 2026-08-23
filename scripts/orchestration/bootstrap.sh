#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

bash "$DIR/modules/01-check-deps.sh"
bash "$DIR/modules/02-setup-env.sh"
bash "$DIR/modules/03-seed-data.sh"
bash "$DIR/modules/04-start-docker.sh" "$1"
