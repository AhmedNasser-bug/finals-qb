# Workflow: Multi-Tenant Sandbox Provisioning

An orchestration workflow to spin up and validate a multi-tenant developer sandbox environment using Docker Compose and initialization scripts.

---

## 1. Prerequisites & Dependencies
- Docker and Docker Compose installed.
- Corepack enabled (`corepack enable pnpm`).

---

## 2. Execution Protocol

### Step 1: Execute Setup Script
- **Action**: Run the setup script with the multi-tenant flag to seed mock data and build containers.
  ```bash
  ./scripts/setup/setup.sh --multi-tenant
  ```
- **Verification Goal**: Docker compose builds without errors and containers are running (`docker ps`).

### Step 2: Validate Isolation Rules
- **Action**: Verify that `next.config.mjs` correctly handles `process.env.NEXT_DIST_DIR || '.next'` to prevent `.next` directory cache collisions among shared volumes.

### Step 3: Troubleshoot Build Issues
- **Action**: If Turbopack fails with `NftJsonAsset: cannot handle filepath node:worker_threads`, confirm it is a known warning and bypass if tests pass. If `pnpm install` fails on `sharp`, execute: `pnpm config set ignore-scripts true && pnpm install`.

---

## 3. Reference Materials
- [Multi Tenant Isolation](../../.Jules/multi_tenant.md)
