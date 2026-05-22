# MOLD V2 Component Registry & Developer Guide

This document serves as an automated registry of all UI modules and core libraries, specifying exact properties, state dependencies, performance characteristics, and routing/hydration behaviors. It also outlines explicit edge-case input handling and validation rules for seamless developer onboarding.

## Architecture & Hydration Overview

### Routing States
- **Root Route (`/`)**: Manages the active study session. It reads the active subject from `sessionStorage` (`mold_v2_active_subject`). If found, it hydrates the `HomeScreen`. If not, it redirects to `/subjects`.
- **Subjects Route (`/subjects`)**: Manages subject selection, importation, and sharing. Handles share links via URL hash detection (`#share=...`) and transitions gracefully between `loading`, `receiving`, and `selecting` states.

### Client-side Hydration & Lazy-Loading Logic
- Components like complex editors or heavy visualizers may utilize `next/dynamic` for client-side lazy-loading to reduce initial bundle size.
- State is hydrated synchronously from storage providers (e.g., `localStorage`) during `useEffect` hooks, utilizing a `ready` or `loading` state flag to prevent Server-Side Rendering (SSR) mismatch errors.
- Dynamic loading configurations strictly ensure fallbacks are rendered while assets are being parsed and loaded.

### Asset Delivery Configurations
- The framework uses **Next.js (Turbopack)** with explicitly disabled Image optimization (`unoptimized: true` in `next.config.mjs`) to accommodate static exports (`output: export`) and distinct custom asset pipelines.
- Content hydration relies on local state management and persistence without depending heavily on backend databases. Asset streaming and manifest resolution handles I/O operations concurrently where applicable.

### Edge-case Input Handling & Validation Rules
- **Subject Validation (`lib/mold-types.ts`)**: Rigorous validation ensures imported schemas adhere to strict standards. `multipleChoice` options must be an array of objects containing a `label` string, and flashcards must define `term` and `definition` properties (preventing legacy formatting breaks).
- **Data Hydration Failures**: Fallback to empty states or onboarding flows when storage (`localStorage`/`sessionStorage`) is unavailable or heavily corrupted.
- **Error Boundaries (`GameErrorBoundary`)**: Implements `role="alert"` and fallback UIs to gracefully capture, report, and recover from render-phase failures within interactive components.
- **Circular References (`logger.ts`)**: Deep traversal and masking algorithms use `WeakSet` caching mechanisms to safely evaluate potentially recursive, deeply-nested error states to prevent stack overflows.

## Component Registry

### `app/layout.tsx`

**Components:**
- **`RootLayout`**
  - **Props Interface:** `children`
  - **Slots:** Exposes a `children` slot for composition.

---

### `app/page.tsx`

**Components:**
- **`Home`**
  - **Props:** Implicit or None

**State Dependencies (Hooks):**
- useEffect, useRouter, useState

---

### `app/subjects/page.tsx`

**Components:**
- **`SubjectsPage`**
  - **Props:** Implicit or None

**State Dependencies (Hooks):**
- useEffect, useState

---

### `components/mold/achievement-gallery.tsx`

**Components:**
- **`AchievementGallery`**
  - **Props Interface:** `onClose`

- **`Section`**
  - **Props Interface:** `label`
  - **Slots:** Exposes a `children` slot for composition.

- **`AchievementRow`**
  - **Props Interface:** `achievement`

- **`XIcon`**
  - **Props Interface:** `className?`

- **`TrophyIcon`**
  - **Props Interface:** `className?`

- **`LockIcon`**
  - **Props Interface:** `className?`

**State Dependencies (Hooks):**
- useAchievements, useMemo

**Performance Characteristics:**
- Uses `useMemo` to memoize expensive computations.

---

### `components/mold/achievement-toast.tsx`

**Components:**
- **`AchievementToastContainer`**
  - **Props:**
    - `toasts: ToastItem[]`
    - `onDismiss: (id: string) => void`

- **`AchievementToastItem`**
  - **Props Interface:** `item`

- **`TrophyIcon`**
  - **Props Interface:** `className?`

- **`XSmallIcon`**
  - **Props Interface:** `className?`

**State Dependencies (Hooks):**
- useAchievementToast, useCallback, useEffect, useState

**Performance Characteristics:**
- Uses `useCallback` to memoize event handlers.

---

### `components/mold/action-hub.tsx`

