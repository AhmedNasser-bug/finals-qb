# MOLD V2 Component Registry

> Auto-generated documentation detailing properties, slots, state dependencies, and hydration characteristics for UI modules.

## Hydration & Routing Overheads

- **Architecture**: Next.js 16 App Router
- **Hydration Boundary**: Components marked with `"use client"` hydrate on the client and support interactivity. Other components are strictly Server Components.
- **Asset Delivery**: Next.js optimizes static assets. React components are split based on Server/Client boundaries.
- **Routing State**: The application primarily utilizes a single-page architecture within the `HomeScreen` component for switching between "home" and "game" views, avoiding full page reloads during active gameplay.
- **Client-Side Lazy Loading**: Next.js automatically handles chunking and lazy-loading of client components to reduce initial JavaScript payload.

## Components

### `achievement-gallery.tsx`

- **Path**: `components/mold/achievement/achievement-gallery.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useAchievements, useRef, useEffect, useMemo, useState
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `onClose: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `achievement-toast.tsx`

- **Path**: `components/mold/achievement/achievement-toast.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useCallback, useEffect
- **Slots**: None explicitly detected
- **Properties**:
- `toasts: ToastItem[]`
- `onDismiss: (id: string) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `analytics-dashboard.tsx`

- **Path**: `components/mold/analytics/analytics-dashboard.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useCallback, useEffect, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- No explicit props extracted.

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `encyclopedia-overlay.tsx`

- **Path**: `components/mold/common/encyclopedia-overlay.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useRef, useEffect
- **Slots**: None explicitly detected
- **Properties**:
- `subject: FullSubjectData`
- `onClose: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `footer.tsx`

- **Path**: `components/mold/common/footer.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `rightText?: string`
- `className?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `guide-link.tsx`

- **Path**: `components/mold/common/guide-link.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: usePathname, useSearchParams, useMemo
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `children?: React.ReactNode`
- `source?: string`
- `href?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `guide-overlay.tsx`

- **Path**: `components/mold/common/guide-overlay.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useRouter, useEffect
- **Slots**: None explicitly detected
- **Properties**:
- `open: boolean`
- `onClose: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `layout-switcher-modal.tsx`

- **Path**: `components/mold/common/layout-switcher-modal.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: usePageLayout, useRef, useEffect
- **Slots**: None explicitly detected
- **Properties**:
- `onClose: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `mermaid-diagram.tsx`

- **Path**: `components/mold/common/mermaid-diagram.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useRef, useState, useEffect
- **Slots**: None explicitly detected
- **Properties**:
- `chart: string`
- `id: string`
- `className?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `onboarding-screen.tsx`

- **Path**: `components/mold/common/onboarding-screen.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState
- **Slots**: None explicitly detected
- **Properties**:
- `mode: GameMode`
- `onSubjectAdded: (subject: FullSubjectData) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `rich-text.tsx`

- **Path**: `components/mold/common/rich-text.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useMemo
- **Slots**: None explicitly detected
- **Properties**:
- `content: string`
- `className?: string`
- `id?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `share-modal-blocks.tsx`

- **Path**: `components/mold/common/share-modal-blocks.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `encoding: boolean`
- `encodeError: string | null`
- `shareUrl: string`
- `shortUrl: string`
- `copyState: CopyState`
- `shortenState: ShortenState`
- `shortenError: string | null`
- `sizeKb: string`
- `isSizeLarge: boolean`
- `onCopy: () => void`
- `onShorten: () => void`
- `onCopyShortUrl: () => void`
- `subject: FullSubjectData`
- `onDownload: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `share-modal.tsx`

- **Path**: `components/mold/common/share-modal.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useRef, useEffect, useCallback
- **Slots**: None explicitly detected
- **Properties**:
- `subject: FullSubjectData`
- `onClose: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `theme-switcher-modal.tsx`

- **Path**: `components/mold/common/theme-switcher-modal.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useColorTheme, useRef, useState, useEffect, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- `onClose: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `flashcard-components.tsx`

- **Path**: `components/mold/flashcard/flashcard-components.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `onQuit: () => void`
- `progress: number`
- `position: string`
- `round: number`
- `confident: number`
- `learning: number`
- `label: string`
- `value: string`
- `color: string`
- `borderColor: string`
- `label: string`
- `count: number`
- `color: "emerald" | "red"`
- `confident: number`
- `neutral: number`
- `learning: number`
- `total: number`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `flashcard-screen-blocks.tsx`

