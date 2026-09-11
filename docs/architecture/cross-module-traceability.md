# Cross-Module Architectural Traceability Manual

## Overview
This document maps component interactions across frontend client apps, backend services, and cloud infra targets. It details interface properties and data pipelines to serve as a clear guide for cross-layer development.

## 1. Frontend Client to Providers (Global State)
- **Providers to UI**: UI components (like `HomeScreen`) consume the global and local context.
- **Components**: The component registry defines how interactive components coordinate without deeply nesting DOM logic.

## 2. Providers to Data Layer
- **Interface**: The data layer connects components to the type definitions in `lib/mold-types.ts` and the mock subject stores in `lib/subject-store.ts`.
- **Properties**:
  - `FullSubjectData` contains configuration payloads, ids, logic sets, and terminology.
  - Core interfaces allow strongly typed mapping across components.

## 3. Data Layer to Persistence Layer (localStorage)
- **Interface**: Data state relies on client-side localStorage via `lib/utils/user-storage.ts`.
- **Core Service Layer**: The central persistence logic manages synchronization through typed interactions defined in `lib/mold-types.ts`.

## 4. UI System & Design Tokens
- **Design Tokens**: The application adheres to Tailwind semantic design tokens (`bg-background`, `text-foreground`, `border-border`, `text-primary`). Font styling utilizes `font-mono` for labels and `font-sans` for standard text flow.
- **Accessibility Integration**: Interfaces include `aria-hidden="true"` on decorative elements and explicitly defined semantic roles for `aria-label` interactions.

## 5. Cloud Infrastructure & Multi-Tenant Dev Targets
- **Target Environments**: Next.js local server via `pnpm dev`. Multi-tenant instances (`tenant-a`, `tenant-b`) run via local orchestration scripts utilizing Docker Compose.
- **Isolation**: Handled gracefully using environment mappings for builds (`NEXT_DIST_DIR=.next-tenant-a`) and specific port delegations (e.g., `3001:3000`).

## Traceability Summary Pipeline
Frontend UI -> Data Types (mold-types) -> Core Service (user-storage) -> Multi-Tenant Docker Sandbox Setup.
