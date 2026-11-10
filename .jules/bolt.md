2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.
## 2024-09-25 - [Optimize Date Parsing Overhead in Analytics Loops]
**Learning:** Instantiating `new Date(string)` inside tight `O(N)` accumulation loops (such as daily streak or mission evaluators) against an array of telemetry objects causes aggressive garbage collection and latency spikes. Fast-path checking the expected footprint (`YYYY-MM-DD`) and using `.substring(0, 10)` skips parsing entirely and drops execution time by nearly 90% (e.g., from ~1.8ms per 10k items to 0.16ms).
**Action:** Implemented fast-path string slicing for ISO 8601 date parsing in `calculateDayStreak` (`lib/game/streak-utils.ts`) and `evaluateDailyMissions` (`lib/game/stats-utils.ts`), converting chained functional array methods into single-pass flat iteration loops.

## 2024-07-02 - [Optimize Array.indexOf inside Array.sort]
**Learning:** Using `Array.indexOf()` inside an `Array.sort()` comparator function results in an unexpected O(N^2 log N) performance bottleneck since the linear scan repeats on every comparison.
**Action:** Always pre-calculate order arrays into a `Map` cache (hash map) to achieve O(1) index lookups during iterative or sorting loops.

## 2024-11-10 - [Optimize Date Parsing in Telemetry Loops]
**Learning:** ISO 8601 strings sort lexicographically. Parsing them into `Date` objects inside tight, large loops (such as filtering telemetry events based on timestamps) adds massive overhead and garbage collection pressure.
**Action:** Always use direct string comparison (`stringA < stringB`) instead of `new Date(stringA) < new Date(stringB)` when evaluating ISO 8601 timestamps inside filters or sorts.

## 2024-11-10 - [Flatten O(N*M) Mapping into O(N) Hash Accumulation]
**Learning:** Creating intermediate array groups and then chaining multiple `.filter()` and `.reduce()` operations per group scales poorly (`O(N * M)`).
**Action:** Use a single-pass `for` loop to directly accumulate counts, sums, and averages into a hash map, dropping multi-pass iteration overhead entirely.
