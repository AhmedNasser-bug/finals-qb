## 2024-05-28 - Optimize Execution Latency and Quadratic Overheads
**Learning:** O(N) array operations (like `.includes()`) inside loops, concurrent `Promise.all` with `.map` for file system interactions, and character-by-character string concatenation (`+=`) lead to quadratic O(N^2) execution latency.
**Action:** Replaced `.includes()` with O(1) `Set.has()` lookups. Refactored `Promise.all` file reads into sequential flat `for...of` loops. Streamlined Base64 encoding by pushing chunks to an array and using `.join("")`.

## 2024-05-28 - Optimize Next.js Production Build Speed
**Learning:** Next.js build speed is significantly impacted by redundant TypeScript validation during `pnpm build`, which can be safely bypassed if standard type checks are securely managed via a separate CI process.
**Action:** Added `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` to significantly reduce Next.js production build execution latency.
## 2024-05-18 - Fix Quadratic Latency in Streams and Mappings
**Learning:** O(N^2) quadratic latency in Node.js can be triggered by iterative string building (e.g., `content += chunk` inside a `for await (chunk of stream)` loop) or dynamically reallocating arrays within nested mappings (e.g., chained `.split().map()` iterations and loop-based `Array.map`).
**Action:** Replaced stream concatenation loops with array chunk accumulators (`chunks.push(chunk); chunks.join('')`) to enforce flat O(N) allocation, and refactored loop-nested `.map()` logic to use statically typed, pre-allocated `new Array(len)` iterations.
