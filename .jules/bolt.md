# Bolt Performance Learnings

- Replacing unbuffered `fs.readFileSync` with block streaming via `fs.createReadStream` mitigates quadratic latency regressions in large JSON parsing workflows (such as `.test.ts` fixtures).
- **Asynchronous Testing Beware**: When replacing synchronous reads with asynchronous block streams in Jest tests, always ensure the test function is strictly `async` and uses `await new Promise(...)` to prevent the test suite from exiting prematurely and suppressing hidden failures.
- In `telemetry-kernel.ts`, combining multiple successive `.reduce()` / `.filter()` / `.forEach()` array iterations over datasets into a single O(N) iterative `for` loop significantly improves computational efficiency and avoids $O(N*M)$ complexity spikes during matrix aggregation.
