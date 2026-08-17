2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## Execution Journal

### ⚡ Bolt: Streamlined Blocks & Linear Execution

- **What:** Refactored `app/actions.ts` and `scripts/generate-component-registry.js` to utilize `node:stream/consumers` instead of unbuffered array chunk accumulation. Also refactored `balanceJsonStack` and `repairBadEscapes` in `lib/subject/subject-persistence.ts` to utilize fast-forward execution using `indexOf` and evaluating exact charcodes instead of extracting single char blocks.
- **Why:** To squash linear overhead from loops by flattening execution latency using C++ engine methods like `indexOf` and preventing memory footprint issues by leveraging node stream consumers directly instead of heavy V8 array memory reallocation via `chunks.push(chunk)`.
- **Impact:** Significant performance improvement on heavy IO loads parsing subjects data or loading generation scripts locally, bringing string latency down exponentially.
