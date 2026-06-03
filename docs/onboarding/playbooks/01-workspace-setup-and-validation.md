# Developer Onboarding Playbook

## **1. Workspace Setup & Initialization**
To configure your workspace, execute the multi-tenant sandbox orchestration script:
- Run **`./scripts/setup/setup.sh --multi-tenant`** to spin up isolated multi-tenant containers via Docker Compose.
- This automates dependency installation via `pnpm`, seeds `.data/seeds/default-tenant.json` idempotently, and starts Next.js for each tenant.

## **2. Testing Workflows**
The repository uses the native `node:test` runner.
- Run **`pnpm test`** to execute all relevant localized unit tests.
- This uses `--experimental-strip-types` to seamlessly interpret TypeScript. Do not use Jest or Vitest.
- For frontend visual testing, run the dev server via **`pnpm dev`** and visually verify components.

## **3. PR Validation Rules**
Before submitting a PR, ensure that the following requirements are met:
- **Test Coverage:** All logic changes must be covered, and **`pnpm test`** must yield a 100% success rate.
- **Pre-commit Steps:** Execute unit tests and perform visual verification of any UI changes prior to the pre-commit phase using Playwright scripts.
- **Architectural Traceability:** Any logic modified must align with granular documents in `docs/architecture/cross-module-traceability/`.
