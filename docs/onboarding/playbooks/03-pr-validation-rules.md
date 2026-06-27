# PR Validation Rules

**Before creating a Pull Request, ensure that the following requirements are met:**

## **1. Test Everything**
Ensure **`pnpm test`** passes cleanly with 100% success rate. Always execute unit tests immediately before the pre-commit phase to comply with the Completeness Rule.

## **2. Architectural Boundaries**
Changes to monolithic UI files should isolate nested elements and use explicit interfaces. Any logic modified must align with granular documents in **`docs/architecture/cross-module-traceability/`**.

## **3. Performance Constraints**
Any O(N) or looping mechanisms must not allocate unbounded memory (use streaming or chunking for data transformations).

## **4. Idempotency**
Any new initialization processes introduced must remain idempotent (e.g. check for existing seeds before creating).

## **5. Verification**
Document changes via pre-commit steps ensuring testing (e.g. Playwright scripts or manual inspection), review, verification, and reflection are done.
