2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.

## 2024-05-19 - Removed event loop overhead by replacing `fs.createReadStream` chunk loop with `fsPromises.readFile`
**Learning:** Found an anti-pattern in `app/actions.ts` where manual iteration (`for await (const chunk of stream) { chunks.push(chunk) }`) introduced event loop overhead when standard node file loading logic is cleaner and more optimal.
**Action:** Replaced `fs.createReadStream` with `fsPromises.readFile` (and added a missing `fsPromises` import to prevent runtime failures).

## 2024-05-19 - Consolidated array passes in statistical and telemetry methods
**Learning:** Found multiple chained array passes (`.filter`, `.some`, `.reduce`) operating over telemetry sets introducing quadratic O(N) execution overhead when analyzing large user activity sets.
**Action:** Flattened array method chains into single `for...of` linear execution loops to guarantee flat O(N) evaluation in `retention-kernel.ts`, `stats-utils.ts`, and `mold-types.ts`.
