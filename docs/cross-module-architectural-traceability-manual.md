# Cross-Module Architectural Traceability Manual

## Overview
This manual maps component interactions across frontend client apps, backend services, and cloud infra targets. It documents interface properties and data pipelines to create a clear guide for cross-layer development.

## 1. Frontend Client Apps

### Components
* `components/mold/`
  * UI components (e.g., `game-header.tsx`, `game-runner.tsx`)
  * Data display and interaction
* `app/`
  * Next.js pages and routing
  * Page layouts and root components

### Data Pipeline
* `lib/` contains the logic and types:
  * `active-subject-store.ts`, `subject-store.ts`: State management for subjects
  * `achievement-engine.tsx`, `game-engine.tsx`: Game logic providers
  * `subject-persistence.ts`, `subject-sharing.ts`: Storage integration

### Storage Integration
* Uses `localStorage` and `sessionStorage` for data persistence
  * `mold_v2_runs`: Run history
  * `mold_v2_achievements`: Achievements
  * `mold_v2_active_subject`: Active subject state
* Allows future migration to IndexedDB or backend APIs

## 2. Interface Properties

* Interfaces and types are defined in `lib/mold-types.ts`
* Defines types for `RunRecord`, `Achievement`, `FullSubjectData`, etc.

## 3. Interaction Map

* Data flows from `localStorage` -> Providers (`useAchievements`, `useGameEngine`) -> UI Components.
* UI components dispatch actions (e.g., `SELECT_OPTION`, `REVEAL_ANSWER`) to update state within providers.
* State changes trigger re-renders or persistence updates.
