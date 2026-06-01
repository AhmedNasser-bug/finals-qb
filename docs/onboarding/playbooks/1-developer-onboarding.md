# Developer Onboarding Playbook

## 1. Initialization Commands
To configure your workspace:
- Run **`./scripts/setup/setup.sh`** for standard setup
- Run **`./scripts/setup/setup.sh --multi-tenant`** to spin up isolated multi-tenant containers via Docker Compose. This automates dependency installation via `pnpm`, seeds `.data/seeds/default-tenant.json` idempotently, and starts Next.js via Turbopack for each tenant.

## 2. Testing Workflows
To execute the tests:
- Run **`pnpm test`**. This uses the native Node test runner. Ensure you run this script instead of `pnpm lint` or `tsc` directly, which may throw false positive warnings or fail due to project configuration.
- To test the frontend visually, run the dev server via **`pnpm dev`** and inspect interactive components.

## 3. PR Validation Rules
Before submitting a PR:
- **Test everything**: Ensure **`pnpm test`** passes cleanly without regressions.
- **Architectural boundaries**: Changes to monolithic UI files should isolate nested elements and use explicit interfaces.
- **Performance constraints**: Any O(N) or looping mechanisms must not allocate unbounded memory (use streaming or chunking for data transformations).
- **Verification**: Document changes via pre-commit steps ensuring testing, review, verification, and reflection are done.
