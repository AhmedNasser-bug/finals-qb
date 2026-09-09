# Cross-Module Architectural Traceability Manual

## Overview
This manual maps component interactions across frontend client apps, backend services, and cloud infra targets. It documents interface properties and data pipelines to create a clear guide for cross-layer development.

## 1. Frontend Client Apps
- **Next.js App Router**: Utilizes Next.js App Router for strict server-components by default.
- **Client Hydration**: Interactive islands and global state providers are explicitly marked with `"use client"` to cleanly split static and hydrated content.
- **Global Context Providers**:
  - `AchievementProvider` (`lib/achievement-engine.tsx`): Manages persistent achievements and unlock evaluation; survives navigation.
  - `GameEngineProvider` (`lib/game-engine.tsx`): Manages ephemeral game state, question pool, and timer; mounted per session.

## 2. Backend Services & Data Persistence
- **Storage Interface**: Data persistence primarily relies on client-side `localStorage` via `lib/utils/user-storage.ts`.
- **Async Interface**: Methods like `loadRuns()`, `saveRuns()` are exported from `lib/utils/user-storage.ts` and are async to support future migration to IndexedDB or a Server API.
- **Data Models**: Centralized in `lib/mold-types.ts`, which serves as the single source of truth for types and game mode registries.

## 3. Data Pipelines & Flow
- **State Flow**: Providers (global state) -> Components (consume with hooks) -> Engines (game-engine, achievement-engine) -> Data Layer (mold-types, subject-store) -> Persistence (localStorage) -> UI System.
- **Game Lifecycle**: `GameEngineProvider` builds the initial state. On game complete, the `achievement-engine` loads current achievements, evaluates unlocks, and persists back to storage.
