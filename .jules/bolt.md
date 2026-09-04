2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.

## 2024-05-18 - [Optimizing chained O(N) Array Operations]
**Learning:** Multiple array methods (`.filter()`, `.reduce()`, `.map()`, `.slice()`) chained together are commonly used for functional purity but evaluate N elements on every chained operation. In large datasets like client telemetry processing arrays or run statistics, this acts as O(M*N) overhead creating measurable UI bottlenecks on dashboard rendering.
**Action:** When finding high-volume or hot-path chained operations traversing the same dataset, refactor them into a single-pass `for` loop to enforce flat O(N) evaluation bounds, prioritizing execution latency over declarative syntactic sugar.
