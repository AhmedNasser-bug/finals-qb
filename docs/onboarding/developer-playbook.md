# Developer Playbook

## 1. Local Workspace Initialization
To set up the workspace for local development:
**`bash scripts/orchestration/bootstrap.sh`**

This idempotent script will:
- Enable `pnpm`
- Install dependencies
- Spin up multi-tenant Docker containers (`tenant-a` on port 3001, `tenant-b` on port 3002)
- Run the mock database seeds

After initialization, you can start the development server using:
**`pnpm dev`**

## 2. Testing Workflows
To execute the automated test suites, run:
**`pnpm test`**

Always ensure tests pass locally before committing. For Next.js/Turbopack build checks, run:
**`pnpm run build`**

## 3. Pull Request Validation Rules
When submitting Pull Requests, ensure:
- **Test Coverage:** All unit tests must pass (`pnpm test`).
- **Pre-commit Hooks:** Code must conform to local lint and format checks.
- **Documentation Sync:** Run `node scripts/generate-component-registry.js` if you have added or modified UI components.
- **Architectural Constraints:** Ensure adherence to rules defined in `AGENTS.md` (e.g., using `isomorphic-dompurify`, masking PII, avoiding raw tailwind colors).
