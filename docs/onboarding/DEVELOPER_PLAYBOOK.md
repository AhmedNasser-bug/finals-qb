# Developer Onboarding Playbook

Welcome to the MOLD V2 development environment! This playbook outlines the standard procedures for setting up your sandbox, running tests, and validating your pull requests.

## 1. Environment Initialization
Our bootstrap orchestration uses idempotent scripts to prepare your environment.

### Standard Setup
Run the master setup script to install dependencies, configure environment variables, and seed mock data:
```bash
bash scripts/setup/setup.sh
```

### Multi-Tenant Sandbox
To spin up a simulated multi-tenant backend architecture via Docker Compose:
```bash
bash scripts/setup/setup.sh --multi-tenant
```
This command ensures local volume mount directories (e.g., `.next-tenant-a`) are dynamically created if missing, and orchestrates the localized Docker services.

## 2. Development Workflow

### Starting the Local Server
We use `pnpm` exclusively. To start the Next.js development server:
```bash
pnpm dev
```
*Note: Do not use `npm install` or `yarn`.*

### Testing
We utilize the native `node:test` runner.
```bash
pnpm test
```
If you encounter `MODULE_NOT_FOUND` errors, ensure dependencies are synchronized by running `pnpm install` first.

### Static Analysis
Since `pnpm lint` may fail due to specific project directory constraints, we rely on TypeScript for static validation:
```bash
pnpm exec tsc --noEmit
```

## 3. Pull Request Validation Rules
Before submitting a PR, ensure the following constraints are met:

1. **Testing**: Run the full test suite (`pnpm test`) and ensure all tests pass.
2. **Type Checking**: Run `pnpm exec tsc --noEmit` to verify type safety. Do not use `any` casting on critical data contracts.
3. **Logging Standards**: All `console.log` or `console.error` calls must be replaced with the centralized logger (`import { logger } from "@/lib/logger"`).
4. **Component Isolation**: Next.js Server Components must remain pristine. Extract standard React Contexts to isolated `"use client"` provider files (e.g., `app/providers.tsx`), except for specialized wrappers like `ClerkProvider`.
5. **Documentation**: If implementing new UX features, append a summary to `.Jules/ux-registry.json`.

Follow these guidelines meticulously to maintain system integrity across architectural layers.
