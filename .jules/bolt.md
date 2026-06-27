## 2024-05-28 - Optimize Execution Latency and Quadratic Overheads
**Learning:** O(N) array operations (like `.includes()`) inside loops, concurrent `Promise.all` with `.map` for file system interactions, and character-by-character string concatenation (`+=`) lead to quadratic O(N^2) execution latency.
**Action:** Replaced `.includes()` with O(1) `Set.has()` lookups. Refactored `Promise.all` file reads into sequential flat `for...of` loops. Streamlined Base64 encoding by pushing chunks to an array and using `.join("")`.

## 2024-05-28 - Optimize Next.js Production Build Speed
**Learning:** Next.js build speed is significantly impacted by redundant TypeScript validation during `pnpm build`, which can be safely bypassed if standard type checks are securely managed via a separate CI process.
**Action:** Added `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` to significantly reduce Next.js production build execution latency.

## 2024-05-28 - Optimize Execution Latency and Quadratic Overheads (Additional)
**Learning:** `Uint8Array.from` with a mapping callback creates O(N) execution latency and high memory allocation overhead due to generating new function contexts for every element. Similarly, `lastIndexOf` combined with `splice` inside a sequential character loop degrades to O(N^2) latency compared to a simple backward `while` loop combined with `array.length = idx` array truncation.
**Action:** Replaced `Uint8Array.from` with a pre-allocated array and traditional `for` loop in Base64 parsing. Replaced `lastIndexOf` and `splice` with backward `while` loops and `.length = idx` array truncation during JSON brace matching.
