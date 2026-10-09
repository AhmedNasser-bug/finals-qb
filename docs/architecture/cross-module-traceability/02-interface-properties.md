# State Architecture

## Interfaces and Data Pipelines

This document maps the interface properties and data pipelines for the MOLD V2 application.

### Core Data Models
Defined heavily in `lib/types/mold-types.ts`, the principal models dictating the domain boundaries are:
- `FullSubjectData`: Represents the fully hydrated model of a subject being tested or managed. Includes `id`, `name`, `questions`, `flashcards`, `terminology`, and `config`. Used as the atomic data unit that the entire frontend depends upon.
- `Question`: Defines varying structures like MCQ (`MCQOption`) or TrueFalse questions. Extends from a base model mapping core properties like `id`, `question`, `answer`, `explanation`, and `difficulty`.
- `GameState`: The current atomic instance of a game run, capturing `GamePhase`, active scores (`score`), timelines (`elapsedSeconds`), streak counters, and index pointers for rendering current questions.
- `AchievementCondition`: Logical evaluations determining progression capabilities. Used heavily in the `AchievementEngine`.
- `Terminology`: Used for learning modes, detailing specific concepts or terms (`TerminologyEntry`).

### Interface Properties
- **Subject Validation Interface (`SubjectSchema`)**: Validates inbound JSON to ensure the structure strictly conforms to the `FullSubjectData` type, guaranteeing stability across the persistence layer.
- **Game Engine Dispatch Interface**: Component interactions dispatch structured objects (e.g. `{ type: 'ANSWER', payload: ... }`) ensuring predictability within the reducer pipeline.
