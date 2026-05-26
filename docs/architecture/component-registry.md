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

**Module Name:** Layout

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `Yes`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---
### `app/page.tsx`

**Module Name:** Page

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `Yes`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useEffect, useRouter, useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.

---
### `app/subjects/page.tsx`

**Module Name:** Page

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useEffect, useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/achievement-gallery.tsx`

**Module Name:** AchievementGallery

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `Yes`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useAchievements, useMemo

**Performance Characteristics:**
Utilizes memoization: useMemo to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/achievement-toast.tsx`

**Module Name:** AchievementToast

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useAchievementToast, useCallback, useEffect, useState

**Performance Characteristics:**
Utilizes memoization: useCallback to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
id: string
  achievement: Achievement
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/action-hub.tsx`

**Module Name:** ActionHub

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
onInitialize: () => void
  onEncyclopedia: () => void
  selectedMode: GameModeId
  disabled?: boolean
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/encyclopedia-overlay.tsx`

**Module Name:** EncyclopediaOverlay

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useEffect, useRef, useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
subject: FullSubjectData
  onClose: () => void
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/example-module-card.tsx`

**Module Name:** ExampleModuleCard

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useEvent

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
entry: ExampleManifestEntry
  isLoading: boolean
  onLoad: (entry: ExampleManifestEntry) => void
  onShare: (e: React.MouseEvent, entry: ExampleManifestEntry) => void
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/flashcard-components.tsx`

**Module Name:** FlashcardComponents

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
onQuit: () => void
  progress: number
  position: string
  round: number
  confident: number
  learning: number
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/flashcard-screen-blocks.tsx`

**Module Name:** FlashcardScreenBlocks

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
round: number;
  flashcardsLength: number;
  confident: number;
  neutral: number;
  learning: number;
  hardest: Flashcard | undefined;
  scores: Record<string, number>;
  onReturnHome: () => void;
  onComplete: () => void;
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/flashcard-screen.tsx`

**Module Name:** FlashcardScreen

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useCallback, useMemo, useRef, useState

**Performance Characteristics:**
Utilizes memoization: useMemo, useCallback to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
flashcards: Flashcard[]
  onComplete: () => void
  onReturnHome: () => void
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/footer.tsx`

**Module Name:** Footer

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
rightText?: string
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---
### `app/components/mold/game-error-boundary.tsx`

**Module Name:** GameErrorBoundary

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `Yes`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
onReturnHome: () => void
  children: ReactNode
```

**Edge-Case Input Handling & Validation:**
- Implements explicit fallback UIs for critical asynchronous or failing boundaries.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/game-footer.tsx`

**Module Name:** GameFooter

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useGameEngine, useHint

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/game-header.tsx`

**Module Name:** GameHeader

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useGameEngine

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/game-icons.tsx`

**Module Name:** GameIcons

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---
### `app/components/mold/game-runner.tsx`

**Module Name:** GameRunner

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `Yes`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useAchievementToast, useAchievements, useEffect, useGameEngine, useRef, useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
config: GameConfig
  /** The active subject — provides questions and flashcards for this run. */
  subject: FullSubjectData
  /** Real persisted run history — used for achievement evaluation (Fix 1-A). */
  runs: RunRecord[]
  onReturnHome: () => void
  onRunComplete?: () => void
  /** Called with the completed RunRecord so the parent can persist it. */
  onRunSaved?: (run: RunRecord) => void
```

**Edge-Case Input Handling & Validation:**
- Implements explicit fallback UIs for critical asynchronous or failing boundaries.

---
### `app/components/mold/game-stat-cell.tsx`

**Module Name:** GameStatCell

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---
### `app/components/mold/hero-header.tsx`

**Module Name:** HeroHeader

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
subject: SubjectData
  achievements: Achievement[]
  onTrophyClick?: () => void
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/home-screen.tsx`

**Module Name:** HomeScreen

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useAchievements, useEffect, useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
/** The currently active FullSubjectData, chosen by the root orchestrator. */
  activeSubject: FullSubjectData
  /** All subjects in the store — passed down so the importer can check for duplicate ids. */
  allSubjectIds: string[]
  /** Called when the user imports a new subject from the home screen header. */
  onAddSubject: (subject: FullSubjectData) => void
  /** Called when the user clicks "Change Subject" in the header. */
  onChangeSubject: () => void
```

**Edge-Case Input Handling & Validation:**
- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.
- Parses arbitrary JSON payloads; requires strict try/catch blocks and subsequent structural validation (e.g., Zod schemas) to prevent prototype pollution or invalid state.
- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/mermaid-diagram.tsx`

**Module Name:** MermaidDiagram

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useEffect, useMaxWidth, useRef, useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
code: DiagramErrorCode
  message: string
  details?: string
```