- **Path**: `components/mold/flashcard/flashcard-screen-blocks.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `card: Flashcard`
- `index: number`
- `flipped: boolean`
- `animClass: string`
- `accent: { color: string; border: string; label: string }`
- `onFlip: () => void`
- `onRespond: (knew: boolean) => void`
- `round: number`
- `flashcardsLength: number`
- `confident: number`
- `neutral: number`
- `learning: number`
- `hardest: Flashcard | undefined`
- `scores: Record<string, number>`
- `onReturnHome: () => void`
- `onComplete: () => void`
- `round: number`
- `deckLength: number`
- `flashcardsLength: number`
- `confident: number`
- `neutral: number`
- `learning: number`
- `roundGotIt: number`
- `roundStillLearning: number`
- `hardestCards: Flashcard[]`
- `scores: Record<string, number>`
- `onReturnHome: () => void`
- `onContinue: () => void`
- `onEndSession: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `flashcard-screen.tsx`

- **Path**: `components/mold/flashcard/flashcard-screen.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useRef, useEffect, useCallback, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- `flashcards: Flashcard[]`
- `subjectId?: string`
- `onComplete: () => void`
- `onReturnHome: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `memory-heatmap.tsx`

- **Path**: `components/mold/flashcard/memory-heatmap.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState
- **Slots**: None explicitly detected
- **Properties**:
- `cards: Flashcard[]`
- `retentionMap: RetentionMap`
- `subjectId: string`
- `onStartDrill: (strategy: "SMART_ADAPTIVE" | "DUE_ONLY" | "CRITICAL_ONLY", category?: string) => void`
- `onClose?: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `retention-badge.tsx`

- **Path**: `components/mold/flashcard/retention-badge.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `urgency: CardRetentionState["urgencyLevel"]`
- `retrievability?: number`
- `className?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `cheat-sheet-terminal.tsx`

- **Path**: `components/mold/game/cheat-sheet-terminal.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useCheatSheet, useEffect
- **Slots**: None explicitly detected
- **Properties**:
- `subjectId: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `game-error-boundary.tsx`

- **Path**: `components/mold/game/game-error-boundary.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `onReturnHome: () => void`
- `children: ReactNode`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `game-footer.tsx`

- **Path**: `components/mold/game/game-footer.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useGameEngine
- **Slots**: None explicitly detected
- **Properties**:
- `onHintRequest: () => void`
- `initialLockRemaining: number`
- `hintTimeRemaining: number`
- `hintUsedThisQuestion: boolean`
- `showHint: boolean`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `game-header.tsx`

- **Path**: `components/mold/game/game-header.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useGameEngine, useCheatSheet
- **Slots**: None explicitly detected
- **Properties**:
- `onForfeit: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `game-icons.tsx`

- **Path**: `components/mold/game/game-icons.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `className: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `game-runner.tsx`

- **Path**: `components/mold/game/game-runner.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useAchievementToast, useState, useGameEngine, useAchievements, useStreak, useCheatSheet, useRef, useEffect, useHint
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `config: GameConfig`
- `subject: FullSubjectData`
- `runs: RunRecord[]`
- `onReturnHome: () => void`
- `onRunComplete?: () => void`
- `onRunSaved?: (run: RunRecord) => void`
- `onReturnHome: () => void`
- `onRunComplete?: () => void`
- `onRunSaved?: (run: RunRecord) => void`
- `onInstantRestart?: () => void`
- `onReDrillMistakes?: (mistakes: Question[]) => void`
- `config: GameConfig`
- `runs: RunRecord[]`
- `showUnlocks: (unlocked: Achievement[]) => void`
- `subject: FullSubjectData`
- `value: import("@/lib/question-card-context").QuestionCardContextValue`
- `accuracyPct: number`
- `showHint: boolean`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `game-stat-cell.tsx`

- **Path**: `components/mold/game/game-stat-cell.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `label: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `question-card-blocks.tsx`

- **Path**: `components/mold/game/question-card-blocks.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `question: any`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `question-card-builder.tsx`

