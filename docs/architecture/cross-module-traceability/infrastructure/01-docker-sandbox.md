# Cloud Infrastructure Targets & Multi-Tenant Sandbox

The multi-tenant sandbox environment leverages Docker.

- `docker-compose.yml`: Defines the local developer multi-tenant containers via `node:alpine`. Instances like `tenant-a` and `tenant-b` boot Next.js in development mode.
- Persistent volumes are mapped to Next.js host environments, bypassing container lock-ins by routing output to `.next-tenant-a`, etc.
- `NEXT_DIST_DIR`: An environment variable allowing instances to use distinct Next.js build directories dynamically.

## Component Interaction Mapping
- **Docker Multi-Tenant Sandbox**: Containerized tenants mount isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) avoiding state bleeding across the local orchestrator environments.
