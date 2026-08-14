#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

bash "$DIR/01-dependencies.sh" || { echo "Dependencies setup failed"; exit 1; }
bash "$DIR/02-environment.sh" || { echo "Environment setup failed"; exit 1; }
bash "$DIR/03-seeding.sh" || { echo "Seeding setup failed"; exit 1; }
bash "$DIR/04-docker.sh" "$1" || { echo "Docker setup failed"; exit 1; }
