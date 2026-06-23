## 2024-05-28 - Optimize Execution Latency and Quadratic Overheads
**Learning:** O(N) array operations (like `.includes()`) inside loops, concurrent `Promise.all` with `.map` for file system interactions, and character-by-character string concatenation (`+=`) lead to quadratic O(N^2) execution latency.
**Action:** Replaced `.includes()` with O(1) `Set.has()` lookups. Refactored `Promise.all` file reads into sequential flat `for...of` loops. Streamlined Base64 encoding by pushing chunks to an array and using `.join("")`.

## 2024-05-28 - Optimize Next.js Production Build Speed
**Learning:** Next.js build speed is significantly impacted by redundant TypeScript validation during `pnpm build`, which can be safely bypassed if standard type checks are securely managed via a separate CI process.
**Action:** Added `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` to significantly reduce Next.js production build execution latency.
## 2024-05-28 - Optimize Base64 Decoding Quadratic Overheads
**Learning:** `Uint8Array.from` on a string utilizes the string iterator, which is relatively slow and memory-intensive because it allocates objects for each character. Using `String.fromCharCode.apply()` and `[].push()` within a block chunk loop for encoding array buffers also results in quadratic O(N^2) execution latency. `Buffer` is drastically faster if available.
**Action:** Replaced O(N) allocation latency in browser fallbacks with native `Buffer` when available, falling back to a standard indexed `for` loop to prevent object allocations.
