# State Architecture

## Interfaces and Data Pipelines

This document maps the interface properties and data pipelines for the application.

### Core Data Models
Defined heavily in `lib/types/mold-types.ts`, the principal models dictating the domain boundaries are:
- `FullSubjectData`: Represents the fully hydrated model of a subject being tested or managed.
- `GameState`: The current atomic instance of a game run.
- `AchievementCondition`: Logical evaluations determining progression capabilities.

### Interface Properties
- **Subject Validation Interface (`validateSubjectData`)**: Validates inbound JSON to ensure the structure strictly conforms to the `FullSubjectData` type, guaranteeing stability across the persistence layer in `lib/subject/subject-persistence.ts`.
- **Game Engine Dispatch Interface**: Component interactions dispatch structured objects ensuring predictability within the reducer pipeline.
- **Cross-Layer Data Transfer**: APIs and Server Actions strictly type payloads aligning to models exported in `lib/types/mold-types.ts`.
