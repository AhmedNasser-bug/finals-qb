# Automated Onboarding Step-Instruction Playbook

Welcome to the project! This playbook outlines the standard workflow and execution protocols to spin up your local workspace, validate your code, and submit conforming pull requests.

## 1. Workspace Initialization

Before running any development servers, you must execute the automated sandbox orchestrator to ensure all multi-tenant databases and configuration files are properly seeded.

**Execution Command:**
```bash
./scripts/bootstrap.sh
```

**What this does:**
- Validates Node.js and package manager constraints (enforcing `pnpm`).
- Idempotently installs dependencies via `pnpm install`.
- Generates required `.env.local` templates.
- Seeds local `.data/seeds/` directories.
- Optionally spins up background Docker Compose containers if the `--multi-tenant` flag is supplied.

## 2. Local Testing Framework

We use Node's native test runner. All unit and integration tests must pass before submitting code. The project requires strict coverage on core domain logic.

**Execution Command:**
```bash
pnpm test
```

**What this does:**
- Executes all `.test.ts` and `.test.tsx` files located within the `lib/` directory using `--experimental-strip-types`.
- Validates persistence logic, achievement engine rules, telemetry routing, and utility scripts without requiring a full Next.js build.

## 3. Pull Request Validation Rules

To ensure system stability, all pull requests must comply with the following structural and testing guidelines.

- **Mandatory Pre-Commit Checks:** You must ensure `pnpm test` runs with zero failures before committing.
- **Strict Package Management:** Exclusively use **`pnpm`**. Never use `npm` or `yarn` (this is enforced via `preinstall` hooks).
- **Process Hygiene:** Ensure any trailing dev server processes (e.g., port 3000) or test loops are aggressively killed to prevent CPU/memory exhaustion.
- **Architectural Transparency:** Any new layout structures or domain integrations should be mapped within `docs/architecture/cross-module-traceability.md`.
- **Validation Auto-Fix Decoupling:** Any data recovery scripts added to importers must be entirely decoupled from the core schema validation checks to preserve test integrity.
