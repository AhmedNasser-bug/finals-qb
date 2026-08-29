# Infrastructure Traceability Manual

## Overview
This document outlines cloud infrastructure targets and deployment environments for the application.

## Sandbox Environments
- **Local Dev**: Multi-tenant architecture running via Docker Compose (`docker-compose.yml`).
- **Tenants**: Independent services (e.g., `tenant-a`, `tenant-b`) running Node.js Alpine images.
- **Port Mapping**: Applications exposed on host ports 3001 and 3002 mapping to internal port 3000.
- **Workspace**: Configured via Next.js and `package.json`.
- **Hosting Target**: Designed for Vercel deployment (`vercel.json` exists in root).
