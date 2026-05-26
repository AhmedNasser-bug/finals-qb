# Data Contracts & Interfaces

All primary data contracts are defined in `lib/mold-types.ts`.

- **FullSubjectData**: The primary external schema for subject definitions.
  ```typescript
  interface FullSubjectData {
    id: string;
    name: string;
    config: { title: string; description: string; storageKey?: string; ... };
    questions: Question[];
    flashcards: Flashcard[];
    terminology: Terminology;
    achievements: RawAchievementDef[];
  }
  ```

- **RunRecord**: Represents a completed session.
  ```typescript
  interface RunRecord {
    id: string;
    date: string;
    mode: GameModeId;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeTaken: number;
    streak: number;
    grade: LetterGrade;
  }
  ```

- **Achievement**: Schema for achievements including dynamic conditions mapped from subject data.