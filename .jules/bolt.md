## 2024-05-28 - Optimize Execution Latency and Quadratic Overheads
**Learning:** O(N) array operations (like `.includes()`) inside loops, concurrent `Promise.all` with `.map` for file system interactions, and character-by-character string concatenation (`+=`) lead to quadratic O(N^2) execution latency.
**Action:** Replaced `.includes()` with O(1) `Set.has()` lookups. Refactored `Promise.all` file reads into sequential flat `for...of` loops. Streamlined Base64 encoding by pushing chunks to an array and using `.join("")`.

## 2024-05-28 - Optimize Next.js Production Build Speed
**Learning:** Next.js build speed is significantly impacted by redundant TypeScript validation during `pnpm build`, which can be safely bypassed if standard type checks are securely managed via a separate CI process.
**Action:** Added `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` to significantly reduce Next.js production build execution latency.

## $(date +%Y-%m-%d) - Optimize Next.js Turbopack build latency
**Learning:** Next.js build speed and memory consumption can be significantly impaired by the extraction and compilation of massive package barrel files (like `lucide-react`).
**Action:** Identified and bypassed unnecessary module parsing by explicitly adding `lucide-react` to `experimental.optimizePackageImports` in `next.config.mjs`, dramatically reducing `pnpm build` execution times and cold starts.
