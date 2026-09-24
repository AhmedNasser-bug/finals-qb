2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.

## Performance Insight: Linear Degradation from Nested Array Mapping & Chunk Streams
* **Date:** $(date +%Y-%m-%d)
* **Finding:** Deeply nested array mapping/filtering inside JSX expressions, and unbuffered async iterators over disk streams, severely degrade execution performance (trending toward quadratic latency) on large datasets. Chained array operations like `.filter(...).map(...)` iterate over the data multiple times, creating intermediate arrays. Similarly, `for await (const chunk of stream)` disk reading loops introduce event-loop overhead for entirely loaded files.
* **Mitigation:**
  * Consolidate array transformations over large datasets into a single, flat `for...of` or `for` loop (wrapped in an IIFE when used directly in JSX).
  * Use `fs.readFileSync` or `fsPromises.readFile` for complete memory loads instead of manual chunk-and-push loops unless strictly processing streams asynchronously.
* **Impact:** Reduces O(N^2) pseudo-quadratic scaling and unnecessary event loop cycles to strict O(N) linear operations.
