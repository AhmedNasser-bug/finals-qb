# Developer Playbook

## **Workspace Initialization**
1. Run `pnpm install` to install dependencies.
2. Run `bash scripts/setup/setup.sh` to bootstrap the environment and seed databases.
3. Run `pnpm dev` to start the Next.js development server.

## **Testing Workflows**
- **Unit Tests:** Execute `pnpm test` to run the test suite.
- **Linting:** Execute `pnpm lint` to ensure code quality.
- **Verification:** Run `python <script_path>` (if applicable) for visual checks.

## **PR Validation Rules**
- Ensure all tests pass (`pnpm test`).
- Ensure no type errors or linter errors exist.
- Verify that there are no regressions across environments.
- Format the PR following conventional standards.
