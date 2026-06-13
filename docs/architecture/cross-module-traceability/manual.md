# Cross-Module Architectural Traceability Manual

## 1. System Overview & Cloud Infrastructure Targets
The system relies on Docker multi-tenant sandbox containers (e.g., `tenant-a`, `tenant-b`).
- **Data Pipelines:** Persistent volumes map to Next.js host environments, cleanly isolating `.next` output directories (`.next-tenant-a`, `.next-tenant-b`) via `NEXT_DIST_DIR` to prevent cross-tenant build collisions.

## 2. Frontend Client Apps (Next.js App Router)
- **`app/layout.tsx` (Layout Module):**
  - **Routing State:** Next.js App Router (strict server-components by default). No dynamic lazy-loading.
  - **Interface Properties:** Children slots for rendering the app structure.
  - **Data Pipeline:** Bootstraps global contexts and styling.

- **`app/page.tsx` & `app/subjects/page.tsx`:**
  - **Routing State:** Handles primary interactions and hash routing (e.g., `#share=...` for subjects).
  - **Data Pipeline:** Client hydration islands are explicitly marked with `"use client"`. Heavy components use Next.js dynamic imports (`next/dynamic`) to split Turbopack chunks.

## 3. Backend Services & State Contexts (Data Pipelines)
- **Game Engine (`lib/game-engine.tsx`):**
  - **Interface Properties:** Provides `GameEngineProvider` context and `useGameEngine` hook.
  - **Data Pipeline:** Drives game state reducers and timers ephemerally.

- **Achievement Engine (`lib/achievement-engine.tsx`):**
  - **Interface Properties:** Provides `AchievementProvider` context and `useAchievements` hook.
  - **Data Pipeline:** Evaluates conditions across run data and unlocks achievements persistently.

- **Stores (`active-subject-store.ts` & `subject-store.ts`):**
  - **Interface Properties:** Hooks like `useSubjectStore`.
  - **Data Pipeline:** Handles local subject inventory state and stores active session subjects.

- **Persistence Interfaces (Local Storage Manager):**
  - **Data Pipeline:** Client components read/write persistent states down into browser `localStorage`, bridging the client React tree with offline persistence. Server Actions provide structured API points.

## 4. Interaction Flow Map
1. **Initial Load:** Next.js Server Components skeleton renders.
2. **Hydration & State Mutators:** User interacts with UI; contexts (`useGameEngine`, `useSubjectStore`) trigger state mutations.
3. **Persistence Sink:** State changes are synchronized asynchronously to `localStorage` ensuring offline availability.
