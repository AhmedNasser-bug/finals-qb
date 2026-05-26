# Log PII Masking & Structural JSON Integrity

## 1. Context & Vulnerability
*   **Issue:** Traditional regex-based secret/PII scrubbers often replace values globally or match wildcards that swallow surrounding quotes (`"`), colons (`:`), commas (`,`), or curly braces (`{}`). This mutilates log statements, rendering them invalid JSON blocks and breaking downstream log-aggregation parsing.
*   **Engineering Rule:**
    *   **Always** implement log-sanitizing filter patterns in `lib/logger.ts` using declarative capture-group matching structures.
    *   Match the exact boundary of the string value (e.g. `(secret|token|password":\s*")([^"]*)(")`) and replace only the payload capture group, leaving JSON syntax characters entirely preserved.
    *   **Never** use greedy wildcard matched replacements that slice structure syntax symbols.