- **Path**: `components/mold/game/question-card-builder.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useQuestionCard, useGameEngine
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `children: React.ReactNode`
- `idx: number`
- `label: string`
- `text?: string`
- `isSelected: boolean`
- `isRevealed: boolean`
- `isCorrect: boolean`
- `isWrong: boolean`
- `isDimmed: boolean`
- `onSelect: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `question-card-components.tsx`

- **Path**: `components/mold/game/question-card-components.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `idx: any`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `question-card-types.ts`

- **Path**: `components/mold/game/question-card-types.ts`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `idx: number`
- `label: string`
- `text?: string`
- `isSelected: boolean`
- `isRevealed: boolean`
- `isCorrect: boolean`
- `isWrong: boolean`
- `isDimmed: boolean`
- `onSelect: () => void`
- `question: Question`
- `currentIndex: number`
- `grade: string`
- `gradeColor: string`
- `question: Question`
- `parts: { type: string; content: string }[]`
- `hasDedicatedDiagram: boolean`
- `diagramBelow: boolean`
- `renderOptions: (cols: "single" | "split") => React.ReactNode`
- `renderDiagram: (mode: "side" | "below") => React.ReactNode`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `question-card.tsx`

- **Path**: `components/mold/game/question-card.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- No explicit props extracted.

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `results-screen-components.tsx`

- **Path**: `components/mold/game/results-screen-components.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `elapsedSeconds: number`
- `avgTimeSec: string | null`
- `bestStreak: number`
- `xpYield: number`
- `pixels: ("correct" | "wrong" | "skipped")[]`
- `total: number`
- `pixelCount: number`
- `score: number`
- `wrongCountVal: number`
- `skipCount: number`
- `modules: {
    id: string
    name: string
    pct: number
    grade: string
  }[]`
- `resolveGradeColor: (g: string) => string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `results-screen.tsx`

- **Path**: `components/mold/game/results-screen.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useGameEngine
- **Slots**: None explicitly detected
- **Properties**:
- `onReturnHome: () => void`
- `onPlayAgain: () => void`
- `onReDrillMistakes?: (mistakeQuestions: Question[]) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `guide-page-content.tsx`

- **Path**: `components/mold/guide/guide-page-content.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useSearchParams, useState, useRef, useEffect, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- No explicit props extracted.

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `guide-sections.tsx`

- **Path**: `components/mold/guide/guide-sections.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `register: (id: SectionId) => (el: HTMLElement | null) => void`
- `highlightText?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `achievements-panel.tsx`

- **Path**: `components/mold/home/achievements-panel.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `unlockedCount: number`
- `totalAchievementsCount: number`
- `topAchievements: AchievementDef[]`
- `hasMoreAchievements: boolean`
- `totalCount: number`
- `onShowGallery: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `action-hub.tsx`

- **Path**: `components/mold/home/action-hub.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `onInitialize: () => void`
- `selectedMode: GameModeId`
- `disabled?: boolean`
- `className?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `add-questions-wizard.tsx`

- **Path**: `components/mold/home/add-questions-wizard.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useMemo, useCallback
- **Slots**: None explicitly detected
- **Properties**:
- `activeSubject: FullSubjectData`
- `onMerge: (mergedSubject: FullSubjectData) => void`
- `onCancel: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `bottom-mobile-nav.tsx`

- **Path**: `components/mold/home/bottom-mobile-nav.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `view: AppView`
- `setView: (view: AppView) => void`
- `handleModeSelect: (id: GameModeId) => void`
- `setShowEncyclopedia: (show: boolean) => void`
- `setShowGallery: (show: boolean) => void`
- `onChangeSubject: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `header-well.tsx`

- **Path**: `components/mold/home/header-well.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `subjectName: string`
- `description: string`
- `runCount: number`
- `visualAccuracyPct: number`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `hero-header.tsx`

- **Path**: `components/mold/home/hero-header.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `subject: SubjectData`
- `achievements: Achievement[]`
- `onTrophyClick?: () => void`
- `onChangeSubject?: () => void`
- `onImportNew?: () => void`
- `className?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `home-screen-blocks.tsx`

