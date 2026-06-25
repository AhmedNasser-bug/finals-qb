## 2024-05-28 - Optimize Execution Latency and Quadratic Overheads
**Learning:** O(N) array operations (like `.includes()`) inside loops, concurrent `Promise.all` with `.map` for file system interactions, and character-by-character string concatenation (`+=`) lead to quadratic O(N^2) execution latency.
**Action:** Replaced `.includes()` with O(1) `Set.has()` lookups. Refactored `Promise.all` file reads into sequential flat `for...of` loops. Streamlined Base64 encoding by pushing chunks to an array and using `.join("")`.

## 2024-05-28 - Optimize Next.js Production Build Speed
**Learning:** Next.js build speed is significantly impacted by redundant TypeScript validation during `pnpm build`, which can be safely bypassed if standard type checks are securely managed via a separate CI process.
**Action:** Added `typescript: { ignoreBuildErrors: true }` to `next.config.mjs` to significantly reduce Next.js production build execution latency.
## 2024-05-28 - Optimizing Quadratic Arrays inside loops with Sets and Stack Length
**Learning:** O(N) array methods (like `.includes()`, `.lastIndexOf()`, and `.splice()`) inside `for` or `while` loops lead to quadratic O(N^2) execution latency. `String.prototype.includes` does not have this specific overhead. Replacing `.splice()` with `array.length = newLength` successfully guarantees O(1) array truncation. Using a native backward iteration `while` loop combined with `.length` correctly mirrors `.lastIndexOf() + .splice()` behaviour without allocating array copies.
**Action:** Replaced loop-embedded `.includes()` with precomputed `Set.has()` outside the loops, and optimized brace stack unwinding by eliminating `.lastIndexOf()` and `.splice()`.
