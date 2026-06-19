# Developer Onboarding Playbook

Welcome to the **MOLD V2 Workspace**! This step-by-step playbook outlines the essential initialization commands, testing workflows, and PR validation rules required to begin contributing to the project effectively.

## Initialization Commands

To get your local workspace running, execute the following steps:

1. **Bootstrap the Workspace:**
   Run the setup script to install dependencies, configure environment variables, and orchestrate the multi-tenant sandbox environment dynamically based on `docker-compose.yml`.
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```

2. **Start the Development Server:**
   Launch the Next.js development server locally.
   ```bash
   pnpm dev
   ```

## Testing Workflows

Our testing approach utilizes the native Node.js test runner for speed and modern syntax support.

1. **Run the Test Suite:**
   Execute all unit and integration tests configured in the project.
   ```bash
   pnpm test
   ```

2. **Linting:**
   Ensure code meets the required stylistic and functional guidelines.
   ```bash
   pnpm lint
   ```

3. **Frontend Build Verification:**
   Verify that the UI builds successfully without Turbopack or TypeScript errors.
   ```bash
   pnpm build
   ```

## PR Validation Rules

Before submitting a Pull Request (PR), ensure the following validation rules are strictly met:

- **Pass All Tests:**
  The command `pnpm test` must run successfully with no failing suites.
- **Linting Conformance:**
  The codebase must pass `pnpm lint`. (Note: Ensure the project linting setup is configured correctly).
- **Successful Builds:**
  The `pnpm build` command must complete without errors.
- **Component Documentation:**
  Run the architecture generation script (`node scripts/generate-component-registry.js`) if any components were modified or added, and commit the updated `docs/architecture/component-registry.md`.
- **Clean Workspace:**
  Do not commit temporary agent workspaces, scripts, or exploratory files (e.g., `scratch/` directory contents). Use `git rm -rf scratch/` or `git restore --staged` to avoid polluting the patch repository.
- **Lockfile Integrity:**
  Ensure environment mismatches haven't unintentionally modified the `pnpm-lock.yaml` file; exclude these changes using `git restore --staged pnpm-lock.yaml` if needed.