**Components:**
- **`ActionHub`**
  - **Props:**
    - `onInitialize: () => void`
    - `onEncyclopedia: () => void`
    - `selectedMode: GameModeId`
    - `disabled?: boolean`
    - `className?: string`

- **`PlayIcon`**
  - **Props Interface:** `className?`

- **`BookIcon`**
  - **Props Interface:** `className?`

---

### `components/mold/encyclopedia-overlay.tsx`

**Components:**
- **`EncyclopediaOverlay`**
  - **Props:**
    - `subject: FullSubjectData`
    - `onClose: () => void`

- **`CloseIcon`**
  - **Props Interface:** `className?`

**State Dependencies (Hooks):**
- useEffect, useRef, useState

---

### `components/mold/flashcard-screen.tsx`

**Components:**
- **`FlashcardScreen`**
  - **Props:**
    - `flashcards: Flashcard[]`
    - `onComplete: () => void`
    - `onReturnHome: () => void`

- **`Header`**
  - **Props Interface:** `onQuit`

- **`StatCell`**
  - **Props Interface:** `label`

- **`ScorePill`**
  - **Props Interface:** `label`

- **`DistributionBar`**
  - **Props Interface:** `confident`

**State Dependencies (Hooks):**
- useCallback, useMemo, useRef, useState

**Performance Characteristics:**
- Uses `useMemo` to memoize expensive computations.
- Uses `useCallback` to memoize event handlers.

---

### `components/mold/footer.tsx`

**Components:**
- **`Footer`**
  - **Props:**
    - `rightText?: string`
    - `className?: string`

---

### `components/mold/game-footer.tsx`

**Components:**
- **`GameFooter`**
  - **Props Interface:** `onHintRequest`

**State Dependencies (Hooks):**
- useGameEngine, useHint

---

### `components/mold/game-header.tsx`

**Components:**
- **`GameHeader`**
  - **Props Interface:** `onForfeit`

**State Dependencies (Hooks):**
- useGameEngine

---

### `components/mold/game-icons.tsx`

**Components:**
- **`BoltIcon`**
  - **Props Interface:** `className?`

- **`HeartIcon`**
  - **Props Interface:** `className?`

- **`CheckIcon`**
  - **Props Interface:** `className?`

- **`XIcon`**
  - **Props Interface:** `className?`

- **`LightbulbIcon`**
  - **Props Interface:** `className?`

- **`CheckCircleIcon`**
  - **Props Interface:** `className?`

- **`RadioIcon`**
  - **Props Interface:** `className?`

- **`SkipIcon`**
  - **Props Interface:** `className?`

- **`ChevronRightIcon`**
  - **Props Interface:** `className?`

---

### `components/mold/game-runner.tsx`

**Components:**
- **`ToastLayer`**
  - **Props Interface:** `children`
  - **Slots:** Exposes a `children` slot for composition.

- **`GameRunner`**
  - **Props:**
    - `config: GameConfig`
    - `/** The active subject — provides questions and flashcards for this run. */`
    - `subject: FullSubjectData`
    - `/** Real persisted run history — used for achievement evaluation (Fix 1-A). */`
    - `runs: RunRecord[]`
    - `onReturnHome: () => void`
    - `onRunComplete?: () => void`
    - `/** Called with the completed RunRecord so the parent can persist it. */`
    - `onRunSaved?: (run: RunRecord) => void`

- **`GameRunnerInner`**
  - **Props:**
    - `onReturnHome: () => void`
    - `onRunComplete?: () => void`
    - `onRunSaved?: (run: RunRecord) => void`
    - `config: GameConfig`
    - `/** Real persisted run history for achievement evaluation. */`
    - `runs: RunRecord[]`
    - `showUnlocks: (unlocked: Achievement[]) => void`

- **`SurvivalStressBar`**
  - **Props Interface:** `timeLimit`

**State Dependencies (Hooks):**
- useAchievementToast, useAchievements, useEffect, useGameEngine, useRef, useState

---

### `components/mold/game-stat-cell.tsx`

**Components:**
- **`StatCell`**
  - **Props Interface:** `label`

---

### `components/mold/hero-header.tsx`

**Components:**
- **`HeroHeader`**
  - **Props:**
    - `subject: SubjectData`
    - `achievements: Achievement[]`
    - `onTrophyClick?: () => void`
    - `className?: string`

- **`TrophyIcon`**
  - **Props Interface:** `className?`

---

