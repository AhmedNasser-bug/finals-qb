# Automated Onboarding Step-Instruction Playbooks

**Welcome to the Workspace!** Follow these steps to initialize the environment and run validation checks.

## **Step 1: Workspace Initialization**
Run the following script to bootstrap the multi-tenant sandbox and install dependencies:
```bash
./scripts/setup/setup.sh --multi-tenant
```
This script is idempotent and sets up your local development environment instantly.

## **Step 2: Localized Testing Workflow**
The project uses the built-in Node.js test runner (`node:test`) for unit testing logic files.
**Run all unit tests:**
```bash
pnpm test
```
*Note: Due to path aliasing and `.tsx` constraints, test execution ignores the `node_modules` directory natively via the `test` script in `package.json`.*

## **Step 3: Build Verification**
Before submitting any changes, verify that the application compiles correctly:
```bash
pnpm build
```

## **Step 4: PR Validation Rules**
* **Linting:** Ensure your code passes Next.js linting (note: fix any project directory configuration issues before running `pnpm lint`).
* **Tests:** All unit tests must pass.
* **Format:** Adhere to codebase standards (no native `pnpm format` script exists).
* **Accessibility:** Validate screen reader compatibility and semantic HTML (e.g., `aria-live`, correct button elements).
* Ensure proper use of single `useEffect` guards and early returns.
