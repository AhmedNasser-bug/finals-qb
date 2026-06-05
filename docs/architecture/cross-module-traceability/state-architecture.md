# State Architecture

## Interfaces and Data Pipelines

This document maps the interface properties and data pipelines for the MOLD V2 application.

### Core Data Models
Defined heavily in `lib/types/mold-types.ts`, the principal models dictating the domain boundaries are:
- `FullSubjectData`: Represents the fully hydrated model of a subject being tested or managed.
- `Question`: Defines varying structures like MCQ (`MCQOption`) or TrueFalse questions.
- `GameState`: The current atomic instance of a game run, capturing `GamePhase`, active scores, and timelines.
- `AchievementCondition`: Logical evaluations determining progression capabilities.
- `Terminology`: Used for learning modes, detailing specific concepts or terms (`TerminologyEntry`).

### Data Persistence Pipeline
`lib/subject/subject-persistence.ts` operates as the primary data pipeline bridging active memory and browser storage constraints.
- `validateSubjectData(raw: unknown)`: Secures inbound JSON parsing constraints, avoiding schema mismatch.
- `loadSubjects()` and `saveSubjects()`: Interfacing points with Next.js environment mapping directly to local persistence layers.

### Game State Reducer Pipeline
Within `lib/game-engine.tsx`, state mutations operate within a unidirectional data flow. Actions such as answer selections trigger state shifts that are then broadcasted back up to listeners mapped via `useGameEngine`.
