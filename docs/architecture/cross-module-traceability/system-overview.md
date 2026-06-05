# System Overview

## Cross-Module Traceability

This document maps the architectural component interactions across frontend client apps, backend services, and cloud infra targets.

### Frontend Client Apps & Next.js App Router
The frontend application uses Next.js 16 with the App Router.
- `app/layout.tsx`: The root layout of the application, managing global styles and context providers.
- `app/page.tsx`: The home page module where initial routing and interaction happens.
- `app/subjects/page.tsx`: Subject management page.
- Domain-specific components are localized in `components/mold/` (e.g. `HomeScreen`, `GameRunner`, `SubjectImporter`).

### State Management & Contexts
State dependencies and core logics flow from contexts and stores:
- `lib/game-engine.tsx`: Provides the `useGameEngine` hook and `GameEngineProvider` context, driving game state reducer and timers.
- `lib/achievement-engine.tsx`: Provides the `useAchievements` hook and `AchievementProvider` context, evaluating conditions and unlocking logic.
- `active-subject-store.ts`: Stores the active subject in the session scope.
- `subject-store.ts`: Handles the local subject inventory state.

### Cloud Infrastructure Targets
The multi-tenant sandbox environment leverages Docker.
- `docker-compose.yml`: Defines the local developer multi-tenant containers via `node:alpine`. Instances like `tenant-a` and `tenant-b` boot Next.js in development mode.
- Persistent volumes are mapped to Next.js host environments avoiding direct container lock-ins.

### Interaction Flow
1. Next.js server components render the skeleton.
2. The user interacts with Client Components. Contexts from `lib/game-engine.tsx` and stores like `active-subject-store.ts` mutate based on actions.
