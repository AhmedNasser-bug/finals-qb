# Testing Workflows

Our testing philosophy focuses on reliability and performance. We use the native Node.js test runner for our test suite.

## Running Tests

### Standard Test Suite
To run the full suite of unit and integration tests:
```bash
pnpm test
```

### Running Specific Tests
To run an isolated TypeScript test file directly:
```bash
node --experimental-strip-types --test <path/to/test-file.ts>
```
*(Note: This is for `.ts` files only, not `.tsx` files)*

## Testing Principles
- **Idempotency**: Tests should not rely on previous state and should clean up after themselves.
- **Coverage**: Aim for high coverage on core business logic and critical utility functions.
