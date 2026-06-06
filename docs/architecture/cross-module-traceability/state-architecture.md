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

*Note: For detailed interface properties, refer to [Interface Properties](./interface-properties.md).*

*Note: For detailed data pipelines, refer to [Data Pipelines](./data-pipelines.md).*
