⚡ Bolt: Cache client-side fetches in page.tsx

**What**
Implemented a module-level `Promise` cache (`exampleFetchCache`) in `app/page.tsx` for client-side fetches of JSON examples. The `fetchExample` function now checks this cache before executing the network request, storing the resulting promise for subsequent calls.

**Why**
In React 18 Strict Mode, components often double-mount on initial load, causing `useEffect` hooks to run twice. Additionally, navigating back to a previously loaded example subject would trigger a duplicate network request and JSON parsing cycle. By caching the fetch promise, we deduplicate these requests, saving network bandwidth and CPU cycles.

**Impact**
Reduces redundant network calls and parsing overhead for identical example fetches. The fix specifically prevents duplicate calls during the React Strict Mode double-render cycle and subsequent client-side navigations to the same example module.

**Measurement**
Direct benchmarking within the terminal environment is impractical for this specific optimization, as measuring React's double-mounting behavior requires a full browser environment with network interception/mocking to accurately track the deduplication of requests. However, by caching the promise itself (rather than just the response), this change conceptually eliminates all duplicate network requests, ensuring only a single flight for any given example JSON file.
