# Cross-Module Traceability Manual

This document maps component interactions across frontend client apps, backend services, and cloud infra targets.
It also documents interface properties and data pipelines to create a clear guide for cross-layer development.

## 1. Frontend Client Apps (Next.js App Router)
- **App Router Pages**: Located in `app/`, handles routing and layouts (`page.tsx`, `layout.tsx`).
- **UI Components**:
  - Standard UI components are in `components/ui/` (shadcn/ui).
  - Specialized components are in `components/mold/` for core application features.

## 2. Backend Services & Data Pipelines
- **Data Persistence Layer**: Data persistence relies heavily on client-side `localStorage` via `lib/utils/user-storage.ts`.
- **Core Service Logic**: Found in `lib/subject/subject-persistence.ts`.
- **Centralized Models**: Defined in `lib/types/mold-types.ts`.

## 3. Cloud Infra Targets
- Local environments managed by Docker Compose (`docker-compose.yml`) for multi-tenant setup.
