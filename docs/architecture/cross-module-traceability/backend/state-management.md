# State Management and Backend

This document details state management and its relation to backend services.

## State Management & Contexts
State dependencies and core logics flow from contexts and stores:
- `lib/game-engine.tsx`: Provides the `useGameEngine` hook and `GameEngineProvider` context, driving game state reducer and timers.
- `lib/achievement-engine.tsx`: Provides the `useAchievements` hook and `AchievementProvider` context, evaluating conditions and unlocking logic.
- `active-subject-store.ts`: Stores the active subject in the session scope.
- `subject-store.ts`: Handles the local subject inventory state.

## Backend Services
Next.js Server Components handle secure, pre-rendered HTML delivery. Server Actions (if any) provide structured API points.

## Game State Reducer Pipeline
Within `lib/game-engine.tsx`, state mutations operate within a unidirectional data flow. Actions such as answer selections trigger state shifts that are then broadcasted back up to listeners mapped via `useGameEngine`.