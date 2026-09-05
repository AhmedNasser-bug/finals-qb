# Cross-Module Architectural Traceability Manual

## Overview
This manual maps component interactions across frontend client apps, backend services, and cloud infrastructure targets, detailing interface properties and data pipelines.

## Frontend Clients
- **Entry Points:** `app/page.tsx` renders `HomeScreen` with independent contexts: `AchievementProvider`, `GameEngineProvider`.
- **State Management:** Ephemeral game state via `GameEngineProvider`; persistent unlocked achievements via `AchievementProvider`.
- **UI Components:** Shadcn/ui components customized with Tailwind tokens (e.g., `--primary: amber-500`).

## Backend Services
- **Data Persistence:** Client-side `localStorage` abstraction via `lib/subject/subject-persistence.ts`.
- **Game Engine:** Handled by `lib/game/game-engine.tsx` managing scores, streaks, and flow logic.
- **Achievement Logic:** Triggered by `onGameComplete` and evaluated via `lib/achievement/achievement-engine.tsx`.

## Cloud Infrastructure Targets
- **Deployments:** Docker Compose driven for multi-tenant isolation (`tenant-a` on 3001, `tenant-b` on 3002).
- **Environment Management:** Managed by orchestrator scripts injecting explicit output directories (`NEXT_DIST_DIR`).
