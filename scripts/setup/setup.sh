#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$DIR/../.." && pwd)"

cd "$PROJECT_ROOT" || exit 1

echo "Starting idempotent orchestration..."

bash "$DIR/01-dependencies.sh"
bash "$DIR/02-environment.sh"
bash "$DIR/03-seeding.sh"
bash "$DIR/04-docker.sh" "$1"
