# 2. Interface Properties

This document maps the interface properties and data pipelines for the application.

### Core Data Models
Defined heavily in `lib/types/mold-types.ts`, the principal models dictating the domain boundaries are:
- `FullSubjectData`: Represents the fully hydrated model of a subject being tested or managed.
- `Question`: Defines varying structures like MCQ (`MCQOption`) or TrueFalse questions.
- `GameState`: The current atomic instance of a game run, capturing `GamePhase`, active scores, and timelines.
- `AchievementCondition`: Logical evaluations determining progression capabilities.
- `Terminology`: Used for learning modes, detailing specific concepts or terms (`TerminologyEntry`).

### Interface Contracts
- **Subject Validation Interface (`SubjectSchema`)**: Validates inbound JSON to ensure the structure strictly conforms to the `FullSubjectData` type, guaranteeing stability across the persistence layer.
- **Game Engine Dispatch Interface**: Component interactions dispatch structured objects (e.g. `{ type: 'ANSWER', payload: ... }`) ensuring predictability within the reducer pipeline.

## Interface Class Diagram

```mermaid
classDiagram
    class FullSubjectData {
        +String id
        +String name
        +Config config
        +List~Question~ questions
        +List~Flashcard~ flashcards
        +Terminology terminology
        +List~RawAchievementDef~ achievements
    }

    class Question {
        +String id
        +String type
        +String difficulty
        +String category
        +String question
        +List~MCQOption~ options
        +String answer
        +String explanation
        +String hint
    }

    class GameState {
        +String phase
        +Number score
        +Number wrongAnswers
        +Number currentStreak
        +Number bestStreak
        +List~RunRecord~ runs
    }

    FullSubjectData "1" *-- "many" Question
    GameState --> Question : Active Q
```
