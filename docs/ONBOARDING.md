# MOLD V2 Developer Onboarding Playbook

Welcome to the MOLD V2 repository! This document outlines the step-by-step instructions for setting up the workspace, running local tests, and preparing Pull Requests for validation.

---

## 1. Local Workspace Initialization

We have consolidated the setup into a simple, idempotent bootstrap script. This project **strictly requires `pnpm`**.

**Step-by-step:**
1. Open your terminal in the repository root.
2. Run the bootstrap orchestration script:
   ```bash
   ./setup.sh
   ```
   *(This will verify your `pnpm` installation, install dependencies, and prepare the local environment.)*
3. Start the local development server:
   ```bash
   pnpm dev
   ```
4. Access the sandbox locally at `http://localhost:3000`.

---

## 2. Automated Testing Workflow

MOLD V2 uses the native Node.js test runner for unit tests. **We do not use Jest or Vitest.**

**Step-by-step:**
1. To run all automated unit tests across the repository, use the configured `test` script in `package.json`:
   ```bash
   pnpm test
   ```
2. **Under the hood**, this command executes:
   ```bash
   node --experimental-strip-types --import ./test-runner.mjs --test $(find . -name '*.test.ts' -not -path '*/node_modules/*')
   ```
3. *Note on Testing constraints:* The Node.js test runner `--experimental-strip-types` cannot currently handle `.tsx` React files or module alias paths (e.g., `@/lib`). Tests should be restricted to pure `.ts` logic files with relative paths.

---

## 3. Pull Request Validation Rules

Before submitting a Pull Request, ensure your code passes the following validation criteria:

1. **No "XXX" Markers:** Automated scanning tools will flag and fail PRs containing `XXX` placeholder markers. Please resolve or remove them.
2. **Clean Console:** Ensure obsolete `// Fix [X]:` comments for implemented features are removed from your code.
3. **Tests Pass:** All logic changes must be covered by a unit test (in `.test.ts` files), and running `pnpm test` must yield a 100% success rate.
4. **Build Verification:** Run a Next.js production build locally to catch Turbopack or TypeScript compilation errors:
   ```bash
   pnpm build
   ```
5. **Linting Context:** Note that running `next lint` directly might fail due to a known configuration issue. Focus on passing `pnpm build` and `pnpm test` as the primary gates.