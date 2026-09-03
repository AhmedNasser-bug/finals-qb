2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.
## 2024-05-18 - [Optimize Retention Aggregation]
**Learning:** O(N) array operations (like `.filter().length` and `.reduce()`) chained together on the same dataset result in multiple redundant iterations.
**Action:** Replaced 5 redundant iterations in `deriveCategoryRetentionSummaries` with a single `for...of` loop to calculate counts and sums simultaneously in flat O(N) time.
