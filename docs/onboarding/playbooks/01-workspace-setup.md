# Developer Onboarding Playbook: Workspace Setup

## 1. Workspace Setup & Initialization

**Follow these steps to initialize your local workspace and start the multi-tenant development sandbox:**

1. **Enable Package Manager:**
   Run the following command to enable `pnpm` safely using Corepack:
   ```bash
   corepack enable pnpm
   ```

2. **Bootstrap the Environment:**
   Run the idempotent setup script to seed mock data and spin up Docker containers for multi-tenant setups via Docker Compose:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```
   **Note:** This script automatically creates per-tenant mock data files idempotently and mounts isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) dynamically via `NEXT_DIST_DIR`.
