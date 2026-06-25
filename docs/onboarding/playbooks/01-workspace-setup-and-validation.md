# Workspace Setup and Validation Playbook

Welcome to the MOLD V2 project! This playbook outlines the steps required to initialize your local development workspace, execute the testing workflows, and validate your code before submitting a Pull Request.

## **1. Workspace Initialization**

To configure the local development environment and start the Next.js multi-tenant sandbox containers, run the setup script:

```bash
./scripts/setup/setup.sh --multi-tenant
```

This will automatically:
- Install dependencies using `pnpm` (which is the exclusively allowed package manager).
- Generate `.env.local` configuration.
- Seed the per-tenant mock databases.
- Start the multi-tenant Docker services (`tenant-a`, `tenant-b`).

To start the local Next.js development server outside of the containers, run:

```bash
pnpm dev
```

## **2. Testing Workflows**

This repository uses the native Node.js test runner for its automated test suite.

To verify structural and functional integrity before committing changes, execute:

```bash
pnpm test
```

For build verifications, run:

```bash
pnpm build
```
*(Note: If `pnpm build` fails with 'next: not found', ensure you have run `pnpm install` first.)*

## **3. PR Validation Rules**

Before creating a Pull Request, ensure the following validations are complete:

- **Linting:** Run `pnpm lint` to check for style violations.
- **Testing:** Run `pnpm test` and ensure all tests pass.
- **Visual Verification:** Manually verify that UI changes function correctly.
- **Environment Parity:** Verify that you have not unintentionally modified `package.json` and `pnpm-lock.yaml` unless explicitly required.
