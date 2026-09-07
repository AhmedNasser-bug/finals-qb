# Cross-Module Architectural Traceability Manual

## 1. System Topology Overview
The architecture is divided into three primary layers, ensuring a separation of concerns and localized responsibilities:
- **Frontend Client:** A Next.js React application operating exclusively in the browser context, providing the interactive user interface and managing local state using `localStorage`.
- **Backend Services (API/BFF):** Node.js logic embedded inside Next.js Server Components and Server Actions. These services handle secure business logic, data formatting, and interfacing with external resources.
- **Cloud Infrastructure & Persistence:** Multi-tenant container orchestration handled by Docker Compose, managing localized sandbox instances and external database connections.

## 2. Component Interactions & Sequence Flows
Interactions between these layers follow a unidirectional data flow to maintain state consistency.

### Client-to-Server Flow
1. **User Action:** A user interacts with a React Component in `app/`.
2. **Local Storage Handler:** The action may immediately optimistically update local state via abstraction handlers like `lib/utils/user-storage.ts`.
3. **Server Action Invocation:** The client triggers a Next.js Server Action (e.g., in `app/actions.ts`) containing the necessary payload.
4. **Service Layer Processing:** The Server Action delegates processing to core service logic (e.g., `lib/subject/subject-persistence.ts`), which validates the payload against centralized models.
5. **Data Persistence:** The service layer interacts with the underlying database or multi-tenant target via Prisma or direct queries.
6. **Response:** The Server Action returns a structured response to the client component.

### Server-to-Client Flow (Data Fetching)
1. **Server Component Loading:** A Next.js Server Component (e.g., `app/page.tsx`) initiates a data fetch during the rendering lifecycle.
2. **Service Layer Invocation:** The component calls functions in the service layer (e.g., `lib/subject/subject-store.ts`) to retrieve data.
3. **Model Resolution:** The service layer fetches data from the persistent store and maps it to strongly typed models defined in `lib/types/mold-types.ts`.
4. **Prop Injection:** The resolved models are passed as props to the Client Components.

## 3. Data Pipelines & Interface Properties
To ensure type safety across the stack, all data pipelines utilize shared interface definitions.

### Centralized Models (`lib/types/mold-types.ts`)
This file is the single source of truth for entity definitions. Key interfaces include:
- `SubjectData`: Defines the core structure of a learning module.
- `GameMode`: Outlines the configuration for different practice and quiz modes.
- `RunRecord`: Tracks historical performance metrics for user telemetry.

### Storage Abstractions (`lib/utils/user-storage.ts`)
This module provides a unified API for client-side persistence, abstracting away the raw `localStorage` API.
- **Key Methods:** `loadRuns()`, `saveRuns()`, `hasClerk`
- **Responsibilities:** Automatic JSON parsing, error handling, and capping the maximum number of stored records to prevent bloat.

### Service Layer (`lib/subject/`)
This directory contains the business logic that bridges the UI and the persistent data store.
- **Key Files:** `subject-persistence.ts`, `subject-store.ts`
- **Responsibilities:** CRUD operations, data validation against `mold-types.ts`, and orchestrating multi-tenant data isolation.

## 4. Multi-Tenant Orchestration
The local development environment uses Docker Compose to simulate cloud infrastructure targets.
- **Docker Compose (`docker-compose.yml`):** Defines distinct services (e.g., `tenant-a`, `tenant-b`) running isolated instances of the application on different ports.
- **Bootstrap Script (`scripts/orchestration/bootstrap.sh`):** An idempotent shell script that initializes the local environment, seeds mock data, and spins up the multi-tenant containers.
