# MOLD V2 Component Registry

This document specifies the exact properties, slots, state dependencies, and performance characteristics of each UI module in the MOLD V2 frontend, along with client-side lazy-loading logic, asset delivery configurations, and routing states.

## Table of Contents
1. [Core UI Components](#core-ui-components)
2. [Game Engine Components](#game-engine-components)
3. [Setup & Configuration](#setup--configuration)
4. [Routing & Hydration Pipelines](#routing--hydration-pipelines)
5. [Edge-case Validation & Error Handling](#edge-case-validation--error-handling)

## 1. Core UI Components

### `HomeScreen` (`components/mold/home-screen.tsx`)
*   **Purpose:** The central orchestrator for mode selection, configuration, performance history, and subject management.
*   **Props:**
    *   `activeSubject` (`FullSubjectData`): The currently active subject context.
    *   `allSubjectIds` (`string[]`): List of all loaded subject IDs to prevent duplicate imports.
    *   `onAddSubject` (`(subject: FullSubjectData) => void`): Callback when a new subject is imported.
    *   `onChangeSubject` (`() => void`): Callback to swap subjects.
*   **State Dependencies:**
    *   `view`: Routes between `"home"` and `"game"`.
    *   `activeConfig`: The validated `GameConfig` injected into the game runner.
    *   `runs`: Loaded directly from `localStorage("mold_v2_runs")` on mount to circumvent hydration mismatches.
    *   `selectedMode`, `config`: Setup parameters (mode, timers, hints, category).
*   **Performance Characteristics:**
    *   Hydrates runs and achievements strictly on the client (`useEffect`) to prevent SSR mismatch.
    *   Uses `useAchievements` to merge newly loaded subject definitions seamlessly into the global tracked state.

### `MermaidDiagram` (`components/mold/mermaid-diagram.tsx`)
*   **Purpose:** Lazily loads and strictly sanitizes Mermaid diagrams to prevent XSS.
*   **Props:**
    *   `chart` (`string`): Raw Mermaid diagram syntax.
    *   `id` (`string`): Unique identifier for the diagram (prevents chart collision).
    *   `className` (`string?`): Styling overrides.
*   **Lazy-loading Logic:**
    *   Dynamically imports `mermaid` using `await import("mermaid")` inside a `useEffect` hook. Does not block initial paint.
*   **Security & Error Handling:**
    *   Initializes Mermaid with `securityLevel: 'strict'`.
    *   Uses a 4-second timeout to trap and cancel long-running render operations.
    *   Classifies diagram errors into distinct UI alerts (e.g., `SYNTAX_ERROR`, `RENDER_TIMEOUT`).

### `RichText` (`components/mold/rich-text.tsx`)
*   **Purpose:** Safely renders HTML mixed with inline Mermaid charts.
*   **Props:**
    *   `content` (`string`): The raw text to parse.
    *   `id` (`string?`): Unique identifier prefix for nested diagrams.
*   **Dependencies:**
    *   `DOMPurify` is used exclusively for the HTML parts.
    *   Mermaid blocks are intercepted and rendered via the `MermaidDiagram` component, deliberately bypassing DOMPurify as it strips `<foreignObject>` tags needed for styling.

## 2. Game Engine Components

### `GameRunner` & `GameRunnerInner` (`components/mold/game-runner.tsx`)
*   **Purpose:** Root container for an active quiz session, injecting the `GameEngineProvider` and wrapping the UI in the `ToastLayer`.
*   **Props:**
    *   `config` (`GameConfig`): Config rules (mode, timers).
    *   `subject` (`FullSubjectData`): Raw question bank.
    *   `runs` (`RunRecord[]`): Run history (required for evaluating achievement conditions that count runs).
    *   `onReturnHome` (`() => void`): Unmounts the game and returns to the home screen.
    *   `onRunSaved` (`(run: RunRecord) => void`): Persists a completed session.
*   **Performance Characteristics:**
    *   `GameEngineProvider` stabilizes the `config` and `questions` props with a `useRef` on initial mount. This guarantees that parent re-renders cannot reset the active game state.
    *   Fires achievement checks explicitly once via a `achievementsFiredRef` guard.

### `QuestionCard` (`components/mold/question-card.tsx`)
*   **Purpose:** Renders the active question, choices, and conditional diagrams in a split-pane or stacked view based on aspect ratios.
*   **Props:** None directly. Subscribes entirely to `useGameEngine()` context.
*   **State Subscriptions:**
    *   `state.questions[state.currentIndex]` (current question object)
    *   `state.selectedOption`
    *   `state.isRevealed`
*   **Accessibility:**
    *   Maps options to `role="radio"` and tracks `aria-checked` and `disabled` states properly.

### `ResultsScreen` (`components/mold/results-screen.tsx`)
*   **Purpose:** End-of-game summary computing grades and calculating module-specific performance (strengths/weaknesses).
*   **Props:**
    *   `onReturnHome`
    *   `onPlayAgain`
*   **Dependencies:**
    *   Reads `state.score` and `state.wrongAnswers` via `useGameEngine()`. Note: Accuracy must be calculated against `(score + wrongAnswers)`, not `currentIndex`.

## 3. Setup & Configuration

### `ModeSelector` (`components/mold/mode-selector.tsx`)
*   **Logic:** Presents the core modes (Speedrun, Blitz, Hardcore, Survival, Practice, Flashcards, Full Revision).
*   **Accessibility:** Buttons utilize `aria-pressed` for the active mode to ensure screen readers announce selection correctly.

## 4. Routing & Hydration Pipelines

*   **Next.js 16 App Router:** The application utilizes the Next.js `app/` directory (App Router) primarily as a static delivery mechanism.
*   **Client-Side Hydration:**
    *   Database-less architecture. `localStorage` and `sessionStorage` serve as the absolute source of truth.
    *   `sessionStorage` (`mold_v2_active_subject`) tracks the active subject ID when moving between `/subjects` and `/`.
    *   `localStorage` tracks `mold_v2_runs` (history), `mold_v2_achievements` (unlocks), and `mold_v2_subjects` (raw data).
    *   Because the server cannot read `localStorage` during initial render, key components like `HomeScreen` and `AchievementProvider` render with empty baseline states (e.g., `[]`) and immediately populate state inside a `useEffect` loop.

## 5. Edge-case Validation & Error Handling

*   **Game Engine State Protection:**
    *   The `useGameEngine` context provider relies on `useRef(config).current` to decouple the active game from Next.js HMR or parent prop changes.
*   **Achievement Merging:**
    *   When swapping subjects, `AchievementProvider` leverages `syncSubjectAchievements` to merge the active subject's achievement definitions into the cached list without overwriting `unlockedAt` timestamps.
*   **Data Consistency:**
    *   Accuracy percentages are determined dynamically by summing `score + wrongAnswers` rather than the overall index, explicitly capturing forfeited or skipped queries.
*   **Boundary Management:**
    *   The `GameErrorBoundary` serves as a fail-safe layer around the engine. If a corrupted question or invalid hook configuration faults the tree, it intercepts the crash, logs the issue, and allows a safe bailout via `onReturnHome` without locking up the user interface.

### `FlashcardScreen` (`components/mold/flashcard-screen.tsx`)
*   **Purpose:** Standalone learning view managing its own isolated loop without connecting to the main game engine.
*   **Props:**
    *   `flashcards` (`Flashcard[]`): Array of terminology objects.
    *   `onComplete` (`() => void`): Unmount trigger when session ends.
*   **State Management:**
    *   `currentIndex`: Tracks current card.
    *   `isFlipped`: Controls CSS transform.
    *   `known`: A `Set<string>` tracking terms marked as "Got It".

### `AchievementGallery` (`components/mold/achievement-gallery.tsx`)
*   **Purpose:** Renders the unlocked and locked achievement grid.
*   **Dependencies:**
    *   Uses `useAchievements` hook to pull the active subject's merged achievement conditions.
    *   Relies entirely on the `unlockedAt` field for conditional rendering.

### `SetupPanel` (`components/mold/setup-panel.tsx`)
*   **Purpose:** Dynamically adjusts the available game configuration options (timers, hints, question counts) based on the `selectedMode`.
*   **Props:**
    *   `config` (`SetupConfig`): Current values.
    *   `onChange` (`(patch: Partial<SetupConfig>) => void`): Updates `config` in `HomeScreen`.
    *   `selectedMode` (`GameModeId`): Modifies what inputs are visible/enabled.
    *   `categories` (`CategoryData[]`): Renders category chips for Practice mode.
