# Cloud Infrastructure Targets

## Docker Multi-Tenant Sandbox
The multi-tenant sandbox environment leverages **Docker** for cloud target simulation.
- **`docker-compose.yml`**: Defines the local developer multi-tenant containers via `node:alpine`. Instances like `tenant-a` and `tenant-b` boot Next.js in development mode.
- **Persistent Volumes**: Mapped to Next.js host environments avoiding direct container lock-ins.
- **Isolated Build Outputs**: Containerized tenants mount isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) dynamically via the `NEXT_DIST_DIR` environment variable. This avoids state bleeding and build collisions across the local orchestrator environments.
- **Mock Data Seeding**: The orchestration relies on dynamically generated per-tenant mock data files (e.g., `.data/seeds/<tenant>.json`) to simulate isolated backend data storage for each instance.
