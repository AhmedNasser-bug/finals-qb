# PR Validation Rules

Before submitting Pull Requests, ensure that you run the following checks locally:

## Validation Commands
1. Run Linting / Type Checking:
**`pnpm lint`**
(Mapped to **`tsc --noEmit`** in **`package.json`**)

2. Run Tests:
**`pnpm test`**
(Uses Node's native test runner with **`--experimental-strip-types`**)

*Always verify your changes and ensure no regressions are introduced.*
