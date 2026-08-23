# Workspace Setup & Initialization

**Follow these steps to initialize your local workspace and start the multi-tenant development sandbox:**

1. **Enable Package Manager:**
   Run the following command to enable `pnpm` safely using Corepack:
   ```bash
   corepack enable pnpm
   ```

2. **Bootstrap the Environment:**
   Run the idempotent setup script to seed mock data and spin up Docker containers for multi-tenant setups via Docker Compose:
   ```bash
   ./scripts/orchestration/bootstrap.sh --multi-tenant
   ```
   **Note:** This script automatically creates `.data/seeds/default-tenant.json` idempotently and mounts isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) dynamically via `NEXT_DIST_DIR`.

3. **Install Dependencies & Launch:**
   Install project dependencies and start the development server using `pnpm` exclusively:
   ```bash
   pnpm install
   pnpm dev
   ```
   **Rule:** Never use `npm` or `yarn`. `pnpm` is the sole canonical package manager for this repository.