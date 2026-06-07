# Developer Onboarding Playbook

## **Initialization Commands**
- Run `pnpm install` to install dependencies.
- Run `./scripts/setup/setup.sh --multi-tenant` to bootstrap the local environment and mock database.

## **Testing Workflows**
- We use Node's native test runner (`node:test`, `node:assert/strict`).
- Run `node --experimental-strip-types --import ./test-runner.mjs --test <file>` to run a specific test file.
- Run `pnpm test` to run the full test suite.

## **PR Validation Rules**
- Ensure all tests pass using `pnpm test` before pushing to PR.
- No unresolved regressions allowed.
- Automated code reviewer requires specific, exact string formatting for plans and commits.