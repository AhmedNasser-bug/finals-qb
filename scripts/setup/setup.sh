#!/usr/bin/env bash
set -eo pipefail

echo "=========================================="
echo " MOLD V2 Sandbox Bootstrap Orchestration"
echo "=========================================="

# Execute all routines in order
for routine in scripts/setup/routines/*.sh; do
    if [ -f "$routine" ]; then
        bash "$routine" "$@"
    fi
done

echo "=> Environment bootstrap complete."
echo "You can now run 'pnpm dev' to start the local development server."