- **Path**: `components/mold/home/home-screen-blocks.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `selectedMode: GameModeId`
- `handleModeSelect: (id: GameModeId) => void`
- `handleInitialize: () => void`
- `config: SetupConfig`
- `handleConfigChange: (patch: Partial<SetupConfig>) => void`
- `categories: CategoryData[]`
- `questions?: Question[]`
- `subjectId?: string`
- `unlockedCount: number`
- `totalAchievementsCount: number`
- `topAchievements: Achievement[]`
- `achievements: Achievement[]`
- `setShowGallery: (show: boolean) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `home-screen-components.tsx`

- **Path**: `components/mold/home/home-screen-components.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `view: AppView`
- `setView: (view: AppView) => void`
- `handleModeSelect: (id: GameModeId) => void`
- `setShowEncyclopedia: (show: boolean) => void`
- `setShowGallery: (show: boolean) => void`
- `onChangeSubject: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `home-screen-types.ts`

- **Path**: `components/mold/home/home-screen-types.ts`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- No explicit props extracted.

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `home-screen.tsx`

- **Path**: `components/mold/home/home-screen.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useSafeAuth, useState, usePageLayout, useStats, useAchievements, useEffect, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- `activeSubject: FullSubjectData`
- `allSubjectIds: string[]`
- `onAddSubject: (subject: FullSubjectData) => void`
- `onChangeSubject: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `mode-selector.tsx`

- **Path**: `components/mold/home/mode-selector.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `selected: GameModeId`
- `onSelect: (id: GameModeId) => void`
- `onLaunch?: () => void`
- `className?: string`
- `label: string`
- `modes: GameMode[]`
- `selected: GameModeId`
- `onSelect: (id: GameModeId) => void`
- `onLaunch?: () => void`
- `accent: "danger" | "success"`
- `startIndex: number`
- `mode: GameMode`
- `indexNumber: number`
- `icon: React.ReactNode`
- `isSelected: boolean`
- `onSelect: (id: GameModeId) => void`
- `onLaunch?: () => void`
- `selectedClass: string`
- `accentClass: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `performance-table.tsx`

- **Path**: `components/mold/home/performance-table.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- `runs: RunRecord[]`
- `stats: AggregateStats`
- `className?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `session-stats-panel.tsx`

- **Path**: `components/mold/home/session-stats-panel.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useStats
- **Slots**: None explicitly detected
- **Properties**:
- No explicit props extracted.

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `setup-panel-blocks.tsx`

- **Path**: `components/mold/home/setup-panel-blocks.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useContext, useConfigControls, useState, useMemo
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `config: SetupConfig`
- `config: SetupConfig`
- `onChange: (patch: Partial<SetupConfig>) => void`
- `categories: CategoryData[]`
- `questions?: Question[]`
- `subjectId?: string`
- `id: string | null`
- `name: string`
- `questionCount: number`
- `selected: boolean`
- `recallabilityPct?: number`
- `onSelect: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `setup-panel.tsx`

- **Path**: `components/mold/home/setup-panel.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `config: SetupConfig`
- `onChange: (patch: Partial<SetupConfig>) => void`
- `selectedMode: GameModeId`
- `categories: CategoryData[]`
- `questions?: Question[]`
- `subjectId?: string`
- `className?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `side-nav-bar.tsx`

- **Path**: `components/mold/home/side-nav-bar.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState
- **Slots**: None explicitly detected
- **Properties**:
- `subjectId: string`
- `activeView: "home" | "stats"`
- `onShowDashboard: () => void`
- `onShowStats: () => void`
- `onShowEncyclopedia: () => void`
- `onShowGallery: () => void`
- `onChangeSubject: () => void`
- `onImportNew: () => void`
- `onAddQuestions: () => void`
- `onInitialize: () => void`
- `onDownloadHtml: () => void`
- `onDownloadPdf: () => void`
- `onDownloadSolvedPdf: () => void`
- `onShowThemeModal?: () => void`
- `onShowLayoutModal?: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `stats-screen.tsx`

- **Path**: `components/mold/home/stats-screen.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useStats, useState, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- `onReturnHome: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `streak-ascent.tsx`

- **Path**: `components/mold/home/streak-ascent.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `currentStreak: number`
- `bestStreak: number`
- `isAtRisk?: boolean`
- `className?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `subject-visual-card.tsx`

- **Path**: `components/mold/home/subject-visual-card.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `subjectId: string`
- `subjectName: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `telemetry-panel.tsx`

- **Path**: `components/mold/home/telemetry-panel.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useStats, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- No explicit props extracted.

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `top-nav-bar.tsx`

