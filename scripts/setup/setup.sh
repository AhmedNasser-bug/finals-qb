#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

source ./scripts/setup/routines/01-dependencies.sh
source ./scripts/setup/routines/02-env-setup.sh
source ./scripts/setup/routines/03-seeding.sh
source ./scripts/setup/routines/04-docker.sh "$1"
