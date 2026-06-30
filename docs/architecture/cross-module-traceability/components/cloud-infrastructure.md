# Cloud Infrastructure Targets

The multi-tenant sandbox environment leverages Docker.
- `docker-compose.yml`: Defines the local developer multi-tenant containers via `node:alpine`. Instances like `tenant-a` and `tenant-b` boot Next.js in development mode.
- Persistent volumes are mapped to Next.js host environments avoiding direct container lock-ins.
- Containerized tenants mount isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) avoiding state bleeding across the local orchestrator environments.
