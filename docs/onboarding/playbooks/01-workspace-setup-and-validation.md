# Developer Onboarding Playbook

## 1. Workspace Setup & Initialization

Follow these steps to initialize your local workspace and start the multi-tenant development sandbox:

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
   **Note:** This script automatically creates `.data/seeds/default-tenant.json` idempotently and mounts isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) dynamically via `NEXT_DIST_DIR`.

## 2. Testing Workflows

The repository uses the native `node:test` runner.

1. **Execute All Tests:**
   Run the following command to execute all relevant tests.
   ```bash
   pnpm test
   ```
   **Note:** The test execution command uses `--experimental-strip-types` and `--import ./test-runner.mjs` to seamlessly interpret TypeScript and path aliases within the local environment.

## 3. Pull Request Validation Rules

Before creating a Pull Request, ensure that the following requirements are met:

- **Pre-commit Steps:** Always execute unit tests (`pnpm test`) immediately before the pre-commit phase to comply with the Completeness Rule.
- **Architectural Traceability:** Any logic modified must align with `docs/architecture/cross-module-traceability/`.
- **Idempotency:** Any new initialization processes introduced must remain idempotent (e.g. check for existing seeds before creating).