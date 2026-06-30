# State Management & Contexts

State dependencies and core logics flow from contexts and stores:
- `lib/game-engine.tsx`: Provides the `useGameEngine` hook and `GameEngineProvider` context, driving game state reducer and timers.
- `lib/achievement-engine.tsx`: Provides the `useAchievements` hook and `AchievementProvider` context, evaluating conditions and unlocking logic.
- `active-subject-store.ts`: Stores the active subject in the session scope.
- `subject-store.ts`: Handles the local subject inventory state.
