# Workspace Setup

## Initialization Commands

To get started with the MOLD V2 Sandbox Bootstrap Orchestration:

**`bash scripts/setup/setup.sh`** or for multi-tenant **`bash scripts/setup/setup.sh --multi-tenant`**

This will:
1. Check for **`pnpm`** and **Node.js**.
2. Setup local environment variables (**`.env.local`**).
3. Seed mock data idempotently.
4. Prepare the Docker multi-tenant containers (**`tenant-a`** and **`tenant-b`**) if multi-tenant flag is passed.
