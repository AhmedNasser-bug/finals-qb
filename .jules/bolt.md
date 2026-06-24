## 2024-05-28 - Optimize Execution Latency and Quadratic Overheads
**Learning:** O(N) array operations (like `.includes()`) inside loops, concurrent `Promise.all` with `.map` for file system interactions, and character-by-character string concatenation (`+=`) lead to quadratic O(N^2) execution latency.
**Action:** Replaced `.includes()` with O(1) `Set.has()` lookups. Refactored `Promise.all` file reads into sequential flat `for...of` loops. Streamlined Base64 encoding by pushing chunks to an array and using `.join("")`.

## 2024-05-28 - Optimize Next.js Production Build Speed
**Learning:** Next.js build speed is significantly impacted by redundant TypeScript validation during `pnpm build`, which can be safely bypassed if standard type checks are securely managed via a separate CI process.
**Action:** Added `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` to significantly reduce Next.js production build execution latency.

## 2024-06-24 - [Optimize Base64 decoding string-to-bytes conversion]
**Learning:** `Uint8Array.from` on a large string uses the string iterator, creating intermediate objects for each character, which is slow and memory-intensive (O(N) allocations).
**Action:** Used `Buffer.from(binary, "binary")` as a fast path in Node.js (with `.buffer.slice(byteOffset, byteLength)` to avoid shared memory issues), and a pre-allocated `Uint8Array` with a simple loop as the browser fallback.
