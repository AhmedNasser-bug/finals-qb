# Cross-Module Architectural Traceability

This document maps component interactions across frontend client apps, backend services (persistence layers), and cloud infrastructure targets to create a clear guide for cross-layer development in MOLD V2.

## 1. Frontend Interactions

The frontend is built with Next.js 16 App Router using React Client and Server components. Interactive UI depends heavily on Client Components (`"use client"`).

### Root Components
- **`app/layout.tsx` (RootLayout):** Wraps the application. Contains the `AchievementProvider` context.
- **`app/page.tsx` (Home):** The main entry point that renders the `<HomeScreen />` component.
- **`app/subjects/page.tsx` (SubjectsPage):** Renders the subject selection view.

### Key Interactive Components
- **`HomeScreen`:** Local React state manager for `view`, `runs`, `selectedMode`, and `config`. Triggers the `GameRunner` when a user starts a game session. Rehydrates runs from storage on returning home.
- **`GameRunner`:** The orchestration wrapper for a game session. Mounts the `ToastLayer`, `GameErrorBoundary`, and the `GameEngineProvider`.
- **`GameScreen`:** The main gameplay screen containing `GameHeader`, `QuestionCard`, `GameFooter`, and `ResultsScreen`.
- **`FlashcardScreen`:** Standalone flip-card UI for flashcards mode, which bypasses the standard `GameEngineProvider`.

### Custom Hooks
- **`useGameEngine`:** Drives the real-time `GameState` (phase, current index, score, elapsed time, etc.). Exposed by `GameEngineProvider`. Only accessible within its context tree.
- **`useAchievements`:** Exposes achievement state, unlock evaluations, and persistence actions. Exposed by `AchievementProvider`.
- **`useAchievementToast`:** Exposes toaster functionality for achievement unlocks.

## 2. Backend/Persistence Services

MOLD V2 currently uses local browser storage for persistence, establishing explicit asynchronous interfaces designed for a future upgrade to IndexedDB or a server-side API.

### Storage Pipelines
- **Run History (`localStorage: mold_v2_runs`):**
  - Managed by the `HomeScreen` component.
  - Hydration: `setRuns(loadRuns())` runs on component mount.
  - Data shape: `RunRecord[]` (capped at 50 runs).
- **Achievements (`localStorage: mold_v2_achievements`):**
  - Managed by the `AchievementProvider` in `achievement-engine.tsx`.
  - Hydration: `loadAchievements().then(setAchievements)` runs on mount.
  - Saving: Unlocks are stored via `checkNewUnlocks()` in the `onGameComplete()` handler.
- **Active Subject State:**
  - Handled by `active-subject-store.ts` and `subject-store.ts`. Subjects adhere to the `FullSubjectData` contract defined in `lib/mold-types.ts`.

## 3. Cloud/Infra Targets

The infrastructure target primarily relies on Docker for a multi-tenant sandbox environment for developers.

### Sandbox Orchestration
- **Docker Compose (`docker-compose.yml`):**
  - Provisions an isolated multi-tenant Node sandbox environment (`tenant-a` and `tenant-b`).
  - Utilizes `node:alpine` base images.
  - Isolates Next.js build directories (`NEXT_DIST_DIR=.next-tenant-a`) via environment variables to prevent volume mounting collisions.
  - Port mappings point to unique host ports (e.g., `3001` and `3002` mapping to container port `3000`).

### Workspace Initialization
- **`scripts/setup/setup.sh`:**
  - Idempotent script for workspace bootstrapping.
  - Installs dependencies (with `corepack enable pnpm` fallback).
  - Copies `.env.local` configurations.
  - Seeds a multi-tenant initial `.data/seeds/default-tenant.json` JSON state.
  - Can spin up the `docker-compose` environment seamlessly when triggered with the `--multi-tenant` flag.
