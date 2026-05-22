# Cross-Module Architectural Traceability Manual

## Introduction
This manual provides a detailed mapping of component interactions across the MOLD V2 frontend client apps, the underlying state and persistence layers, and cloud infrastructure targets (where applicable, focusing on local-first storage). It serves as a clear guide for cross-layer development by documenting interface properties, data pipelines, and state architecture.

## 1. System Overview
MOLD V2 is a Next.js 16 App Router application. The system primarily operates as a client-side architecture with local storage persistence, designed for high performance and zero-latency user interactions. It implements a decoupled state architecture featuring three independent domains: Root Achievements, Session Game Engine, and View State.

## 2. Component Interactions & Data Flow

### 2.1 View Layer (HomeScreen & GameRunner)
- **HomeScreen (`components/mold/home-screen.tsx`)**: The entry point for the user interface. It owns the `view` state ("home" vs. "game"), `runs` (historical run records), `selectedMode`, and `config`.
  - **Interface Properties**: `runs: RunRecord[]`, `view: string`, `selectedMode: GameModeId`, `config: SetupConfig`.
  - **Data Pipeline**: Fetches `RunRecord[]` from `localStorage` on mount and after returning from a game via `loadRuns()`. Passes `runs` to `GameRunner` as a prop.

- **GameRunner (`components/mold/game-runner.tsx`)**: The composition root for an active game session. It mounts the `GameEngineProvider` and `GameErrorBoundary`.
  - **Interface Properties**: `runs: RunRecord[]`, `config: GameConfig`, `onReturnHome: () => void`.
  - **Data Pipeline**: Receives configuration from `HomeScreen`. It invokes the `ToastLayer` and manages the transition between modes (e.g., standard game vs. flashcards). When a game completes, it triggers achievement evaluation via `onGameComplete`.

### 2.2 Game Engine Layer
- **GameEngineProvider (`lib/game-engine.tsx`)**: Ephemeral state manager initialized when a game starts.
  - **Interface Properties**: Takes `config: GameConfig` and `questions: Question[]` as props. Exposes `state: GameState` and actions (`selectOption`, `revealAnswer`, `nextQuestion`, `useHint`, `forfeit`) via `GameEngineContext`.
  - **Data Pipeline**: `buildQuestionPool()` generates the question list based on mode. A timer updates `elapsedSeconds` and `globalTimeRemaining` via the `TICK` reducer action. The state is destroyed when the provider unmounts.

### 2.3 Achievement Layer
- **AchievementProvider (`lib/achievement-engine.tsx`)**: Persistent state manager residing at the application root (`app/layout.tsx`).
  - **Interface Properties**: Exposes `achievements: Achievement[]`, `onGameComplete`, and `resetAchievements` via `useAchievements()` hook.
  - **Data Pipeline**: Hydrates from `localStorage` ("mold_v2_achievements") on mount. When `onGameComplete` is called by `GameRunner`, it evaluates conditions using the current game state and historical runs, updates unlocked achievements, saves back to `localStorage`, and returns newly unlocked items for toast notifications.

## 3. Data Contracts & Interfaces
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

## 4. Persistence Pipeline
The application currently uses an asynchronous persistence pipeline interfacing with `localStorage`, with an explicit design to support IndexedDB or server-side API swaps.

- **Run History**: Stored under "mold_v2_runs". Managed via `loadRuns()` and `saveRuns()`. Appended by the client after game completion (currently a known seam to be implemented in `onRunComplete`).
- **Achievements**: Stored under "mold_v2_achievements". Managed via `loadAchievements()` and `saveAchievements()`. Automatically synced by `onGameComplete`.

## 5. Cloud Infrastructure Targets & Future Extensions
While current operations are local-first, the architecture defines clear boundaries for backend integration:
- The `FullSubjectData` schema provides the contract for fetching new subjects from a remote API.
- The async nature of `loadRuns`, `saveRuns`, `loadAchievements`, and `saveAchievements` allows direct replacement with fetch/REST calls or GraphQL mutations without altering the UI component logic.
