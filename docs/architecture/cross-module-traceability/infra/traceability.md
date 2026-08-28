# Infrastructure Traceability

## Cloud Infrastructure Targets
The multi-tenant sandbox environment leverages Docker.
- `docker-compose.yml`: Defines the local developer multi-tenant containers via `node:alpine`. Instances like `tenant-a` and `tenant-b` boot Next.js in development mode.
- Persistent volumes are mapped to Next.js host environments avoiding direct container lock-ins.

## Component Interaction Mapping
- **Docker Multi-Tenant Sandbox**: Containerized tenants mount isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) avoiding state bleeding across the local orchestrator environments.

## Data Persistence Pipeline
`lib/subject/subject-persistence.ts` operates as the primary data pipeline bridging active memory and browser storage constraints.
- `validateSubjectData(raw: unknown)`: Secures inbound JSON parsing constraints, avoiding schema mismatch.
- `loadSubjects()` and `saveSubjects()`: Interfacing points with Next.js environment mapping directly to local persistence layers.
