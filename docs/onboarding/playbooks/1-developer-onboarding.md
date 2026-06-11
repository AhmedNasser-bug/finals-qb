# Automated Onboarding Step-Instruction Playbook

**Welcome to the MOLD V2 multi-tenant developer environment.** This playbook provides a comprehensive, step-by-step guide detailing the initialization commands, localized testing frameworks, and strict validation rules required to successfully contribute to this repository.

## 1. Workspace Setup & Initialization

**Follow these instructions precisely to initialize your local workspace and orchestrate the multi-tenant development sandbox.**

1. **Enable Package Manager:**
   We enforce `pnpm` for deterministic dependencies. Enable it safely using Node's Corepack:
   ```bash
   corepack enable pnpm
   ```

2. **Install Workspace Dependencies:**
   Ensure all localized toolchains and peer dependencies are installed idempotently:
   ```bash
   pnpm install
   ```

3. **Bootstrap the Multi-Tenant Environment:**
   Run the overarching orchestration setup script to seed mock data and spin up Docker containers for the `tenant-a` and `tenant-b` configurations:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```
   **Important Note:** This automation explicitly relies on idempotent sub-scripts (`seed-tenant.sh` and `start-sandbox.sh`). It dynamically maps persistent volumes and distinct `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) to isolate tenant environments.

## 2. Localized Testing Workflows

**This project explicitly leverages the native Node.js test runner (`node:test`). Do not introduce Jest or Vitest dependencies.**

1. **Execute the Universal Test Suite:**
   To validate all backend services, cross-module layers, and utility components, execute the native runner command:
   ```bash
   pnpm test
   ```
   **Context:** This command leverages the native `node:test` suite utilizing `--experimental-strip-types` alongside a specialized loader (`--import ./test-runner.mjs`) to cleanly interpret TypeScript and path aliases within the localized context.

2. **Frontend Visual Verification:**
   Launch the development server to manually inspect interactive DOM components or prepare for Playwright assertion scripts:
   ```bash
   pnpm dev
   ```

## 3. Strict Pull Request Validation Rules

**Before initiating any Pull Request or submitting changes, ensure your codebase modifications strictly adhere to the following architectural and execution constraints:**

- **Complete Test Coverage:** Execute **`pnpm test`** ensuring a 100% pass rate. Execute all related test blocks immediately preceding the pre-commit reflection phase to adhere to the core Completeness Rule.
- **Architectural Boundary Adherence:** Any monolithic UI refactors must successfully isolate nested logic into dedicated components featuring highly specific, typed interfaces. Ensure cross-module operations align with the guidelines defined in `docs/architecture/cross-module-traceability/traceability-manual.md`.
- **Runtime Performance Guidelines:** Any newly authored recursive or looping structures (O(N) operations) must avoid massive array concatenations. Utilize chunking, native buffers, or `Set` lookups where memory overhead could scale.
- **Enforced Idempotency:** Any newly created bash automation or initialization script must remain fully idempotent (e.g., checking for existence before directory or file generation).
- **Commit Verification:** Thoroughly document code changes directly within pre-commit steps, ensuring functional verification (e.g., executing structural Playwright scripts) alongside a thorough architectural review and final reflection.
