🎯 **What:**
Fixed a Cross-Site Scripting (XSS) vulnerability caused by bypassing `DOMPurify` sanitization during Server-Side Rendering (SSR) in `components/mold/question-card.tsx` and `components/mold/rich-text.tsx`.

⚠️ **Risk:**
When the React component rendered on the server (SSR), the check `typeof window !== "undefined"` evaluated to false, causing the application to fallback to rendering the unsanitized `part.content` and `question.question` raw strings directly into the DOM using `dangerouslySetInnerHTML`. This could allow an attacker to inject malicious scripts into the page if the payload was server-rendered.

🛡️ **Solution:**
Replaced the client-only `dompurify` package with `isomorphic-dompurify`. This allows the sanitization function to run safely on both the server (Node.js) and the client. The conditional bypass logic was removed entirely, ensuring that the payloads are always sanitized before being injected into the DOM.

Tests successfully complete, and formatting & linting checks were respected in light of the project constraints (no `pnpm format`, `next lint` fails globally on this repo configuration).
