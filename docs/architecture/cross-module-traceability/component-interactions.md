# Component Interactions

## 2. Component Interactions & Data Flow

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