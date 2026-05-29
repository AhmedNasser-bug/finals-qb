# State Architecture

## 3. State Architecture

State is divided into three domains:

1. **Achievement Engine (`AchievementProvider`)**
   - Lives at the app root, survives navigation.
   - Responsible for tracking and evaluating unlocking conditions.
2. **Global UI/Subject State (`HomeScreen`)**
   - Owns `view`, `runs`, `selectedMode`, `config`, and `showGallery`.
   - Passes `runs` to `GameRunner` for accurate achievement history evaluation.
3. **Game Engine (`GameEngineProvider`)**
   - Ephemeral. Only mounted during gameplay.
   - Contains a reducer handling the game cycle, question pooling, score tracking, and time.

## 4. Data Contracts & Interfaces
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

## 5. Persistence Pipeline
The application currently uses an asynchronous persistence pipeline interfacing with `localStorage`, with an explicit design to support IndexedDB or server-side API swaps.

### Storage Keys (The "Database")

| Key | Type | Storage | Description |
|---|---|---|---|
| `mold_v2_subjects` | `FullSubjectData[]` | `localStorage` | Contains imported subject files. |
| `mold_v2_active_subject` | `string` (ID) | `sessionStorage` | Keeps track of the currently selected subject across lists/home. |
| `mold_v2_runs` | `RunRecord[]` | `localStorage` | Keeps the history of past completed sessions (capped at 50). |
| `mold_v2_achievements` | `Achievement[]` | `localStorage` | The user's achievement unlocks merged dynamically with the subject's conditions. |

- **Run History**: Stored under "mold_v2_runs". Managed via `loadRuns()` and `saveRuns()`. Appended by the client after game completion.
- **Achievements**: Stored under "mold_v2_achievements". Managed via `loadAchievements()` and `saveAchievements()`. Automatically synced by `onGameComplete`.