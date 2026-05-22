# Automated Onboarding Step-Instruction Playbook

**Welcome to MOLD V2!** This playbook provides a step-by-step guide to initializing your local workspace, running localized testing workflows, and understanding PR validation rules.

## Workspace Initialization

**Step 1: Prerequisites Check**
Ensure you have Node.js and `pnpm` installed. The project strictly mandates the use of `pnpm` as the package manager.
**Do not use `npm` or `yarn`.**

**Step 2: Run Bootstrap Orchestration**
Execute the idempotent setup script to instantly spin up your local development environment.
```bash
./setup.sh
```
This script will automatically:
- Verify dependency binaries (`pnpm`, `node`)
- Install all necessary Next.js dependencies
- Set up local environment variables (`.env.local`)
- Seed any required mock data or directories

**Step 3: Start the Development Server**
Launch the local Turbopack development server.
```bash
pnpm dev
```
Navigate to `http://localhost:3000` to view the application.

## Localized Testing Workflows

The application utilizes the built-in Node.js test runner (`node:test`). Tests are configured to automatically strip TypeScript types (`--experimental-strip-types`) and map `@/` aliases to the repository root via a custom module resolution hook defined in `test-runner.mjs`. Because of `--experimental-strip-types`, automated tests are generally restricted to `.ts` logic files, and cannot test `.tsx` components directly.

**Running the Test Suite**
To execute all test files across the repository, avoiding the `node_modules` directory:
```bash
pnpm test
```
This command natively executes `node --experimental-strip-types --import ./test-runner.mjs --test $(find . -name '*.test.ts' -not -path '*/node_modules/*')`.

## Pull Request Validation Rules

Before submitting a Pull Request, you must ensure all local checks pass.

**1. Code Quality and Linting**
While `next lint` is defined, be aware of configuration issues. Always aim to write clean, type-safe TypeScript. Use `.ts` for generic logic files and `.tsx` for React components.

**2. Automated Testing**
All tests must pass. Ensure `pnpm test` executes cleanly without `ERR_MODULE_NOT_FOUND` errors. For testing source files with path aliases (`@/lib`), ensure relative paths or the custom loader in `test-runner.mjs` are utilized properly.

**3. Accessibility Guidelines**
- Ensure complex interactive elements use keyboard handlers (`Enter`, `Space`) with `role="button"` and `tabIndex={0}` instead of nested buttons.
- Confirm dynamic feedback (e.g., success toasts) utilizes `aria-live="polite"`.
- Use `aria-pressed` for toggle states and `aria-hidden="true"` on redundant icons.
- Ensure `focus-visible` states are clearly defined for all interactive elements.

**4. Performance Benchmarks**
For isolated optimizations (e.g., array iterations), provide a custom benchmark script using `performance.now()` attached to the PR to validate improvements.

**5. PR Submission**
Ensure your Git branch is named descriptively. The commit message should have a concise subject line (max 50 chars), followed by a detailed body explaining the changes. Run the pre-commit script or verify checks manually before pushing.
