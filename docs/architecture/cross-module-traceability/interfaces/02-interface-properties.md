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

### Interface Properties
- **Subject Validation Interface (`SubjectSchema`)**: Validates inbound JSON to ensure the structure strictly conforms to the `FullSubjectData` type, guaranteeing stability across the persistence layer.
- **Game Engine Dispatch Interface**: Component interactions dispatch structured objects (e.g. `{ type: 'ANSWER', payload: ... }`) ensuring predictability within the reducer pipeline.

### External API Interfaces
- **RevenueCat Integration**: Uses `NEXT_PUBLIC_REVENUECAT_API_KEY` for authenticating server-side requests to `api.revenuecat.com/v1/subscribers/`.
- **URL Shortener API**: `lib/utils/url-shortener.ts` interfaces with the shrtco.de free API to generate short links for subject sharing.

### Storage and Persistence Interfaces
- **StorageAdapter Interface**: Abstracted interface (`lib/utils/user-storage.ts`) priming for backend databases like Firebase Firestore, currently implemented via `localStorage` for runs and achievements.
