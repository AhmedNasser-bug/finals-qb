# PR Validation Rules Playbook

## 1. **Code Validation**
- **Type Checking**: Before pushing, always run `pnpm lint` to execute type checks.
- **Tests**: Ensure all localized native test suites pass (`pnpm test`).

## 2. **Verification Requirements**
- Confirm all setup orchestration scripts remain idempotent and do not delete shared resources or block subsequent executions.
- Any layout UI changes must match semantic Tailwind configurations.
