# Developer Playbook

## 1. Initialization Commands
**Prerequisites:** Ensure `node` and `pnpm` are installed.

To instantly spin up your local multi-tenant development sandbox, use the orchestrated setup script:
**`bash scripts/setup/setup.sh --multi-tenant`**

This script is idempotent and handles:
- **Dependency Installation:** `pnpm install`
- **Environment Bootstrapping:** `.env.local` creation
- **Seeding Mock Data:** Local mock DB structures
- **Docker Compose Spin-up:** Boots `tenant-a` and `tenant-b` concurrently.

For single-tenant local development, run:
**`pnpm dev`**

## 2. Testing Workflows
The project utilizes the native `node:test` runner.

Run the full test suite with:
**`pnpm test`**

Static analysis and types can be verified with:
**`pnpm exec tsc --noEmit`**

## 3. PR Validation Rules
- **Formatting:** Ensure code complies with repository standards. No auto-formatters run automatically, so manually verify changes.
- **Test Coverage:** All changes must be backed by tests; `pnpm test` must pass cleanly.
- **Pre-Commit Checks:** Ensure zero errors or regressions.
- **Branching Strategy:** Use descriptive branch names with short, conventional commit messages.
