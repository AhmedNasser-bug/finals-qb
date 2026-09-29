# Cross-Module Architectural Traceability Manual

## Overview
This document maps component interactions across frontend client apps, backend services, and storage elements to create a clear guide for cross-layer development.

## 1. Entry & Routing (Next.js)
- **`app/layout.tsx`**: Root provider wrapper, handles global styles, typography (Geist), and cross-cutting providers.
- **`app/page.tsx`**: Mounts the primary application view (`<HomeScreen />`).

## 2. State Management & Providers
State is compartmentalized into specific React Context providers:
- **`AchievementProvider`**: Persisted achievements, unlock evaluation, global scope.
- **`GameEngineProvider`**: Ephemeral game state, question pool, timer; scoped to active session.
- **`HomeScreen`**: Local state for view, runs, mode selection, config.

## 3. UI Component Hierarchy
- UI components utilize `shadcn/ui` primitives styled with Tailwind CSS.
- **Views**: Divided into Home view (setup panel, stats) and Game view (GameRunner wraps GameEngineProvider → GameRunnerInner → header/card/footer).
- **Modals**: Achievement gallery, toast notifications, error boundary.
- Components consume global tokens via variables configured in `app/globals.css`.

## 4. Game Logic & Engines
- **`game-engine.tsx`**: Question pool builder, state reducer, turn-based flow, timer tick.
- **`achievement-engine.tsx`**: Condition evaluator, unlock checker, localStorage sync.

## 5. Data & Types
- **`lib/mold-types.ts`**: Single source of truth for all types, utility functions, game mode registry.
- **`lib/subject-store.ts`**: Demo question bank, flashcards, terminology, achievements.

## 6. Persistence & Storage
- Current local development defaults to `localStorage` (Keys: `mold_v2_runs`, `mold_v2_achievements`).
- An async interface is ready for IndexedDB/server migration.
