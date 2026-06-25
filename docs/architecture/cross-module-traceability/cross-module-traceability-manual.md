# Cross-Module Traceability Manual

This manual maps the architectural component interactions across frontend client apps, backend services, and cloud infrastructure targets to create a clear guide for cross-layer development.

## **1. Frontend Client Apps & Next.js App Router**

The frontend application uses Next.js 16 with the App Router.
- `app/layout.tsx`: The root layout of the application, managing global styles and context providers (e.g., `AchievementProvider`, `StatsProvider`, `ClerkProvider`).
- `app/page.tsx`: The home page module where initial routing and interaction happens.
- `app/subjects/page.tsx`: Subject management page.
- Domain-specific components are localized in `components/mold/` (e.g. `HomeScreen`, `GameRunner`, `SubjectImporter`).

## **2. State Management & Contexts**

State dependencies and core logics flow from contexts and stores:
- `lib/game-engine.tsx`: Provides the `useGameEngine` hook and `GameEngineProvider` context, driving game state reducer and timers.
- `lib/achievement-engine.tsx`: Provides the `useAchievements` hook and `AchievementProvider` context, evaluating conditions and unlocking logic.
- `lib/active-subject-store.ts`: Stores the active subject in the session scope.
- `lib/subject/subject-store.ts`: Handles the local subject inventory state.

## **3. Cloud Infrastructure Targets**

The multi-tenant sandbox environment leverages Docker.
- `docker-compose.yml`: Defines the local developer multi-tenant containers via `node:alpine`. Instances like `tenant-a` and `tenant-b` boot Next.js in development mode.
- Persistent volumes are mapped to Next.js host environments avoiding direct container lock-ins.
- Containerized tenants mount isolated `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) avoiding state bleeding across the local orchestrator environments.

## **4. Data Pipelines and Interface Properties**

- **Subject Validation Interface (`SubjectSchema`)**: Validates inbound JSON to ensure the structure strictly conforms to the `FullSubjectData` type, guaranteeing stability across the persistence layer.
- **Game Engine Dispatch Interface**: Component interactions dispatch structured objects (e.g. `{ type: 'ANSWER', payload: ... }`) ensuring predictability within the reducer pipeline.
- **Data Persistence Pipeline**: `lib/subject/subject-persistence.ts` operates as the primary data pipeline bridging active memory and browser storage constraints.
  - `validateSubjectData(raw: unknown)`: Secures inbound JSON parsing constraints.
  - `loadSubjects()` and `saveSubjects()`: Map directly to local persistence layers.
- **Game State Reducer Pipeline**: Within `lib/game-engine.tsx`, state mutations operate within a unidirectional data flow. Actions such as answer selections trigger state shifts that are then broadcasted back up to listeners mapped via `useGameEngine`.
