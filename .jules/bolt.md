2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.
## 2024-09-27 - [Optimize array and string processing for performance bottlenecks]
**Learning:** In performance-critical loops, avoid heavy `new Date()` parsing and chained array methods (`.filter()`, `.reduce()`, etc.). Replace with fast-path substring extraction (`date.substring(0, 10)`) and consolidate flat `for...of` loops to maintain linear O(N) execution and reduce object allocation overhead.
**Action:** Refactored various string handling, array iterations, and manual asynchronous chunk-reading loops.
