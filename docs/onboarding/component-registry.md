# Frontend Component Registry

This document provides an automated component registry documentation file that specifies the exact properties, slots, state dependencies, and performance characteristics of each UI module. It also documents the client-side lazy-loading logic, asset delivery configurations, and routing states.

## Table of Contents

1. [UI Modules](#ui-modules)
2. [Content Hydration & Lazy Loading](#content-hydration--lazy-loading)
3. [Routing States](#routing-states)
4. [Edge-Case Input Handling & Validation Rules](#edge-case-input-handling--validation-rules)

## UI Modules

### components

#### `theme-provider.tsx`
*   **Path**: `components/theme-provider.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

### components/analytics

#### `clarity-analytics.tsx`
*   **Path**: `components/analytics/clarity-analytics.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `projectId?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.

#### `google-analytics.tsx`
*   **Path**: `components/analytics/google-analytics.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `gaId?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

### components/mold/achievement

#### `achievement-gallery.tsx`
*   **Path**: `components/mold/achievement/achievement-gallery.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `achievement-toast.tsx`
*   **Path**: `components/mold/achievement/achievement-toast.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `toasts`: `ToastItem[]`
    *   `onDismiss`: `(id: string) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.

### components/mold/analytics

#### `analytics-dashboard.tsx`
*   **Path**: `components/mold/analytics/analytics-dashboard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

### components/mold/common

#### `encyclopedia-overlay.tsx`
*   **Path**: `components/mold/common/encyclopedia-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `subject`: `FullSubjectData`
    *   `onClose`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.

#### `footer.tsx`
*   **Path**: `components/mold/common/footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `rightText?`: `string`
    *   `className?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `guide-link.tsx`
*   **Path**: `components/mold/common/guide-link.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `children?`: `React.ReactNode`
    *   `source?`: `string`
    *   `href?`: `string`
    *   Inherits from `Omit`
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `guide-overlay.tsx`
*   **Path**: `components/mold/common/guide-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `open`: `boolean`
    *   `onClose`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `layout-switcher-modal.tsx`
*   **Path**: `components/mold/common/layout-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onClose`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `mermaid-diagram.tsx`
*   **Path**: `components/mold/common/mermaid-diagram.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `chart`: `string`
    *   `id`: `string`
    *   `className?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `onboarding-screen.tsx`
*   **Path**: `components/mold/common/onboarding-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**:
    *   `mode`: `GameMode`
    *   `onSubjectAdded`: `(subject: FullSubjectData) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `rich-text.tsx`
*   **Path**: `components/mold/common/rich-text.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `content`: `string`
    *   `className?`: `string`
    *   `id?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Sanitizes HTML inputs against XSS attacks.

#### `share-modal-blocks.tsx`
*   **Path**: `components/mold/common/share-modal-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `encoding`: `boolean`
    *   `encodeError`: `string | null`
    *   `shareUrl`: `string`
    *   `shortUrl`: `string`
    *   `copyState`: `CopyState`
    *   `shortenState`: `ShortenState`
    *   `shortenError`: `string | null`
    *   `sizeKb`: `string`
    *   `isSizeLarge`: `boolean`
    *   `onCopy`: `() => void`
    *   `onShorten`: `() => void`
    *   `onCopyShortUrl`: `() => void`
    *   `subject`: `FullSubjectData`
    *   `onDownload`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.

#### `share-modal.tsx`
*   **Path**: `components/mold/common/share-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `subject`: `FullSubjectData`
    *   `onClose`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `theme-switcher-modal.tsx`
*   **Path**: `components/mold/common/theme-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onClose`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

### components/mold/flashcard

#### `flashcard-components.tsx`
*   **Path**: `components/mold/flashcard/flashcard-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onQuit`: `() => void`
    *   `progress`: `number`
    *   `position`: `string`
    *   `round`: `number`
    *   `confident`: `number`
    *   `learning`: `number`
    *   `label`: `string`
    *   `value`: `string`
    *   `color`: `string`
    *   `borderColor`: `string`
    *   `label`: `string`
    *   `count`: `number`
    *   `color`: `"emerald" | "red"`
    *   `confident`: `number`
    *   `neutral`: `number`
    *   `learning`: `number`
    *   `total`: `number`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `flashcard-screen-blocks.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `card`: `Flashcard`
    *   `index`: `number`
    *   `flipped`: `boolean`
    *   `animClass`: `string`
    *   `accent`: `{ color: string; border: string; label: string }`
    *   `onFlip`: `() => void`
    *   `onRespond`: `(knew: boolean) => void`
    *   `round`: `number`
    *   `flashcardsLength`: `number`
    *   `confident`: `number`
    *   `neutral`: `number`
    *   `learning`: `number`
    *   `hardest`: `Flashcard | undefined`
    *   `scores`: `Record<string, number>`
    *   `onReturnHome`: `() => void`
    *   `onComplete`: `() => void`
    *   `round`: `number`
    *   `deckLength`: `number`
    *   `flashcardsLength`: `number`
    *   `confident`: `number`
    *   `neutral`: `number`
    *   `learning`: `number`
    *   `roundGotIt`: `number`
    *   `roundStillLearning`: `number`
    *   `hardestCards`: `Flashcard[]`
    *   `scores`: `Record<string, number>`
    *   `onReturnHome`: `() => void`
    *   `onContinue`: `() => void`
    *   `onEndSession`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `flashcard-screen.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `flashcards`: `Flashcard[]`
    *   `subjectId?`: `string`
    *   `onComplete`: `() => void`
    *   `onReturnHome`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `memory-heatmap.tsx`
*   **Path**: `components/mold/flashcard/memory-heatmap.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `cards`: `Flashcard[]`
    *   `retentionMap`: `RetentionMap`
    *   `subjectId`: `string`
    *   `onStartDrill`: `(strategy: "SMART_ADAPTIVE" | "DUE_ONLY" | "CRITICAL_ONLY", category?: string) => void`
    *   `onClose?`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `retention-badge.tsx`
*   **Path**: `components/mold/flashcard/retention-badge.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `urgency`: `CardRetentionState["urgencyLevel"]`
    *   `retrievability?`: `number`
    *   `className?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

### components/mold/game

#### `cheat-sheet-terminal.tsx`
*   **Path**: `components/mold/game/cheat-sheet-terminal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Sanitizes HTML inputs against XSS attacks.

#### `game-error-boundary.tsx`
*   **Path**: `components/mold/game/game-error-boundary.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onReturnHome`: `() => void`
    *   `children`: `ReactNode`
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `game-footer.tsx`
*   **Path**: `components/mold/game/game-footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onHintRequest`: `() => void`
    *   `initialLockRemaining`: `number`
    *   `hintTimeRemaining`: `number`
    *   `hintUsedThisQuestion`: `boolean`
    *   `showHint`: `boolean`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.

#### `game-header.tsx`
*   **Path**: `components/mold/game/game-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.

#### `game-icons.tsx`
*   **Path**: `components/mold/game/game-icons.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `game-runner.tsx`
*   **Path**: `components/mold/game/game-runner.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `config`: `GameConfig`
    *   `subject`: `FullSubjectData`
    *   `runs`: `RunRecord[]`
    *   `onReturnHome`: `() => void`
    *   `onRunComplete?`: `() => void`
    *   `onRunSaved?`: `(run: RunRecord) => void`
    *   `onReturnHome`: `() => void`
    *   `onRunComplete?`: `() => void`
    *   `onRunSaved?`: `(run: RunRecord) => void`
    *   `onInstantRestart?`: `() => void`
    *   `onReDrillMistakes?`: `(mistakes: Question[]) => void`
    *   `config`: `GameConfig`
    *   `runs`: `RunRecord[]`
    *   `showUnlocks`: `(unlocked: Achievement[]) => void`
    *   `subject`: `FullSubjectData`
    *   `value`: `import("@/lib/question-card-context").QuestionCardContextValue`
    *   `accuracyPct`: `number`
    *   `showHint`: `boolean`
*   **Slots**: Contains structural header/footer layout slots.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.

#### `game-stat-cell.tsx`
*   **Path**: `components/mold/game/game-stat-cell.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `question-card-blocks.tsx`
*   **Path**: `components/mold/game/question-card-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Sanitizes HTML inputs against XSS attacks.

#### `question-card-builder.tsx`
*   **Path**: `components/mold/game/question-card-builder.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `idx`: `number`
    *   `label`: `string`
    *   `text?`: `string`
    *   `isSelected`: `boolean`
    *   `isRevealed`: `boolean`
    *   `isCorrect`: `boolean`
    *   `isWrong`: `boolean`
    *   `isDimmed`: `boolean`
    *   `onSelect`: `() => void`
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.
    *   Sanitizes HTML inputs against XSS attacks.

#### `question-card-components.tsx`
*   **Path**: `components/mold/game/question-card-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Sanitizes HTML inputs against XSS attacks.

#### `question-card.tsx`
*   **Path**: `components/mold/game/question-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `results-screen-components.tsx`
*   **Path**: `components/mold/game/results-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `elapsedSeconds`: `number`
    *   `avgTimeSec`: `string | null`
    *   `bestStreak`: `number`
    *   `xpYield`: `number`
    *   `pixels`: `("correct" | "wrong" | "skipped")[]`
    *   `total`: `number`
    *   `pixelCount`: `number`
    *   `score`: `number`
    *   `wrongCountVal`: `number`
    *   `skipCount`: `number`
    *   `modules`: `{     id: string     name: string     pct: number     grade: string   }[]`
    *   `resolveGradeColor`: `(g: string) => string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `results-screen.tsx`
*   **Path**: `components/mold/game/results-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onReturnHome`: `() => void`
    *   `onPlayAgain`: `() => void`
    *   `onReDrillMistakes?`: `(mistakeQuestions: Question[]) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

### components/mold/guide

#### `guide-page-content.tsx`
*   **Path**: `components/mold/guide/guide-page-content.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `guide-sections.tsx`
*   **Path**: `components/mold/guide/guide-sections.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `register`: `(id: SectionId) => (el: HTMLElement | null) => void`
    *   `highlightText?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

### components/mold/home

#### `achievements-panel.tsx`
*   **Path**: `components/mold/home/achievements-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `unlockedCount`: `number`
    *   `totalAchievementsCount`: `number`
    *   `topAchievements`: `AchievementDef[]`
    *   `hasMoreAchievements`: `boolean`
    *   `totalCount`: `number`
    *   `onShowGallery`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `action-hub.tsx`
*   **Path**: `components/mold/home/action-hub.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onInitialize`: `() => void`
    *   `selectedMode`: `GameModeId`
    *   `disabled?`: `boolean`
    *   `className?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `add-questions-wizard.tsx`
*   **Path**: `components/mold/home/add-questions-wizard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `activeSubject`: `FullSubjectData`
    *   `onMerge`: `(mergedSubject: FullSubjectData) => void`
    *   `onCancel`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `bottom-mobile-nav.tsx`
*   **Path**: `components/mold/home/bottom-mobile-nav.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `view`: `AppView`
    *   `setView`: `(view: AppView) => void`
    *   `handleModeSelect`: `(id: GameModeId) => void`
    *   `setShowEncyclopedia`: `(show: boolean) => void`
    *   `setShowGallery`: `(show: boolean) => void`
    *   `onChangeSubject`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `header-well.tsx`
*   **Path**: `components/mold/home/header-well.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `subjectName`: `string`
    *   `description`: `string`
    *   `runCount`: `number`
    *   `visualAccuracyPct`: `number`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `hero-header.tsx`
*   **Path**: `components/mold/home/hero-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `subject`: `SubjectData`
    *   `achievements`: `Achievement[]`
    *   `onTrophyClick?`: `() => void`
    *   `onChangeSubject?`: `() => void`
    *   `onImportNew?`: `() => void`
    *   `className?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.

#### `home-screen-blocks.tsx`
*   **Path**: `components/mold/home/home-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `selectedMode`: `GameModeId`
    *   `handleModeSelect`: `(id: GameModeId) => void`
    *   `handleInitialize`: `() => void`
    *   `config`: `SetupConfig`
    *   `handleConfigChange`: `(patch: Partial<SetupConfig>) => void`
    *   `categories`: `CategoryData[]`
    *   `questions?`: `Question[]`
    *   `subjectId?`: `string`
    *   `unlockedCount`: `number`
    *   `totalAchievementsCount`: `number`
    *   `topAchievements`: `Achievement[]`
    *   `achievements`: `Achievement[]`
    *   `setShowGallery`: `(show: boolean) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `home-screen-components.tsx`
*   **Path**: `components/mold/home/home-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `view`: `AppView`
    *   `setView`: `(view: AppView) => void`
    *   `handleModeSelect`: `(id: GameModeId) => void`
    *   `setShowEncyclopedia`: `(show: boolean) => void`
    *   `setShowGallery`: `(show: boolean) => void`
    *   `onChangeSubject`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `home-screen.tsx`
*   **Path**: `components/mold/home/home-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**:
    *   `activeSubject`: `FullSubjectData`
    *   `allSubjectIds`: `string[]`
    *   `onAddSubject`: `(subject: FullSubjectData) => void`
    *   `onChangeSubject`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `mode-selector.tsx`
*   **Path**: `components/mold/home/mode-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `selected`: `GameModeId`
    *   `onSelect`: `(id: GameModeId) => void`
    *   `onLaunch?`: `() => void`
    *   `className?`: `string`
    *   `label`: `string`
    *   `modes`: `GameMode[]`
    *   `selected`: `GameModeId`
    *   `onSelect`: `(id: GameModeId) => void`
    *   `onLaunch?`: `() => void`
    *   `accent`: `"danger" | "success"`
    *   `startIndex`: `number`
    *   `mode`: `GameMode`
    *   `indexNumber`: `number`
    *   `icon`: `React.ReactNode`
    *   `isSelected`: `boolean`
    *   `onSelect`: `(id: GameModeId) => void`
    *   `onLaunch?`: `() => void`
    *   `selectedClass`: `string`
    *   `accentClass`: `string`
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `performance-table.tsx`
*   **Path**: `components/mold/home/performance-table.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `runs`: `RunRecord[]`
    *   `stats`: `AggregateStats`
    *   `className?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Utilizes ARIA live regions for dynamic updates.

#### `session-stats-panel.tsx`
*   **Path**: `components/mold/home/session-stats-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `setup-panel-blocks.tsx`
*   **Path**: `components/mold/home/setup-panel-blocks.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `config`: `SetupConfig`
    *   `onChange`: `(patch: Partial<SetupConfig>) => void`
    *   `categories`: `CategoryData[]`
    *   `questions?`: `Question[]`
    *   `subjectId?`: `string`
    *   `id`: `string | null`
    *   `name`: `string`
    *   `questionCount`: `number`
    *   `selected`: `boolean`
    *   `recallabilityPct?`: `number`
    *   `onSelect`: `() => void`
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState, useContext
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.

#### `setup-panel.tsx`
*   **Path**: `components/mold/home/setup-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `config`: `SetupConfig`
    *   `onChange`: `(patch: Partial<SetupConfig>) => void`
    *   `selectedMode`: `GameModeId`
    *   `categories`: `CategoryData[]`
    *   `questions?`: `Question[]`
    *   `subjectId?`: `string`
    *   `className?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `side-nav-bar.tsx`
*   **Path**: `components/mold/home/side-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `subjectId`: `string`
    *   `activeView`: `"home" | "stats"`
    *   `onShowDashboard`: `() => void`
    *   `onShowStats`: `() => void`
    *   `onShowEncyclopedia`: `() => void`
    *   `onShowGallery`: `() => void`
    *   `onChangeSubject`: `() => void`
    *   `onImportNew`: `() => void`
    *   `onAddQuestions`: `() => void`
    *   `onInitialize`: `() => void`
    *   `onDownloadHtml`: `() => void`
    *   `onDownloadPdf`: `() => void`
    *   `onDownloadSolvedPdf`: `() => void`
    *   `onShowThemeModal?`: `() => void`
    *   `onShowLayoutModal?`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `stats-screen.tsx`
*   **Path**: `components/mold/home/stats-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onReturnHome`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `streak-ascent.tsx`
*   **Path**: `components/mold/home/streak-ascent.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `currentStreak`: `number`
    *   `bestStreak`: `number`
    *   `isAtRisk?`: `boolean`
    *   `className?`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `subject-visual-card.tsx`
*   **Path**: `components/mold/home/subject-visual-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `subjectId`: `string`
    *   `subjectName`: `string`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `telemetry-panel.tsx`
*   **Path**: `components/mold/home/telemetry-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `top-nav-bar.tsx`
*   **Path**: `components/mold/home/top-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `activeSubjectName?`: `string`
    *   `loadedSubjectsCount?`: `number`
    *   `onShowEncyclopedia?`: `() => void`
    *   `onShowGallery?`: `() => void`
    *   `onImportNew?`: `() => void`
    *   `onShowThemeModal?`: `() => void`
    *   `onShowLayoutModal?`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

### components/mold/layouts

#### `base-page-wrapper.tsx`
*   **Path**: `components/mold/layouts/base-page-wrapper.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `children`: `React.ReactNode`
    *   `topNav?`: `React.ReactNode`
    *   `mobileNav?`: `React.ReactNode`
    *   `footer?`: `React.ReactNode`
    *   `scanlinesClassName?`: `string`
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `default-sidebar-layout.tsx`
*   **Path**: `components/mold/layouts/default-sidebar-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `layout-map.tsx`
*   **Path**: `components/mold/layouts/layout-map.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `split-terminal-layout.tsx`
*   **Path**: `components/mold/layouts/split-terminal-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `zen-focus-layout.tsx`
*   **Path**: `components/mold/layouts/zen-focus-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `zen-minimal-dock-layout.tsx`
*   **Path**: `components/mold/layouts/zen-minimal-dock-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

### components/mold/payment

#### `paywall-modal.tsx`
*   **Path**: `components/mold/payment/paywall-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `isOpen?`: `boolean`
    *   `onClose?`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `revenuecat-logo.tsx`
*   **Path**: `components/mold/payment/revenuecat-logo.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `className?`: `string`
    *   `color?`: `string`
    *   Inherits from `React.SVGProps`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

### components/mold/subject

#### `example-module-card.tsx`
*   **Path**: `components/mold/subject/example-module-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `entry`: `ExampleManifestEntry`
    *   `isLoading`: `boolean`
    *   `onLoad`: `(entry: ExampleManifestEntry) => void`
    *   `onShare`: `(e: React.MouseEvent, entry: ExampleManifestEntry) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `neural-core-panel.tsx`
*   **Path**: `components/mold/subject/neural-core-panel.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `print-layout.tsx`
*   **Path**: `components/mold/subject/print-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `subject`: `FullSubjectData`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `share-receiver.tsx`
*   **Path**: `components/mold/subject/share-receiver.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `payload`: `string`
    *   `onAccept`: `(subject: FullSubjectData) => void`
    *   `onDecline`: `() => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).
    *   Utilizes ARIA live regions for dynamic updates.

#### `subject-importer-blocks.tsx`
*   **Path**: `components/mold/subject/subject-importer-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `promptCopied`: `boolean`
    *   `onCopyPrompt`: `(promptText: string) => void`
    *   `json`: `string`
    *   `state`: `ImporterState`
    *   `isDragging`: `boolean`
    *   `onPaste`: `() => void`
    *   `onChange`: `(value: string) => void`
    *   `onDragOver`: `(e: React.DragEvent<HTMLDivElement>) => void`
    *   `onDragLeave`: `() => void`
    *   `onDrop`: `(e: React.DragEvent<HTMLDivElement>) => void`
    *   `clipboardBlocked?`: `boolean`
    *   `textareaRef?`: `React.RefObject<HTMLTextAreaElement | null>`
    *   `state`: `ImporterState`
    *   `result`: `ValidationResult | null`
    *   `preview`: `FullSubjectData | null`
    *   `questionCount`: `number`
    *   `flashcardCount`: `number`
    *   `categories`: `string[]`
    *   `json`: `string`
    *   `onChange`: `(value: string) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Utilizes ARIA live regions for dynamic updates.

#### `subject-importer-components.tsx`
*   **Path**: `components/mold/subject/subject-importer-components.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `subject-importer-steps.tsx`
*   **Path**: `components/mold/subject/subject-importer-steps.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `topic`: `string`
    *   `setTopic`: `(val: string) => void`
    *   `useReferenceBank`: `boolean`
    *   `setUseReferenceBank`: `(val: boolean) => void`
    *   `selectedPreset`: `string`
    *   `onPresetSelect`: `(presetId: string) => void`
    *   `subjectType`: `SubjectTypeBias`
    *   `setSubjectType`: `(val: SubjectTypeBias) => void`
    *   `questionCount`: `number`
    *   `setQuestionCount`: `(val: number) => void`
    *   `presetJustification`: `string`
    *   `onCustomPresetClick`: `(val: number) => void`
    *   `topic`: `string`
    *   `compiledPrompt`: `string`
    *   `promptCopied`: `boolean`
    *   `onCopyPrompt`: `(promptText: string) => void`
    *   `userMaterial`: `string`
    *   `setUserMaterial`: `(val: string) => void`
    *   `convertedMaterial`: `string`
    *   `setConvertedMaterial`: `React.Dispatch<React.SetStateAction<string>>`
    *   `json`: `string`
    *   `state`: `"idle" | "validating" | "valid" | "error" | "pasting" | "importing"`
    *   `isDragging`: `boolean`
    *   `onPaste`: `() => void`
    *   `onChange`: `(val: string) => void`
    *   `onDragOver`: `(e: DragEvent<HTMLDivElement>) => void`
    *   `onDragLeave`: `() => void`
    *   `onDrop`: `(e: DragEvent<HTMLDivElement>) => void`
    *   `result`: `ValidationResult | null`
    *   `preview`: `FullSubjectData | null`
    *   `questionCount`: `number`
    *   `flashcardCount`: `number`
    *   `categories`: `string[]`
    *   `clipboardBlocked?`: `boolean`
    *   `textareaRef?`: `React.RefObject<HTMLTextAreaElement | null>`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.

#### `subject-importer.tsx`
*   **Path**: `components/mold/subject/subject-importer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `onImport`: `(subject: FullSubjectData) => void`
    *   `onCancel`: `() => void`
    *   `existingIds?`: `string[]`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.

#### `subject-selector-blocks.tsx`
*   **Path**: `components/mold/subject/subject-selector-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `subjects`: `FullSubjectData[]`
    *   `confirmDeleteId`: `string | null`
    *   `onSelect`: `(subject: FullSubjectData) => void`
    *   `onShare`: `(subject: FullSubjectData) => void`
    *   `onDeleteConfirm`: `(id: string) => void`
    *   `onDeleteCancel`: `() => void`
    *   `onRemoveClick`: `(id: string) => void`
    *   `onShowImporter`: `() => void`
    *   `examples`: `ExampleManifestEntry[]`
    *   `examplesLoading`: `boolean`
    *   `exampleError`: `string | null`
    *   `loadingExampleId`: `string | null`
    *   `onExampleLoad`: `(entry: ExampleManifestEntry) => void`
    *   `onExampleShare`: `(e: React.MouseEvent, entry: ExampleManifestEntry) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `subject-selector-components.tsx`
*   **Path**: `components/mold/subject/subject-selector-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   None or generic React props
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `subject-selector.tsx`
*   **Path**: `components/mold/subject/subject-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**:
    *   `subjects`: `FullSubjectData[]`
    *   `onSelect`: `(subject: FullSubjectData) => void`
    *   `onAddSubject`: `(subject: FullSubjectData) => void`
    *   `onRemoveSubject`: `(id: string) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**:
    *   Wraps volatile operations in try/catch blocks.
    *   Implements ARIA accessibility patterns (aria-hidden).

#### `user-subject-card.tsx`
*   **Path**: `components/mold/subject/user-subject-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `full`: `FullSubjectData`
    *   `isConfirming`: `boolean`
    *   `categoryCount`: `number`
    *   `onSelect`: `(full: FullSubjectData) => void`
    *   `onShare`: `(full: FullSubjectData) => void`
    *   `onDeleteConfirm`: `(id: string) => void`
    *   `onDeleteCancel`: `() => void`
    *   `onRemoveClick`: `(id: string) => void`
*   **Slots**: No content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

## Content Hydration & Lazy Loading

*   **Architecture**: The application is built on the Next.js App Router (React Server Components). Server components are the default, ensuring minimal JavaScript payloads delivered to the client.
*   **Hydration Boundary**: Client-side interactivity is tightly controlled. Components requiring state hooks (`useState`, `useEffect`) or event listeners must explicitly declare the `'use client'` directive at the top of the file to establish a hydration boundary.
*   **Lazy Loading via `next/dynamic`**: Heavy, non-critical modules (e.g., complex Recharts graphs or Mermaid diagrams) should be dynamically imported using `next/dynamic` with `ssr: false` where appropriate to bypass server rendering and reduce main-thread blocking during initial hydration.
*   **Asset Delivery & Optimization**:
    *   The project utilizes **Turbopack** for accelerated compilation.
    *   **⚡ Bolt Optimization**: The `next.config.mjs` strictly defines `experimental.optimizePackageImports` for large barrel-file libraries like `lucide-react`, `recharts`, `@clerk/nextjs`, and `tailwind-merge`. This drastically reduces memory overhead during build and hydration phases by strictly loading only the imported modules rather than parsing massive index files.

## Routing States

*   **Server Routing**: Utilizes standard Next.js App Router directory structures (`app/page.tsx`, `app/layout.tsx`) for server-side routing and layout persistence.
*   **Client-Side Routing Hacks**: For highly dynamic, single-page-like experiences (e.g., the `/subjects` dashboard), the application intercepts standard URL paths and heavily utilizes **URL Hash Detection** (`#share=...`).
*   **State Persistence**: Hash-based routing prevents unnecessary server roundtrips, allowing the client application to instantly read the hash (e.g., using `window.location.hash`) and restore local state (like active tabs or shared configuration keys) immediately upon component mount without a network block.

## Edge-Case Input Handling & Validation Rules

*   **Schema Validation**: Form data and user inputs must strictly pass through `zod` schemas and `react-hook-form` before reaching backend APIs or local storage mutations.
*   **Cross-Site Scripting (XSS) Prevention**: Any user-generated string content (especially Markdown or rich text) must be strictly sanitized using `dompurify` (on the client) or `isomorphic-dompurify` (on the server).
*   **Mermaid Diagram Security**: If rendering user-generated Mermaid diagrams, the configuration must strictly enforce `securityLevel: 'strict'` to prevent arbitrary script execution payloads embedded in diagram syntax.
*   **Empty & Loading States**:
    *   When arrays map to lists, empty states must provide clear, accessible feedback wrapped in ARIA live regions (`role="status"` or `aria-live="polite"`).
    *   Buttons processing asynchronous tasks should be marked `disabled={isLoading}` *and* `aria-busy={isLoading}` for screen readers.
*   **Focus Management**: Custom interactive modals or dialogs must implement proper keyboard focus traps. When trapping focus, the `querySelectorAll` logic must explicitly exclude disabled elements (e.g., `button:not([disabled])`) to prevent infinite focus loops or unrecoverable states.
