# Developer Onboarding Playbook

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
   **Note:** This script automatically creates `.data/seeds/default-tenant.json` idempotently and mounts isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) dynamically via `NEXT_DIST_DIR`.

## 2. Testing Workflows

**The repository uses the native `node:test` runner.**

1. **Execute All Tests:**
   Run the following command to execute all relevant tests.
   ```bash
   pnpm test
   ```
   **Note:** The test execution command uses `--experimental-strip-types` and `--import ./test-runner.mjs` to seamlessly interpret TypeScript and path aliases within the local environment. Do not use Jest or Vitest.

2. **Visual Verification:**
   To test the frontend visually, run the dev server and inspect interactive components.
   ```bash
   pnpm dev
   ```

## 3. Pull Request Validation Rules

**Before creating a Pull Request, ensure that the following requirements are met:**

- **Test everything:** Ensure **`pnpm test`** passes cleanly with 100% success rate. Always execute unit tests immediately before the pre-commit phase to comply with the Completeness Rule.
- **Architectural boundaries:** Changes to monolithic UI files should isolate nested elements and use explicit interfaces. Any logic modified must align with granular documents in `docs/architecture/cross-module-traceability/`.
- **Performance constraints:** Any O(N) or looping mechanisms must not allocate unbounded memory (use streaming or chunking for data transformations).
- **Idempotency:** Any new initialization processes introduced must remain idempotent (e.g. check for existing seeds before creating).
- **Verification:** Document changes via pre-commit steps ensuring testing (e.g. Playwright scripts or manual inspection), review, verification, and reflection are done.