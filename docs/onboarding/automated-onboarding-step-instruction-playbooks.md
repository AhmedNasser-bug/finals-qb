# Automated Onboarding Step-Instruction Playbooks

**Welcome to the MOLD V2 repository!** Follow these steps to initialize the environment, run validation checks, and prepare Pull Requests for validation.

---

## **Step 1: Workspace Initialization**

We have consolidated the setup into a simple, idempotent bootstrap script. This project **strictly requires `pnpm`**.

1. Open your terminal in the repository root.
2. Run the bootstrap orchestration script to setup the multi-tenant sandbox and install dependencies:
   ```bash
   ./scripts/setup/setup.sh --multi-tenant
   ```
   *(This will verify your `pnpm` installation, install dependencies, and prepare the local environment instantly.)*
3. Start the local development server:
   ```bash
   pnpm dev
   ```
4. Access the sandbox locally at `http://localhost:3000`.

---

## **Step 2: Localized Testing Workflow**

MOLD V2 uses the built-in Node.js test runner (`node:test`) for unit testing logic files. **We do not use Jest or Vitest.**

1. To run all automated unit tests across the repository, use the configured `test` script in `package.json`:
   ```bash
   pnpm test
   ```
2. **Under the hood**, this command executes:
   ```bash
   node --experimental-strip-types --import ./test-runner.mjs --test $(find . -name '*.test.ts' -not -path '*/node_modules/*')
   ```
3. *Note on Testing constraints:* Due to path aliasing and `.tsx` constraints, test execution ignores the `node_modules` directory natively via the `test` script in `package.json`. The Node.js test runner `--experimental-strip-types` cannot currently handle `.tsx` React files or module alias paths (e.g., `@/lib`). Tests should be restricted to pure `.ts` logic files with relative paths.

---

## **Step 3: Build Verification**

Before submitting any changes, verify that the application compiles correctly to catch Turbopack or TypeScript compilation errors:
```bash
pnpm build
```

---

## **Step 4: PR Validation Rules**

Before submitting a Pull Request, ensure your code passes the following validation criteria:

* **No "XXX" Markers:** Automated scanning tools will flag and fail PRs containing `XXX` placeholder markers. Please resolve or remove them.
* **Clean Console:** Ensure obsolete `// Fix [X]:` comments for implemented features are removed from your code.
* **Tests Pass:** All logic changes must be covered by a unit test (in `.test.ts` files), and running `pnpm test` must yield a 100% success rate.
* **Format:** Adhere to codebase standards (no native `pnpm format` script exists).
* **Linting:** Ensure your code passes Next.js linting (note: running `next lint` directly might fail due to a known configuration issue. Focus on passing `pnpm build` and `pnpm test` as the primary gates).
* **Accessibility:** Validate screen reader compatibility and semantic HTML (e.g., `aria-live`, correct button elements).
* **Architecture Rules:** Ensure proper use of single `useEffect` guards and early returns.