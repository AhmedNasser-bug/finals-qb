### 💡 Refactor: Flatten deeply nested validation logic

This PR refactors the core `validateSubjectData` function in `lib/subject-persistence.ts` to improve maintainability and readability by eliminating complex, deeply nested conditional hierarchies.

**Structural Modifications:**
1. **Phase 1 (Normalization) Extraction**:
   - Extracted legacy data normalization logic into modular helper functions: `normalizeFlashcards`, `normalizeTerminology`, and `normalizeAchievements`.
   - Replaced nested conditionals inside these helpers with guard clauses and early returns.

2. **Phase 2 (Strict Validation) Extraction**:
   - Extracted strict schema validation checks into dedicated helpers: `validateConfig`, `validateQuestions`, `validateFlashcards`, `validateTerminology`, and `validateAchievements`.
   - Converted the `forEach` loop in `validateQuestions` to a standard `for` loop, allowing the early `return` to properly halt execution upon reaching the maximum error limit (8 errors), resolving a dormant bug.
   - Employed guard clauses and early returns extensively within each helper to maintain a flat control flow.

3. **Orchestration**:
   - The main `validateSubjectData` function now acts as a clean orchestrator, simply sequentially calling the Phase 1 and Phase 2 helpers.

**Verification:**
- Full functional parity is maintained. All 18 existing unit tests run successfully without modification.