- **Path**: `components/mold/home/top-nav-bar.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useColorTheme, usePurchases, useState, useRef, useEffect
- **Slots**: None explicitly detected
- **Properties**:
- `activeSubjectName?: string`
- `loadedSubjectsCount?: number`
- `onShowEncyclopedia?: () => void`
- `onShowGallery?: () => void`
- `onImportNew?: () => void`
- `onShowThemeModal?: () => void`
- `onShowLayoutModal?: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `base-page-wrapper.tsx`

- **Path**: `components/mold/layouts/base-page-wrapper.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `children: React.ReactNode`
- `topNav?: React.ReactNode`
- `mobileNav?: React.ReactNode`
- `footer?: React.ReactNode`
- `scanlinesClassName?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `default-sidebar-layout.tsx`

- **Path**: `components/mold/layouts/default-sidebar-layout.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `children: any`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `layout-map.tsx`

- **Path**: `components/mold/layouts/layout-map.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- No explicit props extracted.

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `split-terminal-layout.tsx`

- **Path**: `components/mold/layouts/split-terminal-layout.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `children: any`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `zen-focus-layout.tsx`

- **Path**: `components/mold/layouts/zen-focus-layout.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `children: any`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `zen-minimal-dock-layout.tsx`

- **Path**: `components/mold/layouts/zen-minimal-dock-layout.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: Supports `children` prop (React nodes)
- **Properties**:
- `children: any`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `paywall-modal.tsx`

- **Path**: `components/mold/payment/paywall-modal.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: usePurchases, useState, useEffect, useCallback
- **Slots**: None explicitly detected
- **Properties**:
- `isOpen?: boolean`
- `onClose?: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `revenuecat-logo.tsx`

- **Path**: `components/mold/payment/revenuecat-logo.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `className?: string`
- `color?: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `example-module-card.tsx`

- **Path**: `components/mold/subject/example-module-card.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `entry: ExampleManifestEntry`
- `isLoading: boolean`
- `onLoad: (entry: ExampleManifestEntry) => void`
- `onShare: (e: React.MouseEvent, entry: ExampleManifestEntry) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `neural-core-panel.tsx`

- **Path**: `components/mold/subject/neural-core-panel.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- No explicit props extracted.

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `print-layout.tsx`

- **Path**: `components/mold/subject/print-layout.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `subject: FullSubjectData`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `share-receiver.tsx`

- **Path**: `components/mold/subject/share-receiver.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useRef, useEffect
- **Slots**: None explicitly detected
- **Properties**:
- `payload: string`
- `onAccept: (subject: FullSubjectData) => void`
- `onDecline: () => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `subject-importer-blocks.tsx`

- **Path**: `components/mold/subject/subject-importer-blocks.tsx`
- **Hydration**: Server Component
- **State Dependencies**: useState, useMemo, useRef
- **Slots**: None explicitly detected
- **Properties**:
- `promptCopied: boolean`
- `onCopyPrompt: (promptText: string) => void`
- `json: string`
- `state: ImporterState`
- `isDragging: boolean`
- `onPaste: () => void`
- `onChange: (value: string) => void`
- `onDragOver: (e: React.DragEvent<HTMLDivElement>) => void`
- `onDragLeave: () => void`
- `onDrop: (e: React.DragEvent<HTMLDivElement>) => void`
- `clipboardBlocked?: boolean`
- `textareaRef?: React.RefObject<HTMLTextAreaElement | null>`
- `state: ImporterState`
- `result: ValidationResult | null`
- `preview: FullSubjectData | null`
- `questionCount: number`
- `flashcardCount: number`
- `categories: string[]`
- `json: string`
- `onChange: (value: string) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `subject-importer-components.tsx`

- **Path**: `components/mold/subject/subject-importer-components.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState
- **Slots**: None explicitly detected
- **Properties**:
- `label: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `subject-importer-steps.tsx`

