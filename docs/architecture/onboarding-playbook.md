# Automated Onboarding Playbook

Welcome to the project! This playbook outlines the necessary steps to configure your local workspace, initialize the development environment, and validate your changes via the testing framework and PR rules.

## 1. Workspace Initialization
Ensure you have Node.js (v20+) and pnpm (enabled via corepack) installed on your machine.

**Step 1: Install Dependencies**
```bash
pnpm install
```
This project strictly uses `pnpm` for package management. Do not use `npm` or `yarn`.

**Step 2: Initialize the Sandbox Environment**
The project relies on a multi-tenant Docker Compose setup for local development. Run the idempotent bootstrap script to seed the database and spin up the containers:
```bash
bash scripts/orchestration/bootstrap.sh
```

**Step 3: Start the Development Server**
Once the sandbox is running, start the Next.js development server:
```bash
pnpm dev
```

## 2. Testing Workflows
The project uses the native Node.js test runner for unit and integration testing.

**Running the Test Suite**
To verify code correctness and ensure no regressions, run:
```bash
pnpm test
```
This command executes the test suite defined in `package.json` using the configuration provided in `test-runner.mjs`.

## 3. PR Validation Rules
Before submitting a Pull Request, ensure your changes adhere to the following validation rules:

1. **Pass the Test Suite:** All tests must pass locally (`pnpm test`) before pushing your code.
2. **Adhere to the Groundedness Rule:** Ensure your changes actually reflect the code modifications you've made. Do not claim to have added files or fixed bugs that were not explicitly addressed in your commits.
3. **Traceability:** If you modify core business logic or data models in `lib/`, ensure you update the relevant documentation in the `docs/architecture/` directory (e.g., `cross-module-traceability-manual.md`).
4. **Idempotency:** Any new setup or automation scripts must be idempotent (i.e., they can be run multiple times without causing unintended side effects or errors).
