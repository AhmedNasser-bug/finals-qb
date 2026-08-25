# Infrastructure Architecture

This document outlines the cloud infrastructure targets and multi-tenant setup.

## Multi-Tenant Sandbox

- Configured via `docker-compose.yml`.
- Next.js build directories (`NEXT_DIST_DIR`) are fully respected and cleanly separated for each tenant to avoid cross-tenant build collisions.
- Bootstrapping is managed by idempotent scripts in `scripts/orchestration/`.
