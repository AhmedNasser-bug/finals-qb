# Developer Onboarding Playbook

**Welcome to the MOLD V2 project.** This playbook outlines the standard procedures for setting up your local environment, running tests, and preparing pull requests.

## 1. Local Workspace Initialization

To initialize your development environment, you have the option of setting up a multi-tenant sandbox or a default environment.

### Multi-Tenant Sandbox Bootstrap
We use Docker multi-tenant sandbox containers to isolate environments and test features cross-tenant.

**Run the Setup Script:**
```bash
./scripts/setup/setup.sh --multi-tenant
```
This script will:
- Check for Node.js and `pnpm` (attempting to enable it via corepack if missing).
- Install dependencies idempotently.
- Create your local `.env.local` file if it doesn't exist.
- Dynamically generate per-tenant mock data (`.data/seeds/<tenant>.json`) based on the `docker-compose.yml` definitions.
- Start the sandbox containers and automatically map Next.js output directories (e.g., `.next-tenant-a`) via the `NEXT_DIST_DIR` environment variable to prevent cross-tenant build collisions.

### Starting the Development Server
Once setup is complete, you can start your Next.js development server:

```bash
pnpm dev
```
The environment runs on port `3000` by default. To start the Next.js development server explicitly, run `pnpm dev`.

## 2. Testing Workflows

Our testing methodology ensures codebase stability. **Please verify all changes before submission.**

### Running Tests
The project relies on the native Node.js test runner.

**Run the Full Test Suite:**
```bash
pnpm test
```
If you encounter missing module errors (e.g., `clsx`, `tailwind-merge`) when running scripts, you may need to install them:
```bash
pnpm i clsx tailwind-merge
```

### Visual Frontend Verification
UI modifications must be visually verified prior to final pre-commit validation. If explicit testing scripts (e.g., Playwright) are not configured for your specific change, compile the project to confirm there are no frontend build regressions:

**Run a Build:**
```bash
pnpm build
```

## 3. Pull Request Validation Rules

Before finalizing a PR, please adhere to the following rules:

### Code Modifications & Structure
- Extract interfaces accurately when modifying architecture components.
- Run any automated scripts (e.g., `scripts/generate-component-registry.js`) to ensure the cross-module architectural traceability manual and component registry outputting to `docs/architecture/component-registry.md` is up to date.
- Keep dependency files clean. Exclude unintended lockfile modifications (e.g., `pnpm-lock.yaml` bindings mismatch) from commits unless they were intentional.

### Pre-Commit Checklist
Follow these steps **immediately before** your final push or submission step:
1. **Remove Artifacts:** Ensure all temporary workspaces, scripts, or debug assets (e.g., `/home/jules/verification/` contents, custom Node scripts) are deleted and unstaged.
2. **Execute Pre-commit Validations:** Run the required system pre-commit instructions, which check testing, verification, review, and reflection.

*Note: Maintain high-signal PR summaries emphasizing what you changed, why, and the resulting impact.*
