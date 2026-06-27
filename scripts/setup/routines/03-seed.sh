#!/usr/bin/env bash
set -eo pipefail

echo "=> Seeding mock data / workspace prep..."
mkdir -p docs
mkdir -p .data/seeds
if [ ! -f .data/seeds/default-tenant.json ]; then
cat <<EOF3 > .data/seeds/default-tenant.json
{
  "tenants": ["tenant-a", "tenant-b"],
  "initializedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF3
echo "Mock database seeded."
else
    echo "Mock database already seeded."
fi
