# MOLD V2 Developer Onboarding Playbook

Welcome to the MOLD V2 engineering team. This playbook outlines the initialization commands, testing workflows, and Pull Request (PR) validation rules you need to know.

## 1. **Initialization Commands**

MOLD V2 uses a multi-tenant local sandbox environment. Follow these steps to get your environment running.

### **Install Dependencies**
The project strictly uses **pnpm** as its package manager.
```bash
# Verify pnpm is installed, or enable via corepack
corepack enable pnpm

# Install all dependencies
pnpm install
```

### **Start Multi-Tenant Dev Environment**
Run the orchestration setup script to provision isolated Next.js directories via Docker.
```bash
bash scripts/setup/setup.sh --multi-tenant
```
*Note: This spins up `tenant-a` on port 3001 and `tenant-b` on port 3002.*

If you only need a local, single-tenant environment, simply use:
```bash
pnpm dev
```

## 2. **Testing Workflows**

MOLD V2 relies on the native Node.js test runner (`node:test`, `node:assert`). There is no Jest, Vitest, Cypress, or Playwright for standard unit/integration testing.

### **Run All Tests**
Always ensure all tests pass before opening a PR.
```bash
pnpm test
```
The command automatically maps to `node --experimental-strip-types --import ./test-runner.mjs --test [paths...]`.

## 3. **PR Validation Rules**

Before submitting code, ensure your changes adhere to the following rules:

### **Type Safety & Linting**
Run the TypeScript compiler to ensure there are no build errors. Next.js ignores build errors in production to optimize speed, so you **must** catch them locally.
```bash
pnpm lint
```

### **Commit Requirements**
Ensure you have completed all tests and linting before your final commit.
1. Run `pnpm test` and ensure a 100% pass rate.
2. Run `pnpm lint` and resolve any TypeScript issues (`TS2304`, `TS17001`, etc.).
3. Verify that your UI changes adhere to the `--primary`, `--background`, and other design tokens. **No raw tailwind colors.**
4. If your changes affect the `.next` compilation output, clear the cache (`rm -rf .next`) before rebuilding.
