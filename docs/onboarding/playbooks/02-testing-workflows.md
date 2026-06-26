# Developer Onboarding Playbook: Testing Workflows

## 2. Testing Workflows

**The repository uses the native `node:test` runner.**

1. **Execute All Tests:**
   Run the following command to execute all relevant tests.
   ```bash
   pnpm test
   ```
   **Note:** The test execution command uses `--experimental-strip-types` and `--import ./test-runner.mjs` to seamlessly interpret TypeScript and path aliases within the local environment. Do not use Jest or Vitest.

2. **Visual Verification:**
   To test the frontend visually, run the dev server and inspect interactive components.
   ```bash
   pnpm dev
   ```
