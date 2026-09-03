# Automated Onboarding Step-Instruction Playbooks

## Setup Instructions

1. **Check Prerequisites:** Ensure you have Node.js and `pnpm` installed. The repository utilizes `pnpm` for dependency management.
   ```bash
   pnpm install
   ```

2. **Environment Variables:** Set up the required environment variables.
   ```bash
   cp .env.example .env.local
   ```

3. **Bootstrap Local Workspace:** The project uses a multi-tenant sandbox infrastructure orchestrated via Docker Compose.
   ```bash
   bash scripts/orchestration/bootstrap.sh --multi-tenant
   ```
   This command installs dependencies, configures environment files, seeds local mock data, and spins up `tenant-a` and `tenant-b` docker containers mapped to ports 3001 and 3002.

4. **Start Development Server:** Run the local server to verify.
   ```bash
   pnpm dev
   ```

## Local Testing Frameworks

The repository enforces strict testing requirements before commits. Tests are executed via a custom `test-runner.mjs` wrapper around Node.js's native test runner.

**Run All Tests:**
```bash
pnpm test
```

Node warnings regarding `[MODULE_TYPELESS_PACKAGE_JSON]` during test execution can be safely ignored as long as tests pass.

## PR Validation Rules

When submitting a Pull Request, you **must** adhere to the following formatting and validation rules depending on the domain of the contribution:

### Bolt Agent (Performance Optimization) PRs
- **Title Format:** `⚡ Bolt: [performance improvement]`
- **Required Sections:**
  - **💡 What:** [Description of the exact mutation]
  - **🎯 Why:** [Reasoning for the change]
  - **📊 Impact:** [How it affects adjacent systems]
  - **🔬 Measurement:** [Metrics or performance validation]

### Palette-UX (UI/UX Improvement) PRs
- **Branch Format:** `jules-ux-<category>-<hash>`
- **Title Format:** `🎨 Palette: [UX improvement]`
- **Required Sections:**
  - **💡 What:** [Description of the UX change]
  - **🎯 Why:** [Reasoning for the change]
  - **📸 Before/After:** [Visual changes description]
  - **♿ Accessibility:** [Accessibility compliance notes, e.g., aria-labels, focus rings]
- **Constraint:** UX additions must be non-breaking (never altering existing data contracts) and backwards-compatible.

### Final Verification
- Always execute `pnpm test` successfully. Note that in this environment, `pnpm lint` and `next lint` may fail with an invalid project directory error, so rely on `pnpm test`.
- Verify changes in the live UI using the provided `pnpm dev` sandbox.
