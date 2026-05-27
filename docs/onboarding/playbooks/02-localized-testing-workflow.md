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
