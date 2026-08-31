# Developer Onboarding Playbook

This step-by-step playbook outlines initialization commands, testing workflows, and PR validation rules for the MOLD V2 workspace.

## **1. Workspace Initialization**

To initialize your local multi-tenant sandbox environment, run the idempotent bootstrap orchestration script.

**Command:**
```bash
bash scripts/orchestration/bootstrap.sh
```

**What it does:**
- Enables `pnpm` via corepack.
- Installs dependencies (`pnpm install`).
- Sets up `.env.local` if missing.
- Runs database seeds (creates `.data/seeds/default-tenant.json`).
- Spins up local Docker Compose tenants (`tenant-a` and `tenant-b`).

## **2. Testing Workflows**

Before submitting any changes, you must ensure that all localized testing frameworks pass successfully.

**Run the Test Suite:**
```bash
pnpm test
```

**Run Linter:**
```bash
pnpm lint
```

**Start Local Dev Server (Outside Docker):**
```bash
pnpm dev
```

## **3. PR Validation Rules**

When submitting a Pull Request, strictly adhere to the following constraints based on repository rules:

### **General Rules**
- **Test Coverage:** All tests must pass (`pnpm test`). Node warnings about `[MODULE_TYPELESS_PACKAGE_JSON]` can be ignored.
- **Pre-Commit:** You must complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

### **Role-Specific PR Formats**
- **Performance ('Bolt') Agents:**
  - Must use strict PR Title: `⚡ Bolt: [performance improvement]`
  - Description must strictly contain sections: `💡 What:`, `🎯 Why:`, `📊 Impact:`, and `🔬 Measurement:`.
- **UX ('Palette-UX') Agents:**
  - Must be committed to a unique branch formatted as `jules-ux-<category>-<hash>`.
  - UX additions must be non-breaking and backwards-compatible.
