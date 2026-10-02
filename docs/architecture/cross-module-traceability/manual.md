# Cross-Module Architectural Traceability Manual

## Overview
This document maps the flow of data and component interactions across the frontend client apps, backend persistence layers, and infrastructure targets within the MOLD V2 architecture. It serves as a traceability guide for developers extending cross-layer features.

---

## 1. Core Component Interactions

The primary interactive loop in the application involves the user engaging with a game session, evaluating rules, and persisting state changes across providers.

### The Game Cycle & Providers

*   **`HomeScreen` (View Layer):** The user begins here, selecting modes and configurations. Local state is managed for the view, while it dynamically polls or pulls from `AchievementProvider`.
*   **`GameEngineProvider` (Ephemeral State):** Mounts exactly once per session via `GameRunner`. It initializes the active session's question pool (pulled from `SubjectStore`), handles timer ticks, and runs the step-by-step game loop (Select Option -> Submit -> Next/Forfeit). When the game is complete (or `onReturnHome` is called), `GameRunner` unmounts, effectively destroying this ephemeral instance.
*   **`AchievementEngine` (Evaluation Logic):** Tied closely with the `onGameComplete` flow. It receives the final ephemeral `GameState` and the historic `RunRecord[]`, then evaluates all game conditions against `checkNewUnlocks`.
*   **`AchievementProvider` (Persistent Global State):** A root-level context provider that outlives any single game session. It stores unlocked `Achievement[]`s and bridges updates to UI toast notifications via `showUnlocks()`.

---

## 2. Persistence & Data Pipelines

The system heavily relies on client-side state abstraction capable of future database migrations. The source of truth for types is `lib/mold-types.ts`.

### Storage Flow

All storage operations sit behind a unified asynchronous interface, currently backed by standard browser `localStorage`.

*   **Game Runs Pipeline (`loadRuns` / `saveRuns`)**
    *   **Data Structure:** `RunRecord[]` (Contains `id`, `date`, `mode`, `score`, `streak`, `grade`).
    *   **Persistence Key:** `mold_v2_runs`
    *   **Behavior:** Runs are appended synchronously upon game completion. `saveRuns` enforces a soft cap (e.g., 50 recent runs) to avoid `localStorage` overflow.

*   **Achievement Pipeline (`loadAchievements` / `saveAchievements`)**
    *   **Data Structure:** `Achievement[]`
    *   **Persistence Key:** `mold_v2_achievements`
    *   **Behavior:** When `AchievementEngine` identifies a new unlock, it assigns an `unlockedAt` timestamp and pushes to this array via `saveAchievements`.

### Mock Data & Seeding
*   **`SubjectStore` (`lib/subject-store.ts`)**: Acts as the local mock provider for initial test cases and fallback demos (`DEMO_FULL_SUBJECT`).
*   **Multi-tenant Seeds:** Bootstrap scripts drop configuration seeds directly into `.data/seeds/default-tenant.json` to configure container-specific settings independently from core code.

---

## 3. Infrastructure & Deployment Targets

Local testing and isolated sandbox targets are orchestrated via standard container definitions and Next.js static optimizations.

*   **Next.js Server / Turbopack:** Builds static and server-rendered chunks into designated output directories (e.g., `NEXT_DIST_DIR`).
*   **Docker Compose Orchestration:**
    *   The platform isolates developer workflows by spinning up specific tenant instances using shared source code.
    *   Volumes map the local repository (`.:/app`) inside the container.
    *   To prevent file locks and collision, builds write to distinct Next directories (e.g., `.next-tenant-a`, `.next-tenant-b`), separated per tenant environment variable.
