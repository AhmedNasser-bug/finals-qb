2024-05-18 - [Optimize duplicate ID resolution], Learning: While loops containing Set lookups can be O(N^2) if the final generated IDs consistently collide with the existing data set. Tracking the counter externally in a Map bypasses the need to regenerate previously-collided strings., Action: Updated duplicate ID resolution in `components/mold/home/add-questions-wizard.tsx` to use `Map` for both questions and flashcards.
## 2024-06-25 - [Optimize optimizePackageImports]
**Learning:** Next.js experimental `optimizePackageImports` is highly effective at reducing Turbopack build latency when used for barrel file exports or packages with many sub-modules that aren't cleanly tree-shaken by default.
**Action:** Configured `optimizePackageImports` in `next.config.mjs` for `recharts`, `date-fns`, `lucide-react`, and other barrel-file dependencies.

## 2024-10-25 - [Turbopack optimizePackageImports constraints]
**Learning:** Next.js `optimizePackageImports` is highly effective for large barrel files (like `lucide-react`, `mermaid`, `katex`) but should NOT be used for individual micro-packages (like `@radix-ui/react-*` components) because they do not suffer from the barrel-file performance issue and adding them provides zero benefit while cluttering the config. Adding `mermaid` and `katex` still speeds up compilation.
**Action:** Only add large dependencies or known barrel-file exports to `optimizePackageImports`, never granular micro-packages.
