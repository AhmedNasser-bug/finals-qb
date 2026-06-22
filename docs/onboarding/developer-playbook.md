# Developer Playbook

## Initialization Commands
To setup and bootstrap the multi-tenant local workspace, execute:
**`./scripts/setup/setup.sh --multi-tenant`**

To start the Next.js development server, run:
**`pnpm dev`**

## Testing Workflows
The repository uses the native Node.js test runner. To execute the test suite:
**`pnpm test`**

To run a specific test file, pass the path directly to the test script if supported, or rely on `pnpm test` which runs all specified files in `package.json`.

## PR Validation Rules
Before submitting a PR, ensure the following validations pass:
1. **Testing**: Run `pnpm test` and ensure all tests pass.
2. **Linting**: Run `pnpm lint`. Note that if this fails due to a missing valid linting setup, it can be bypassed.
3. **Build**: Run `pnpm build` to confirm UI changes.
4. **No Environment Mismatches**: Exclude unintended `pnpm-lock.yaml` changes.
5. **No Temporary Files**: Delete and unstage temporary debug/workspace files.
