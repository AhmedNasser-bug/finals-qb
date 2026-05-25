# Frontend Component Registry & Developer Guide

This document serves as a comprehensive registry for the modern frontend architecture. It outlines component APIs, content hydration pipelines, state dependencies, performance characteristics, and routing/lazy-loading logic.

## 1. Core Architecture & Hydration Pipelines

The application uses Next.js with React Server Components where applicable, but primarily relies on Client Components (`"use client"`) for interactive UI. State management utilizes a combination of React hooks, context (`AchievementProvider`), and local/session storage for persistence.

### 1.1 State Dependencies
Global state like active subjects is managed through `active-subject-store.ts` and `subject-store.ts`. Real-time game engine state is driven by custom hooks like `useGameEngine`.

### 1.2 Asset Delivery & Lazy Loading
The application leverages Next.js optimizations. No explicit `next/dynamic` calls are currently used for components; standard Next.js routing handles code splitting at the page level.

### 1.3 Routing States
Routing is managed via Next.js App Router. Components utilizing routing hooks (`useRouter`, `useSearchParams`) are documented below.

## 2. Component Registry

### `app/actions.ts`

**Module Name:** Actions.Ts

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
- Standard component behavior.

---

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
- Standard component behavior.

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
- Pure presentation component or interactive client component.
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
- Pure presentation component or interactive client component.
- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.

---

### `components/mold/achievement-gallery.tsx`

**Module Name:** Achievement-Gallery

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
- Pure presentation component or interactive client component.

---

### `components/mold/achievement-toast.tsx`

**Module Name:** Achievement-Toast

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
toasts: ToastItem[]
  onDismiss: (id: string) => void
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component or interactive client component.

---

### `components/mold/action-hub.tsx`

**Module Name:** Action-Hub

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
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/encyclopedia-overlay.tsx`

**Module Name:** Encyclopedia-Overlay

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
- Pure presentation component or interactive client component.

---

### `components/mold/example-module-card.tsx`

**Module Name:** Example-Module-Card

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
entry: ExampleManifestEntry
  isLoading: boolean
  onLoad: (entry: ExampleManifestEntry) => void
  onShare: (e: React.MouseEvent, entry: ExampleManifestEntry) => void
```

**Edge-Case Input Handling & Validation:**
- Standard component behavior.

---

### `components/mold/flashcard-components.tsx`

**Module Name:** Flashcard-Components

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
- Standard component behavior.

---

### `components/mold/flashcard-screen.tsx`

**Module Name:** Flashcard-Screen

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useCallback, useMemo, useRef, useState

**Performance Characteristics:**
Utilizes memoization: useCallback, useMemo to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
flashcards: Flashcard[]
  onComplete: () => void
  onReturnHome: () => void
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component or interactive client component.

---

### `components/mold/footer.tsx`

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
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/game-error-boundary.tsx`

**Module Name:** Game-Error-Boundary

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
None
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component or interactive client component.

---

### `components/mold/game-footer.tsx`

**Module Name:** Game-Footer

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
- Pure presentation component or interactive client component.

---

### `components/mold/game-header.tsx`

**Module Name:** Game-Header

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
- Pure presentation component or interactive client component.

---

### `components/mold/game-icons.tsx`

**Module Name:** Game-Icons

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
- Standard component behavior.

---

### `components/mold/game-runner.tsx`

**Module Name:** Game-Runner

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
- Pure presentation component or interactive client component.

---

### `components/mold/game-stat-cell.tsx`

**Module Name:** Game-Stat-Cell

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
- Standard component behavior.

---

### `components/mold/hero-header.tsx`

**Module Name:** Hero-Header

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
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/home-screen.tsx`

**Module Name:** Home-Screen

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
- Pure presentation component or interactive client component.
- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.

---

### `components/mold/mermaid-diagram.tsx`

**Module Name:** Mermaid-Diagram

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
/** Raw Mermaid source code. Required. */
  chart: string
  /** Unique ID used as the SVG element ID — must be unique across the page. */
  id: string
  /** Optional extra className for the wrapper div. */
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/mode-selector.tsx`

**Module Name:** Mode-Selector

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
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/onboarding-screen.tsx`

**Module Name:** Onboarding-Screen

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
- Pure presentation component or interactive client component.
- Relies on Web Storage API; must handle quota exceeded errors or disabled storage contexts gracefully.

---

### `components/mold/performance-table.tsx`

**Module Name:** Performance-Table

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
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/question-card.tsx`

**Module Name:** Question-Card

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
- Pure presentation component or interactive client component.

---

### `components/mold/results-screen-components.tsx`

**Module Name:** Results-Screen-Components

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
- Standard component behavior.

---

### `components/mold/results-screen.tsx`

**Module Name:** Results-Screen

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
- Pure presentation component or interactive client component.

---

### `components/mold/rich-text.tsx`

**Module Name:** Rich-Text

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
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/setup-panel.tsx`

**Module Name:** Setup-Panel

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
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/share-modal.tsx`

**Module Name:** Share-Modal

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
- Pure presentation component or interactive client component.

---

### `components/mold/share-receiver.tsx`

**Module Name:** Share-Receiver

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
- Pure presentation component or interactive client component.

---

### `components/mold/streak-ascent.tsx`

**Module Name:** Streak-Ascent

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
- Pure presentation component or interactive client component.
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

---

### `components/mold/subject-importer-components.tsx`

**Module Name:** Subject-Importer-Components

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
- Standard component behavior.

---

### `components/mold/subject-importer.tsx`

**Module Name:** Subject-Importer

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useCallback, useMemo, useState

**Performance Characteristics:**
Utilizes memoization: useCallback, useMemo to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
onImport: (subject: FullSubjectData) => void
  onCancel: () => void
  existingIds?: string[]
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component or interactive client component.

---

### `components/mold/subject-selector-components.tsx`

**Module Name:** Subject-Selector-Components

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
- Standard component behavior.

---

### `components/mold/subject-selector.tsx`

**Module Name:** Subject-Selector

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
subjects: FullSubjectData[]
  onSelect: (subject: FullSubjectData) => void
  onAddSubject: (subject: FullSubjectData) => void
  onRemoveSubject: (id: string) => void
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component or interactive client component.

---

### `components/mold/user-subject-card.tsx`

**Module Name:** User-Subject-Card

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
- Standard component behavior.

---

### `components/theme-provider.tsx`

**Module Name:** Theme-Provider

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
None
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component or interactive client component.

---

### `components/ui/button.tsx`

**Module Name:** Button

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
- Standard component behavior.

---

### `components/ui/card.tsx`

**Module Name:** Card

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
- Standard component behavior.

---

### `components/ui/input.tsx`

**Module Name:** Input

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
- Standard component behavior.

---