### `components/mold/home-screen.tsx`

**Components:**
- **`HomeScreen`**
  - **Props:**
    - `/** The currently active FullSubjectData, chosen by the root orchestrator. */`
    - `activeSubject: FullSubjectData`
    - `/** All subjects in the store — passed down so the importer can check for duplicate ids. */`
    - `allSubjectIds: string[]`
    - `/** Called when the user imports a new subject from the home screen header. */`
    - `onAddSubject: (subject: FullSubjectData) => void`
    - `/** Called when the user clicks "Change Subject" in the header. */`
    - `onChangeSubject: () => void`

**State Dependencies (Hooks):**
- useAchievements, useEffect, useState

---

### `components/mold/mermaid-diagram.tsx`

**Components:**
- **`MermaidDiagram`**
  - **Props:**
    - `/** Raw Mermaid source code. Required. */`
    - `chart: string`
    - `/** Unique ID used as the SVG element ID — must be unique across the page. */`
    - `id: string`
    - `/** Optional extra className for the wrapper div. */`
    - `className?: string`

- **`WarningIcon`**
  - **Props Interface:** `className?`

**State Dependencies (Hooks):**
- useEffect, useMaxWidth, useRef, useState

---

### `components/mold/mode-selector.tsx`

**Components:**
- **`ModeSelector`**
  - **Props:**
    - `selected: GameModeId`
    - `onSelect: (id: GameModeId) => void`
    - `className?: string`

- **`ModeGroup`**
  - **Props:**
    - `label: string`
    - `modes: GameMode[]`
    - `selected: GameModeId`
    - `onSelect: (id: GameModeId) => void`
    - `accent: "danger" | "success"`

- **`ModeCard`**
  - **Props:**
    - `mode: GameMode`
    - `icon: React.ReactNode`
    - `isSelected: boolean`
    - `onSelect: (id: GameModeId) => void`
    - `selectedClass: string`
    - `accentClass: string`

- **`SpeedrunIcon`**
  - **Props:** Implicit or None

- **`BlitzIcon`**
  - **Props:** Implicit or None

- **`HardcoreIcon`**
  - **Props:** Implicit or None

- **`SurvivalIcon`**
  - **Props:** Implicit or None

- **`PracticeIcon`**
  - **Props:** Implicit or None

- **`FlashcardsIcon`**
  - **Props:** Implicit or None

- **`FullRevisionIcon`**
  - **Props:** Implicit or None

---

### `components/mold/onboarding-screen.tsx`

**Components:**
- **`OnboardingScreen`**
  - **Props:**
    - `onSubjectAdded: (subject: FullSubjectData) => void`

- **`ProtocolIcon`**
  - **Props:** Implicit or None

- **`TargetIcon`**
  - **Props:** Implicit or None

- **`ChevronLeftIcon`**
  - **Props:** Implicit or None

**State Dependencies (Hooks):**
- useState

---

### `components/mold/performance-table.tsx`

**Components:**
- **`PerformanceTable`**
  - **Props:**
    - `runs: RunRecord[]`
    - `stats: AggregateStats`
    - `className?: string`

- **`StatCell`**
  - **Props Interface:** `label`

- **`RunRow`**
  - **Props Interface:** `run`

---

### `components/mold/question-card.tsx`

**Components:**
- **`QuestionCard`**
  - **Props Interface:** `question`

**State Dependencies (Hooks):**
- useGameEngine, useMemo

**Performance Characteristics:**
- Uses `useMemo` to memoize expensive computations.

---

### `components/mold/results-screen.tsx`

**Components:**
- **`ResultsScreen`**
  - **Props:**
    - `onReturnHome: () => void`
    - `onPlayAgain: () => void`

**State Dependencies (Hooks):**
- useGameEngine

---

### `components/mold/rich-text.tsx`

**Components:**
- **`RichText`**
  - **Props:**
    - `content: string`
    - `className?: string`
    - `id?: string`

**State Dependencies (Hooks):**
- useMemo

**Performance Characteristics:**
- Uses `useMemo` to memoize expensive computations.

---

### `components/mold/setup-panel.tsx`

**Components:**
- **`SetupPanel`**
  - **Props:**
    - `config: SetupConfig`
    - `onChange: (patch: Partial<SetupConfig>) => void`
    - `selectedMode: GameModeId`
    - `categories: CategoryData[]`
    - `className?: string`

