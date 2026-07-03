# Workspace Setup

Welcome to the finals-qb project.

## Initialization Commands

We use **pnpm** as our package manager. Do not use npm or yarn.

1. Install dependencies idempotently:
   ```bash
   pnpm install
   ```
2. Setup environment variables by copying the example file:
   ```bash
   cp .env.example .env.local
   ```
3. Initialize the development sandbox (which seeds mock data and handles docker instantiation if needed):
   ```bash
   ./scripts/setup/setup.sh
   # Or for multi-tenant background docker mode:
   ./scripts/setup/setup.sh --multi-tenant
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

**Important**: If you run into ERESOLVE errors regarding React 19, ensure you are strictly using `pnpm`.
