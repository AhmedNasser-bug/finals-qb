# Workflow: Run Tests (run_tests)

This workflow provides the standardized procedure for executing the Node.js native test suite across the repository while avoiding node_modules and ensuring TypeScript type-stripping is correctly applied.

---

## 1. Prerequisites & Dependencies

- [ ] Node.js v20+ with experimental feature support.
- [ ] Valid codebase with `.test.ts` files present.

---

## 2. Execution Protocol

### Step 1: Execute Native Node Tests
- **Action**: Run the full test suite using the custom `test-runner.mjs` loader.
  ```bash
  node --experimental-strip-types --import ./test-runner.mjs --test $(find . -name '*.test.ts' -not -path '*/node_modules/*')
  ```
- **Verification Goal**: Terminal output shows test successes with no failures.
- **Failure Mitigation**: If alias paths fail, verify `test-runner.mjs` is correctly imported. If tests fail on globals like `sessionStorage`, ensure they are mocked in `beforeEach` and cleaned up in `afterEach`.

---

## 3. Reference Materials
- [Testing Guidelines](../../.Jules/testing.md)
