# MOLD V2 Architecture Traceability Manual

This document maps component interactions across the frontend application, the persistence layer, and the state domains, creating a clear guide for cross-layer development.

## 1. Application Architecture

MOLD V2 is a frontend-only Next.js 16 App Router application. It has no backend services or cloud infrastructure currently. All data persistence is managed via an asynchronous wrapper over browser `localStorage`/`sessionStorage`, making it ready for an eventual IndexedDB or server-side API upgrade.

### Core Stack
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19, Tailwind CSS, shadcn/ui
- **State Management:** React Context + React State + Ephemeral Reducer (`GameEngine`)
- **Persistence:** `localStorage` & `sessionStorage`

## 2. Component Interactions & Flow

The interaction is mainly between `HomeScreen` (which orchestrates user intent and loads subject/history data) and `GameRunner` (which mounts the ephemeral engine for a session).

### The Component Tree

```
app/layout.tsx
└── AchievementProvider
    └── app/page.tsx
        └── HomeScreen
            ├── HeroHeader (View: Home)
            ├── PerformanceTable (View: Home)
            └── GameRunner (View: Game)
                └── ToastLayer
                    └── GameErrorBoundary
                        ├── FlashcardScreen (Flashcard Mode)
                        └── GameEngineProvider (Normal Modes)
                            └── GameRunnerInner
                                ├── GameHeader
                                ├── QuestionCard
                                ├── GameFooter
                                └── ResultsScreen
```

### End-to-End Session Data Pipeline

1. **Initialization:** The user selects a mode and configuration on the `HomeScreen`.
2. **Mount:** `GameRunner` mounts. `GameEngineProvider` initializes the pool (`buildQuestionPool`) and starts the timer. `questions` and `config` are frozen via `useRef`.
3. **Execution:** Actions like `SELECT_OPTION`, `REVEAL_ANSWER`, and `NEXT_QUESTION` flow through the `GameEngineProvider` reducer.
4. **Completion:** When time runs out or all questions are answered, `phase` transitions to `complete`.
5. **Evaluation:** An effect inside `GameRunnerInner` calls `onGameComplete` to evaluate achievements based on the current state and run history.
6. **Persistence & Return:** The new run record is appended to the runs list, achievements are merged/saved, and the user returns to `HomeScreen` which forces a reload from `localStorage`.

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

## 4. Data Contracts & Persistence Layer

The app uses an asynchronous abstraction around local storage to mimic an external service.

### Active Interfaces

- **`FullSubjectData`:** Main schema for subject data. Includes config, questions, flashcards, terminology, and raw achievement definitions.
- **`RunRecord`:** Schema for a completed game session (id, mode, score, time taken, streak, grade, etc.).
- **`Achievement`:** Schema for achievements including dynamic conditions mapped from subject data.

### Storage Keys (The "Database")

| Key | Type | Storage | Description |
|---|---|---|---|
| `mold_v2_subjects` | `FullSubjectData[]` | `localStorage` | Contains imported subject files. |
| `mold_v2_active_subject` | `string` (ID) | `sessionStorage` | Keeps track of the currently selected subject across lists/home. |
| `mold_v2_runs` | `RunRecord[]` | `localStorage` | Keeps the history of past completed sessions (capped at 50). |
| `mold_v2_achievements` | `Achievement[]` | `localStorage` | The user's achievement unlocks merged dynamically with the subject's conditions. |
