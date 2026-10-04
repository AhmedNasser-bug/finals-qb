# Cross-Module Architectural Traceability Manual

## Overview
This manual maps component interactions across frontend client apps, backend services, and cloud infrastructure targets, documenting interface properties and data pipelines to serve as a clear guide for cross-layer development.

## 1. Frontend Client Apps
- **Next.js App Router**: Located in `app/`, handles routing, server-rendered layouts (`app/layout.tsx`), and client components.
- **Components**: UI components reside in `components/`, primarily built with React, Radix UI, and Tailwind CSS.
- **State & Context**: Context providers (e.g., `lib/game/game-engine.tsx`, `lib/layouts/layout-context.tsx`) manage shared client state.

## 2. Backend Services & Data Pipelines
- **Server Actions**: Defined in `app/actions.ts` for handling form submissions and data mutations directly from the frontend.
- **Clerk Authentication**: Next.js optimized `ClerkProvider` manages authentication pipelines and user identity.
- **Stores & Persistence**:
  - `lib/subject/subject-persistence.ts`: Manages subject data models and persistence rules.
  - `lib/user-storage.ts`: Handles local/remote user state syncing.

## 3. Cloud Infrastructure Targets
- **Vercel Edge & Serverless**: Configurations reside in `vercel.json` for routing, redirects, and edge functions.
- **Multi-Tenant Docker Sandbox**: Defined in `docker-compose.yml`, uses isolated `.next` output directories (`NEXT_DIST_DIR`) for `tenant-a` and `tenant-b` sandboxing.

## Data Pipelines
1. **Client to Server**: Next.js Server Actions and API routes (proxied via `proxy.ts`).
2. **Telemetry & Cognitive Tracking**: Pipelines in `lib/telemetry/` route user events to respective analytics targets without blocking rendering.
