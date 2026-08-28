2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.

## 2024-10-25 - [Optimize optimizePackageImports Part 2]
**Learning:** Expanding `optimizePackageImports` to include Radix UI and other heavy UI/utils dependencies such as `zod`, `react-hook-form`, and `isomorphic-dompurify` further drops the build latency by avoiding deeper unneeded module traversals during Turbopack's build step.
**Action:** Included `@radix-ui/react-*` components, `isomorphic-dompurify`, `zod`, `react-hook-form`, and others in `optimizePackageImports`.