- **Path**: `components/mold/subject/subject-importer-steps.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `topic: string`
- `setTopic: (val: string) => void`
- `useReferenceBank: boolean`
- `setUseReferenceBank: (val: boolean) => void`
- `selectedPreset: string`
- `onPresetSelect: (presetId: string) => void`
- `subjectType: SubjectTypeBias`
- `setSubjectType: (val: SubjectTypeBias) => void`
- `questionCount: number`
- `setQuestionCount: (val: number) => void`
- `presetJustification: string`
- `onCustomPresetClick: (val: number) => void`
- `topic: string`
- `compiledPrompt: string`
- `promptCopied: boolean`
- `onCopyPrompt: (promptText: string) => void`
- `userMaterial: string`
- `setUserMaterial: (val: string) => void`
- `convertedMaterial: string`
- `setConvertedMaterial: React.Dispatch<React.SetStateAction<string>>`
- `json: string`
- `state: "idle" | "validating" | "valid" | "error" | "pasting" | "importing"`
- `isDragging: boolean`
- `onPaste: () => void`
- `onChange: (val: string) => void`
- `onDragOver: (e: DragEvent<HTMLDivElement>) => void`
- `onDragLeave: () => void`
- `onDrop: (e: DragEvent<HTMLDivElement>) => void`
- `result: ValidationResult | null`
- `preview: FullSubjectData | null`
- `questionCount: number`
- `flashcardCount: number`
- `categories: string[]`
- `clipboardBlocked?: boolean`
- `textareaRef?: React.RefObject<HTMLTextAreaElement | null>`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `subject-importer.tsx`

- **Path**: `components/mold/subject/subject-importer.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useMemo, useState, useRef, useEffect, useCallback
- **Slots**: None explicitly detected
- **Properties**:
- `onImport: (subject: FullSubjectData) => void`
- `onCancel: () => void`
- `existingIds?: string[]`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `subject-selector-blocks.tsx`

- **Path**: `components/mold/subject/subject-selector-blocks.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `subjects: FullSubjectData[]`
- `confirmDeleteId: string | null`
- `onSelect: (subject: FullSubjectData) => void`
- `onShare: (subject: FullSubjectData) => void`
- `onDeleteConfirm: (id: string) => void`
- `onDeleteCancel: () => void`
- `onRemoveClick: (id: string) => void`
- `onShowImporter: () => void`
- `examples: ExampleManifestEntry[]`
- `examplesLoading: boolean`
- `exampleError: string | null`
- `loadingExampleId: string | null`
- `onExampleLoad: (entry: ExampleManifestEntry) => void`
- `onExampleShare: (e: React.MouseEvent, entry: ExampleManifestEntry) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `subject-selector-components.tsx`

- **Path**: `components/mold/subject/subject-selector-components.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `label: string`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `subject-selector.tsx`

- **Path**: `components/mold/subject/subject-selector.tsx`
- **Hydration**: Client Component (`"use client"`)
- **State Dependencies**: useState, useRef, useEffect, useMemo
- **Slots**: None explicitly detected
- **Properties**:
- `subjects: FullSubjectData[]`
- `onSelect: (subject: FullSubjectData) => void`
- `onAddSubject: (subject: FullSubjectData) => void`
- `onRemoveSubject: (id: string) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.

### `user-subject-card.tsx`

- **Path**: `components/mold/subject/user-subject-card.tsx`
- **Hydration**: Server Component
- **State Dependencies**: None detected
- **Slots**: None explicitly detected
- **Properties**:
- `full: FullSubjectData`
- `isConfirming: boolean`
- `categoryCount: number`
- `onSelect: (full: FullSubjectData) => void`
- `onShare: (full: FullSubjectData) => void`
- `onDeleteConfirm: (id: string) => void`
- `onDeleteCancel: () => void`
- `onRemoveClick: (id: string) => void`

- **Performance Characteristics**: Ensure memoization (e.g., `React.memo`) is applied if this component renders frequently with stable props, particularly for complex UI.
- **Edge-case Input Handling and Validation Rules**: Ensure robust null-checking for state derived from context providers. Provide fallback UI if data is missing or undefined. Validate all prop inputs, especially those mapping to arrays or objects to prevent runtime mapping errors. Sanitize user inputs heavily.
