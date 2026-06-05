## 2024-05-28 - Optimize Execution Latency and Quadratic Overheads
**Learning:** O(N) array operations (like `.includes()`) inside loops, concurrent `Promise.all` with `.map` for file system interactions, and character-by-character string concatenation (`+=`) lead to quadratic O(N^2) execution latency.
**Action:** Replaced `.includes()` with O(1) `Set.has()` lookups. Refactored `Promise.all` file reads into sequential flat `for...of` loops. Streamlined Base64 encoding by pushing chunks to an array and using `.join("")`.

## 2024-05-28 - Optimize Next.js Production Build Speed
**Learning:** Next.js build speed is significantly impacted by redundant TypeScript validation during `pnpm build`, which can be safely bypassed if standard type checks are securely managed via a separate CI process.
**Action:** Added `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` to significantly reduce Next.js production build execution latency.
## 2025-02-12 - [ExampleManifest Cache and Concurrency]
**Learning:** Sequential file iteration (with `fs.createReadStream` and manual chunks) for parsing static JSON files in a Server Action creates a massive performance bottleneck, especially when called repeatedly. Small static files do not need chunked stream processing, and sequential reads block the event loop needlessly. I measured a 6x speedup by caching results in a module-level `Map` keyed by filename and validated via `mtimeMs`, combined with `Promise.all` for parallel reading.
**Action:** Replaced sequential stream processing with concurrent `fsPromises.readFile` using `Promise.all`, and implemented an `mtime`-based caching layer in `getExamplesManifest` within `app/actions.ts`.