- **`ConfigRow`**
  - **Props Interface:** `label`
  - **Slots:** Exposes a `children` slot for composition.

- **`Toggle`**
  - **Props Interface:** `checked`

- **`CategoryTile`**
  - **Props:**
    - `id: string | null`
    - `name: string`
    - `questionCount: number`
    - `selected: boolean`
    - `onSelect: () => void`

---

### `components/mold/share-modal.tsx`

**Components:**
- **`ShareModal`**
  - **Props:**
    - `subject: FullSubjectData`
    - `onClose: () => void`

- **`CloseIcon`**
  - **Props:** Implicit or None

- **`SpinnerIcon`**
  - **Props:** Implicit or None

- **`InfoIcon`**
  - **Props:** Implicit or None

- **`WarnIcon`**
  - **Props:** Implicit or None

**State Dependencies (Hooks):**
- useCallback, useEffect, useRef, useState

**Performance Characteristics:**
- Uses `useCallback` to memoize event handlers.

---

### `components/mold/share-receiver.tsx`

**Components:**
- **`ShareReceiver`**
  - **Props:**
    - `/** The raw Base64url payload extracted from the URL hash. */`
    - `payload: string`
    - `/** Called when the user accepts the import. */`
    - `onAccept: (subject: FullSubjectData) => void`
    - `/** Called when the user declines or closes. */`
    - `onDecline: () => void`

- **`StatPill`**
  - **Props Interface:** `label`

- **`SpinnerIcon`**
  - **Props:** Implicit or None

**State Dependencies (Hooks):**
- useEffect, useRef, useState

---

### `components/mold/streak-ascent.tsx`

**Components:**
- **`StreakAscent`**
  - **Props:**
    - `currentStreak: number`
    - `bestStreak: number`
    - `isAtRisk?: boolean // If true, make the flame flicker more intensely/look fragile`
    - `className?: string`

---

### `components/mold/subject-importer.tsx`

**Components:**
- **`SubjectImporter`**
  - **Props:**
    - `onImport: (subject: FullSubjectData) => void`
    - `onCancel: () => void`
    - `existingIds?: string[]`

- **`StatChip`**
  - **Props Interface:** `label`

- **`CloseIcon`**
  - **Props:** Implicit or None

**State Dependencies (Hooks):**
- useCallback, useMemo, useState

**Performance Characteristics:**
- Uses `useMemo` to memoize expensive computations.
- Uses `useCallback` to memoize event handlers.

---

### `components/mold/subject-selector.tsx`

**Components:**
- **`SubjectSelector`**
  - **Props:**
    - `subjects: FullSubjectData[]`
    - `onSelect: (subject: FullSubjectData) => void`
    - `onAddSubject: (subject: FullSubjectData) => void`
    - `onRemoveSubject: (id: string) => void`

- **`SectionLabel`**
  - **Props Interface:** `label`

- **`StatPill`**
  - **Props Interface:** `label`

- **`ProtocolIcon`**
  - **Props:** Implicit or None

- **`PlusIcon`**
  - **Props:** Implicit or None

- **`ShareIcon`**
  - **Props:** Implicit or None

- **`SpinnerIcon`**
  - **Props:** Implicit or None

**State Dependencies (Hooks):**
- useEffect, useState

---

### `components/theme-provider.tsx`

**Components:**
- **`ThemeProvider`**
  - **Props Interface:** `ThemeProviderProps`
  - **Slots:** Exposes a `children` slot for composition.

---

### `components/ui/button.tsx`

**Components:**
- **`Button`**
  - **Props:** Implicit or None

---

### `lib/achievement-engine.tsx`

**Components:**
- **`AchievementProvider`**
  - **Props Interface:** `children`
  - **Slots:** Exposes a `children` slot for composition.

**State Dependencies (Hooks):**
- useAchievements, useCallback, useContext, useEffect, useState

**Performance Characteristics:**
- Uses `useCallback` to memoize event handlers.

---

### `lib/game-engine.tsx`

**Components:**
- **`GameEngineProvider`**
  - **Props:**
    - `config: GameConfig`
    - `questions: Question[]`
    - `children: ReactNode`
  - **Slots:** Exposes a `children` slot for composition.

**State Dependencies (Hooks):**
- useCallback, useContext, useEffect, useGameEngine, useHint, useReducer, useRef

**Performance Characteristics:**
- Uses `useCallback` to memoize event handlers.

---
