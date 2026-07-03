# Testing Workflows

The repository leverages native Node.js testing frameworks where applicable.

## Running the Test Suite

Execute all tests globally using `pnpm`:

```bash
pnpm test
```

This effectively runs our core script which uses Node's native type stripping:
`node --experimental-strip-types --import ./test-runner.mjs --test <test_files...>`

**Rule**: Always execute tests to ensure structural modifications do not introduce regressions before opening a Pull Request.

If testing specific files locally directly, note that JSX syntax (`.tsx`) is not supported by native Node type stripping.
