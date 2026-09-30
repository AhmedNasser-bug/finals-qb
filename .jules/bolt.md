## 2024-10-31 - Direct IO Buffering
**Learning:** Using `fs.createReadStream` and manually chaining `for await (const chunk of stream) { chunks.push(chunk) }` incurs high iteration and callback overhead for synchronously blocking CLI tools and short-lived edge handlers compared to direct buffering.
**Action:** Always prefer `fs.readFileSync` or `fsPromises.readFile` when reading non-gigantic strings to allow the native V8 runtime to allocate continuous contiguous buffers and avoid event-loop overhead.

## 2024-10-31 - Flattening Chained Map/Filter/Reduce Arrays
**Learning:** Chaining array `.filter`, `.map`, and `.reduce` across collections incurs heavy quadratic O(N) allocation penalties for each intermediate array return structure.
**Action:** When working on performance-critical mapping code (e.g. game event statistics loops), merge data transformations into flattened `for` or `for...of` loops tracking single values instead of spawning new uncollected garbage structures.
