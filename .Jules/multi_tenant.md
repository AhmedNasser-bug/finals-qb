# Multi-Tenant Isolation & Docker Orchestration

## 1. Context & Isolation
*   **Issue:** In multi-tenant environments, building multiple Next.js apps into a shared directory causes asset collisions, cache corruption, and page routing leaks.
*   **Engineering Rule:**
    *   **Always** isolate different container configurations via custom Next.js build directories (`NEXT_DIST_DIR`).
    *   Docker Compose orchestrations must explicitly map distinct environment directories and variables for each build tenant.
    *   Ensure absolute path traceability in multi-tenant sandboxes.
