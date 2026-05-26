# Security Constraints & Guidelines

## 1. Server-Side Rendering (SSR) XSS Prevention
*   **Vulnerability Context:** When rendering components on the server (SSR), client-side libraries like `DOMPurify` fail to execute because the global `window` object is `undefined`. Under legacy codebases, this caused fallbacks that rendered raw, unsanitized strings directly via `dangerouslySetInnerHTML`.
*   **Engineering Rule:** 
    *   **Always** import and use `isomorphic-dompurify` for sanitizing HTML markup or questions across both server and client render loops.
    *   **Never** use raw or unsanitized strings in `dangerouslySetInnerHTML`.
    *   **Never** use `typeof window !== "undefined"` fallback branches to bypass sanitization.

## 2. Mermaid Diagram Strict Configuration
*   **Vulnerability Context:** Rendering dynamic user-supplied or AI-generated Mermaid charts can introduce arbitrary script injection vulnerabilities if the security level is relaxed.
*   **Engineering Rule:**
    *   **Always** set `securityLevel: 'strict'` when initializing or configuring any Mermaid diagram rendering settings.
    *   **Never** set security level to `loose` or bypass safe parsing rules.
