# State Management & Contexts

State dependencies and core logics flow from contexts and stores:

- `lib/game-engine.tsx`: Provides the `useGameEngine` hook and `GameEngineProvider` context, driving the game state reducer, tracking phases, scores, streaks, and driving timers.
- `lib/achievement-engine.tsx`: Provides the `useAchievements` hook and `AchievementProvider` context, evaluating game completion states against conditions to process unlocking logic.
- `lib/subject/active-subject-store.ts`: Stores the active subject in the session scope.
- `lib/subject/subject-store.ts`: Handles the local subject inventory state, loading subjects from memory or persistence.

## Game State Reducer Pipeline
Within `lib/game-engine.tsx`, state mutations operate within a unidirectional data flow. Actions such as answer selections trigger state shifts that are then broadcasted back up to listeners mapped via `useGameEngine`.
