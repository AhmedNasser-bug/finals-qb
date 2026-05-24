# Testing Consolidation Guidelines

## 1. Mocks & Model Integration
*   **Rule:** When writing tests, always consolidate fragmented or duplicate test files into centralized, category-specific test modules (e.g. `lib/mold-types.test.ts` and `lib/subject-persistence.test.ts`) to prevent conflicting duplicate files. Always ensure data mocks correspond perfectly to current schemas to prevent legacy regressions.

## 2. Test Execution Command
*   **Rule:** The official and required test command is:
    ```bash
    node --experimental-strip-types --import ./test-runner.mjs --test lib/accuracy.test.ts lib/crypto-utils.test.ts lib/mold-types.test.ts lib/subject-persistence.test.ts
    ```
    Always run this entire suite to verify structural and type-level validity before merging or committing features.
