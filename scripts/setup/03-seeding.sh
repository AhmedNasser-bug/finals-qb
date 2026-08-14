#!/usr/bin/env bash
set -eo pipefail

echo "=> Seeding mock data / workspace prep..."
# Ensure docs directory exists
mkdir -p docs

# Create a mock database seed structure as per orchestration requirements
mkdir -p .data/seeds
if [ ! -f .data/seeds/default-tenant.json ]; then
cat << 'EOF3' > .data/seeds/default-tenant.json
{
  "tenants": ["tenant-a", "tenant-b"],
  "initializedAt": "2023-10-01T12:00:00Z"
}
EOF3
echo "Mock database seeded."
else
    echo "Mock database already seeded."
fi
