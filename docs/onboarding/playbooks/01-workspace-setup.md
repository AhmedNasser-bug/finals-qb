# Developer Onboarding Playbook

## 1. Workspace Setup & Initialization

Follow these steps to initialize your local workspace and start the multi-tenant development sandbox:

We have consolidated the setup into a simple, idempotent bootstrap script. This project **strictly requires `pnpm`**.

1. **Enable Package Manager:**
   Run the following command to enable `pnpm` safely using Corepack:
   ```bash
   corepack enable pnpm
   ```

2. **Bootstrap the Environment:**
   Run the idempotent setup script to seed mock data and spin up Docker containers for multi-tenant setups:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```
   *(This will verify your `pnpm` installation, install dependencies, prepare the local environment instantly, and automatically create `.data/seeds/default-tenant.json` idempotently while mounting isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) dynamically via `NEXT_DIST_DIR`.)*

3. **Start Local Development Server:**
   ```bash
   pnpm dev
   ```
4. Access the sandbox locally at `http://localhost:3000`.