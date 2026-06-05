# Developer Onboarding Playbook

**Welcome!** This manual provides a step-by-step developer playbook outlining initialization commands, testing workflows, and PR validation rules.

## 1. Workspace Setup & Initialization

**Follow these steps to initialize your local workspace and start the multi-tenant development sandbox:**

### Step 1: Enable Corepack
**Enable the Package Manager:** Run the following command to enable `pnpm` safely using Corepack. This is essential because we enforce strict dependency resolution.
```bash
corepack enable pnpm
```

### Step 2: Bootstrap Containers
**Bootstrap the Environment:** Run the idempotent setup script to seed mock data and spin up Docker containers for multi-tenant setups via Docker Compose.
```bash
./scripts/setup/setup.sh --multi-tenant
```
**Note:** This script automatically creates `.data/seeds/default-tenant.json` idempotently and mounts isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) dynamically via `NEXT_DIST_DIR`.

## 2. Testing Workflows

**The repository strictly utilizes the native `node:test` runner. Do not introduce Jest or Vitest.**

### Step 1: Execute Native Node Tests
**Run Unit Tests:** Execute the following command to run all relevant suite tests.
```bash
pnpm test
```
**Note:** The command utilizes `--experimental-strip-types` and `--import ./test-runner.mjs` to correctly map path aliases and resolve TypeScript syntax.

### Step 2: Visual Frontend Verification
**Start the Dev Server:** To verify frontend changes, spin up the local server and manually inspect the interactive components via browser.
```bash
pnpm dev
```

## 3. Pull Request Validation Rules

**Before creating a Pull Request, strictly ensure the following:**

- **Complete Test Coverage:** **Ensure `pnpm test` passes completely.** Always execute tests before committing to avoid regressions and adhere to the Completeness Rule.
- **Architectural Boundaries Check:** **Validate modularity.** Changes to monolithic UI files must explicitly isolate nested elements and utilize strongly typed interfaces. Follow the granular definitions within `docs/architecture/cross-module-traceability/`.
- **Performance Constraints:** **Avoid unbounded allocations.** Any O(N) or nested looping mechanisms must not allocate unbounded memory. Use streaming or chunking for binary/data manipulations.
- **Idempotency Verification:** **Scripts must run safely multiple times.** Any new initialization processes or setup scripts introduced must remain fully idempotent (e.g., verify existence of seeds before seeding).
- **Explicit Step Verification:** **Document your work.** Include pre-commit steps to demonstrate that testing, review, verification, and reflections were properly completed prior to submission.
