2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.

## 2024-08-01 - [Optimize optimizePackageImports with Radix UI]
**Learning:** Next.js experimental `optimizePackageImports` does not support wildcards (e.g. `@radix-ui/react-*`), so all packages must be explicitly listed. Also, the build speeds and memory footprint can be significantly reduced by targeting UI libraries heavily used like `zod`, `react-hook-form`, `isomorphic-dompurify`, and individual `@radix-ui/react-*` libraries, not just `lucide-react` or `date-fns`.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for all `@radix-ui/react-*` components, `zod`, `react-hook-form`, and `isomorphic-dompurify`.
