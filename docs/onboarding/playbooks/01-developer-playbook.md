# Developer Onboarding Playbook

Welcome to the `finals-qb` project! This playbook outlines the necessary commands and workflows for local development and PR validation.

## **Initialization Commands**
1. Install dependencies via **pnpm** (npm/yarn are restricted):
   `pnpm install`
2. Start the local development server:
   `pnpm dev`
3. Setup the local multi-tenant sandbox environment:
   `bash scripts/setup/setup.sh --multi-tenant`

## **Testing Workflows**
1. Execute local unit tests:
   `pnpm test`
2. Verify static type-safety across the project:
   `pnpm lint` (Runs `tsc --noEmit` under the hood)

## **PR Validation Rules**
To successfully merge a Pull Request, the following criteria must be met:
- **Test Pass Rate**: All 184+ tests must pass with `fail 0`.
- **No Regressions**: Execute `pnpm run build` to ensure zero compilation or Turbopack regressions.
- **No Dependency Violations**: `package-lock.json` is banned; only modify dependencies via `pnpm`.
