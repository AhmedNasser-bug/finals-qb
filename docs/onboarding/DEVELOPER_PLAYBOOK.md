# Developer Onboarding Playbook

Welcome to the development environment! Follow these instructions to initialize your workspace, run local multi-tenant testing environments, and validate your code before pushing.

## 1. Initialization Commands

To set up the workspace for local development:

**Execute the central bootstrap script:**
```bash
./scripts/setup/setup.sh
```
This script handles dependency installation (`pnpm`), environment variables setup (`.env.local`), and initial data seeding.

## 2. Multi-Tenant Sandbox Orchestration

If you need to spin up the local multi-tenant developer sandbox concurrently:

**Run the multi-tenant setup flag:**
```bash
./scripts/setup/setup.sh --multi-tenant
```
This will automatically spin up isolated Next.js sandboxing instances via Docker Compose (e.g., `tenant-a` and `tenant-b`).
*Note: Make sure your Docker daemon is active before running this step.*

## 3. Testing Workflows

Our testing framework uses the native `node:test` runner. **Do not** use Jest or Vitest.

**To run the test suite:**
```bash
pnpm test
```
*Note: If tests fail due to missing dependencies, run `pnpm install` prior to running tests.*

## 4. PR Validation Rules

Before requesting code review or submitting your pull request, ensure the following steps have been completed:
- **Clean Workspace**: Ensure any temporary scratchpad scripts created during exploration or refactoring are deleted from the working directory.
- **Run Tests**: Always execute `pnpm test` successfully immediately before the pre-commit step.
- **Verification checks**: Ensure UI components respect Tailwind semantic tokens rather than raw color classes, and run all programmatic checks in applicable `AGENTS.md` files.
