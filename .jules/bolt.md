## 2024-05-28 - Replaced Quadratic String Concatenation and Concurrent Reads

**Learning:** String concatenation inside a loop (`+=`) over large byte arrays results in quadratic O(N^2) memory reallocation and severe execution latency in JavaScript. Additionally, utilizing `Promise.all` with `Array.prototype.map` to perform concurrent file system reads can induce memory allocation spikes when processing multiple JSON manifests.

**Action:** Accumulate string chunks inside an array using `.push()` and perform a single `.join('')` at the end to maintain O(N) complexity for binary-to-string encoding. For concurrent file system reads, replace `Promise.all` and `.map` with a sequential `for...of` loop executing `await` to maintain flat execution complexity and limit memory load. Also, in React render loops, replace array `.slice()`, `.every()`, and `.some()` chains with single-pass `for` loops to bypass O(N) array copy overhead.
