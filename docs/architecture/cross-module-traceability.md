# Cross-Module Architectural Traceability Manual

This document maps component interactions across frontend client apps, backend services, and cloud infra targets. It provides a clear guide for cross-layer development, detailing interface properties and data pipelines.

## 1. Frontend Architecture (Next.js & React)

The frontend uses Next.js with the App Router, separating static server components and interactive client islands (`"use client"`).

### Core Layout & Routing
- **App Router Entry Points:** `app/page.tsx` and nested routes like `app/subjects/page.tsx` provide the routing layer.
- **Shared Layouts:** Found in `components/mold/layouts/` (e.g., `default-sidebar-layout.tsx`, `zen-focus-layout.tsx`). `BasePageWrapper` is utilized to share standard wrapper HTML.

### Interactive UI Islands
- **Game Engine:** Handled via providers like `GameEngineProvider` (`lib/game/game-engine.tsx`) and consumed by components like `GameRunner` and `QuestionCard`.
- **Subject Selectors:** Managed by `components/mold/subject/subject-selector.tsx` which interacts with client routing and hash parameters for share links.

## 2. State & Data Pipelines

Data within the frontend relies extensively on client-side storage, with strict structures defined by TypeScript interfaces.

### MOLD Types & Models
- **Source of Truth:** All core structures (`GameState`, `RunRecord`, `FullSubjectData`, `Question`) are defined in `lib/types/mold-types.ts`. Any modifications to these types must remain backwards compatible.

### Persistence Layer
- **Client Storage:** Data is stored in the browser's `localStorage` via utility wrappers in `lib/utils/user-storage.ts`.
- **Service Logic:** The logic coordinating data reads/writes and state hydration is located in `lib/subject/subject-persistence.ts` and `lib/subject/subject-store.ts`.

## 3. Local Services & Container Orchestration

To emulate production and enable isolated tenant development, the project utilizes Docker Compose.

### Multi-Tenant Sandbox
- **Definition:** `docker-compose.yml` spins up separate environments (e.g., `tenant-a`, `tenant-b`).
- **Configuration:** Each tenant is configured with independent build directories (`NEXT_DIST_DIR`) mapped via environment variables to prevent build cache collisions.
- **Bootstrapping:** The environment is seeded and initialized automatically via the idempotent `scripts/bootstrap.sh` script, which handles dependency checks, `.env` generation, mock database seeding (`.data/seeds/default-tenant.json`), and container orchestration (`docker-compose up`).

## 4. Cross-Module Data Flow Example

1. **User Interaction:** A user uploads a subject file in `SubjectImporter` (`components/mold/subject/subject-importer.tsx`).
2. **Validation:** The payload is parsed and recovered if needed, using decouple auto-fix architectures before strict schema validation.
3. **Persistence:** `SubjectPersistence` stores the valid `FullSubjectData` into `localStorage` via `UserStorage`.
4. **State Hydration:** `SubjectStore` updates, triggering a re-render in `SubjectSelector` to display the newly added module.
