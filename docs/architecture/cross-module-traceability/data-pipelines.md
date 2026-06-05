# Data Pipelines

This document maps the interface properties and data pipelines for the cross-module communication within the MOLD V2 application.

## Interfaces

Defined heavily in `lib/types/mold-types.ts`, the principal models dictating the domain boundaries are:
- `FullSubjectData`: Represents the fully hydrated model of a subject being tested or managed.
- `Question`: Defines varying structures like MCQ (`MCQOption`) or TrueFalse questions.
- `GameState`: The current atomic instance of a game run, capturing `GamePhase`, active scores, and timelines.
- `AchievementCondition`: Logical evaluations determining progression capabilities.
- `Terminology`: Used for learning modes, detailing specific concepts or terms (`TerminologyEntry`).

### Interface Properties
- **Subject Validation Interface (`SubjectSchema`)**: Validates inbound JSON to ensure the structure strictly conforms to the `FullSubjectData` type, guaranteeing stability across the persistence layer.
- **Game Engine Dispatch Interface**: Component interactions dispatch structured objects (e.g. `{ type: 'ANSWER', payload: ... }`) ensuring predictability within the reducer pipeline.

## State Pipelines

### Data Persistence Pipeline
`lib/subject/subject-persistence.ts` operates as the primary data pipeline bridging active memory and browser storage constraints.
- `validateSubjectData(raw: unknown)`: Secures inbound JSON parsing constraints, avoiding schema mismatch.
- `loadSubjects()` and `saveSubjects()`: Interfacing points with Next.js environment mapping directly to local persistence layers.

### Game State Reducer Pipeline
Within `lib/game-engine.tsx`, state mutations operate within a unidirectional data flow. Actions such as answer selections trigger state shifts that are then broadcasted back up to listeners mapped via `useGameEngine`.

### State Management & Contexts
State dependencies and core logics flow from contexts and stores:
- `lib/game-engine.tsx`: Provides the `useGameEngine` hook and `GameEngineProvider` context, driving game state reducer and timers.
- `lib/achievement-engine.tsx`: Provides the `useAchievements` hook and `AchievementProvider` context, evaluating conditions and unlocking logic.
- `active-subject-store.ts`: Stores the active subject in the session scope.
- `subject-store.ts`: Handles the local subject inventory state.
