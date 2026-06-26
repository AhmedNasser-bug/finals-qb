# Interfaces and Data Pipelines

## Core Data Models
Defined heavily in `lib/types/mold-types.ts`, the principal models dictating the domain boundaries are:
- **`FullSubjectData`**: Represents the fully hydrated model of a subject being tested or managed.
- **`Question`**: Defines varying structures like MCQ (`MCQOption`) or TrueFalse questions.
- **`GameState`**: The current atomic instance of a game run, capturing `GamePhase`, active scores, and timelines.
- **`AchievementCondition`**: Logical evaluations determining progression capabilities.
- **`Terminology`**: Used for learning modes, detailing specific concepts or terms (`TerminologyEntry`).

## Interface Properties
- **Subject Validation Interface (`SubjectSchema`)**: Validates inbound JSON to ensure the structure strictly conforms to the `FullSubjectData` type, guaranteeing stability across the persistence layer.
- **Game Engine Dispatch Interface**: Component interactions dispatch structured objects.

## Data Persistence Pipeline
`lib/subject/subject-persistence.ts` operates as the primary data pipeline bridging active memory and browser storage constraints.
- **`validateSubjectData(raw: unknown)`**: Secures inbound JSON parsing constraints, avoiding schema mismatch.
- **`loadSubjects()`** and **`saveSubjects()`**: Interfacing points with Next.js environment mapping directly to local persistence layers.
