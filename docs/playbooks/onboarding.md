# Automated Onboarding Step-Instruction Playbooks

## Overview
This document provides a step-by-step developer playbook outlining initialization commands, testing workflows, and PR validation rules for the MOLD V2 repository.

## 1. Environment Initialization

To instantly spin up your local development environment, including multi-tenant sandboxes, use the provided orchestration scripts.

**1. Clone the repository**
```bash
git clone <repository-url>
cd <repository-directory>
```

**2. Execute the orchestration script**
This idempotent script installs dependencies, sets up environments, seeds mock data, and provisions Docker containers.
```bash
bash scripts/setup/setup.sh --multi-tenant
```
*Note: The project strictly requires **pnpm**. Do not use npm or yarn.*

**3. Start the Development Server**
Once bootstrap is complete, launch the Next.js server.
```bash
pnpm dev
```

## 2. Testing Workflows

The project maintains a rigorous testing standard. All features must pass the unified test suite before submission.

**1. Run the Unified Test Suite**
This command executes all unit and integration tests across the codebase.
```bash
pnpm test
```

**2. Expected Outcome**
Ensure zero failures. The standard target is typically 132/132 tests passing.

**3. Accessibility Audits**
Use the provided agent workflow for accessibility verification:
Review guidelines in `.Jules/accessibility.md` and `.agent/workflows/a11y_audit.md`.

## 3. Pull Request Validation Rules

Before submitting a Pull Request, ensure compliance with the following architectural constraints:

- **Package Manager**: Exclusively use `pnpm`. `pnpm-lock.yaml` is the canonical lockfile.
- **Idempotency**: All scripts and automations must be idempotent (safe to run multiple times).
- **Strict Linting & Building**: Ensure the project compiles cleanly.
  ```bash
  pnpm lint && pnpm build
  ```
- **Pre-Commit Verification**: Run `pnpm test` and `pnpm lint` immediately prior to commit.
- **Documentation Sync**: If architectural changes are made, run the Self-Annealing workflow (`.agent/workflows/self_annealing.md`) to update `AGENTS.md`.

## 4. Multi-Tenant Sandbox Details

The orchestration script (`setup.sh --multi-tenant`) provisions two isolated environments via Docker Compose:
- **Tenant A**: Port 3001, isolated output directory (`.next-tenant-a`).
- **Tenant B**: Port 3002, isolated output directory (`.next-tenant-b`).

This ensures isolated builds and prevents cross-tenant state collisions during development.