**Edge-Case Input Handling & Validation:**
- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---
### `app/components/mold/mode-selector.tsx`

**Module Name:** ModeSelector

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
selected: GameModeId
  onSelect: (id: GameModeId) => void
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/onboarding-screen.tsx`

**Module Name:** OnboardingScreen

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
mode: GameMode;
```

**Edge-Case Input Handling & Validation:**
- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/performance-table.tsx`

**Module Name:** PerformanceTable

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
runs: RunRecord[]
  stats: AggregateStats
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---
### `app/components/mold/question-card.tsx`

**Module Name:** QuestionCard

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useGameEngine, useMemo

**Performance Characteristics:**
Utilizes memoization: useMemo to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
idx: number;
  label: string;
  text?: string;
  isSelected: boolean;
  isRevealed: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isDimmed: boolean;
  onSelect: () => void;
```

**Edge-Case Input Handling & Validation:**
- Sanitizes raw user input via DOMPurify to mitigate XSS attacks during HTML interpolation.
- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/results-screen-components.tsx`

**Module Name:** ResultsScreenComponents

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
elapsedSeconds: number
  avgTimeSec: string | null
  bestStreak: number
  xpYield: number
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---
### `app/components/mold/results-screen.tsx`

**Module Name:** ResultsScreen

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useGameEngine

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
onReturnHome: () => void
  onPlayAgain: () => void
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/rich-text.tsx`

**Module Name:** RichText

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useMemo

**Performance Characteristics:**
Utilizes memoization: useMemo to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
content: string
  className?: string
  id?: string
```

**Edge-Case Input Handling & Validation:**
- Sanitizes raw user input via DOMPurify to mitigate XSS attacks during HTML interpolation.
- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---
### `app/components/mold/setup-panel.tsx`

**Module Name:** SetupPanel

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `Yes`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
config: SetupConfig
  onChange: (patch: Partial<SetupConfig>) => void
  selectedMode: GameModeId
  categories: CategoryData[]
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/share-modal.tsx`

**Module Name:** ShareModal

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useCallback, useEffect, useRef, useState

**Performance Characteristics:**
Utilizes memoization: useCallback to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
encoding: boolean;
  encodeError: string | null;
  shareUrl: string;
  shortUrl: string;
  copyState: CopyState;
  shortenState: ShortenState;
  shortenError: string | null;
  sizeKb: string;
  isSizeLarge: boolean;
  onCopy: () => void;
  onShorten: () => void;
  onCopyShortUrl: () => void;
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/share-receiver.tsx`

**Module Name:** ShareReceiver

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useEffect, useRef, useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
/** The raw Base64url payload extracted from the URL hash. */
  payload: string
  /** Called when the user accepts the import. */
  onAccept: (subject: FullSubjectData) => void
  /** Called when the user declines or closes. */
  onDecline: () => void
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/streak-ascent.tsx`

**Module Name:** StreakAscent

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
currentStreak: number
  bestStreak: number
  isAtRisk?: boolean // If true, make the flame flicker more intensely/look fragile
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---
### `app/components/mold/subject-importer-components.tsx`

**Module Name:** SubjectImporterComponents

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---
### `app/components/mold/subject-importer.tsx`

**Module Name:** SubjectImporter

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useCallback, useMemo, useState

**Performance Characteristics:**
Utilizes memoization: useMemo, useCallback to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
onImport: (subject: FullSubjectData) => void
  onCancel: () => void
  existingIds?: string[]
```

**Edge-Case Input Handling & Validation:**
- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.
- Implements explicit fallback UIs for critical asynchronous or failing boundaries.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/subject-selector-components.tsx`

**Module Name:** SubjectSelectorComponents

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---
### `app/components/mold/subject-selector.tsx`

**Module Name:** SubjectSelector

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useEffect, useEvent, useState

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
subjects: FullSubjectData[]
  onSelect: (subject: FullSubjectData) => void
  onAddSubject: (subject: FullSubjectData) => void
  onRemoveSubject: (id: string) => void
```

**Edge-Case Input Handling & Validation:**
- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
### `app/components/mold/user-subject-card.tsx`

**Module Name:** UserSubjectCard

**Characteristics:**
- Client Component: `No`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
None

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
full: FullSubjectData
  isConfirming: boolean
  categoryCount: number
  onSelect: (full: FullSubjectData) => void
  onShare: (full: FullSubjectData) => void
  onDeleteConfirm: (id: string) => void
  onDeleteCancel: () => void
  onRemoveClick: (id: string) => void
```

**Edge-Case Input Handling & Validation:**
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

---
