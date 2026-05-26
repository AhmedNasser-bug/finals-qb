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

### `app/layout.tsx`

**Module Name:** RootLayout

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

**Module Name:** Home

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

**Module Name:** SubjectsPage

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

---

### `components/mold/achievement-gallery.tsx`

**Module Name:** Achievement-Gallery

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `Yes`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useMemo, useAchievements

**Performance Characteristics:**
Utilizes memoization: useMemo to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
None
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---

### `components/mold/achievement-toast.tsx`

**Module Name:** Achievement-Toast

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useCallback, useEffect, useAchievementToast, useState

**Performance Characteristics:**
Utilizes memoization: useCallback to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
toasts: ToastItem[]
  onDismiss: (id: string) => void
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

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
useEffect, useState, useRef

**Performance Characteristics:**
No explicit memoization hooks (useMemo/useCallback) used.

**Properties & Slots (Interface):**
```typescript
subject: FullSubjectData
  onClose: () => void
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---

### `components/mold/flashcard-screen.tsx`

**Module Name:** Flashcard-Screen

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useCallback, useMemo, useState, useRef

**Performance Characteristics:**
Utilizes memoization: useCallback, useMemo to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
flashcards: Flashcard[]
  onComplete: () => void
  onReturnHome: () => void
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

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
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---

### `components/mold/game-runner.tsx`

**Module Name:** Game-Runner

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `Yes`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useAchievementToast, useState, useRef, useEffect, useAchievements, useGameEngine

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
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---

### `components/mold/game-screen.tsx`

**Module Name:** Game-Screen

**Characteristics:**
- Client Component: `Yes`
- Supports Slots (children): `No`
- Uses Routing: `No`
- Dynamic Lazy-Loading: `No`

**State Dependencies (Hooks):**
useMemo, useHint, useGameEngine

**Performance Characteristics:**
Utilizes memoization: useMemo to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
onReturnHome: () => void
  onPlayAgain: () => void
```

**Edge-Case Input Handling & Validation:**
- Sanitizes raw user input via DOMPurify to mitigate XSS attacks during HTML interpolation.
- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.

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
- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.
- Parses arbitrary JSON payloads; requires strict try/catch blocks and subsequent structural validation (e.g., Zod schemas) to prevent prototype pollution or invalid state.
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
useEffect, useMaxWidth, useState, useRef

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
- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.

---

### `components/mold/mode-selector.tsx`

**Module Name:** Mode-Selector

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
selected: GameModeId
  onSelect: (id: GameModeId) => void
  className?: string
```

**Edge-Case Input Handling & Validation:**
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.
- Interactive component; relies on external state handlers. Ensure rapid repeated interactions are debounced externally if needed.

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
onSubjectAdded: (subject: FullSubjectData) => void
```

**Edge-Case Input Handling & Validation:**
- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.

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
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

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
- Sanitizes raw user input via DOMPurify to mitigate XSS attacks during HTML interpolation.
- Implements explicit fallback UIs for critical asynchronous or failing boundaries.
- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.

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
useCallback, useEffect, useState

**Performance Characteristics:**
Utilizes memoization: useCallback to prevent unnecessary re-renders.

**Properties & Slots (Interface):**
```typescript
subject: FullSubjectData
  onClose: () => void
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

---

### `components/mold/share-receiver.tsx`

**Module Name:** Share-Receiver

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
/** The raw Base64url payload extracted from the URL hash. */
  payload: string
  /** Called when the user accepts the import. */
  onAccept: (subject: FullSubjectData) => void
  /** Called when the user declines or closes. */
  onDecline: () => void
```

**Edge-Case Input Handling & Validation:**
- Pure presentation component. Minimal edge cases aside from standard prop type validations.

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
- Extends base styling via `className`; ensure incoming tailwind classes do not break responsive breakpoints.

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
- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.
- Implements explicit fallback UIs for critical asynchronous or failing boundaries.
- Isolates rendering of external diagram definitions; requires valid syntax and unique container IDs to prevent hydration collisions.

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
- Validates against `existingIds` to prevent duplicate resource imports or collisions in the local store.

---
