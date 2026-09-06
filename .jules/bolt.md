2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.

## 2024-06-26 - [Flatten array iterations]
**Learning:** Multiple consecutive array passes like `.filter()`, `.reduce()`, or `.some()` over large datasets scale poorly and introduce O(K*N) complexity. Flattening them into a single `for...of` loop reduces complexity to flat O(N) linear time and removes intermediate array allocations.
**Action:** Flattened iterations in `computeAggregateStats`, `deriveCategoryRetentionSummaries`, and `evaluateDailyMissions` from chained array methods into single iterative loops.
