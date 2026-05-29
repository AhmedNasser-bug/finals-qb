# Developer Onboarding Playbook

## 2. Testing Workflows

MOLD V2 uses the built-in Node.js test runner (`node:test`) for unit testing logic files. **We do not use Jest or Vitest.**

1. **Execute All Tests:**
   To run all automated unit tests across the repository, use the configured `test` script in `package.json`:
   ```bash
   pnpm test
   ```
   **Note:** The test execution command uses `--experimental-strip-types` and `--import ./test-runner.mjs` to seamlessly interpret TypeScript and path aliases within the local environment.

2. **Under the hood**, this command executes:
   ```bash
   node --experimental-strip-types --import ./test-runner.mjs --test $(find . -name '*.test.ts' -not -path '*/node_modules/*')
   ```

3. *Note on Testing constraints:* Due to path aliasing and `.tsx` constraints, test execution ignores the `node_modules` directory natively via the `test` script in `package.json`. The Node.js test runner `--experimental-strip-types` cannot currently handle `.tsx` React files or module alias paths (e.g., `@/lib`). Tests should be restricted to pure `.ts` logic files with relative paths.

---

## 3. Build Verification

Before submitting any changes, verify that the application compiles correctly to catch Turbopack or TypeScript compilation errors:
```bash
pnpm build
```