# Frontend Component Registry

This document provides an automated component registry documentation file that specifies the exact properties, slots, state dependencies, and performance characteristics of each UI module. It also documents the client-side lazy-loading logic, asset delivery configurations, and routing states.

## Table of Contents

1. [UI Modules](#ui-modules)
2. [Content Hydration & Lazy Loading](#content-hydration--lazy-loading)
3. [Routing States](#routing-states)
4. [Edge-Case Input Handling & Validation Rules](#edge-case-input-handling--validation-rules)

## UI Modules

### UI Primitives (components/ui)

#### `button.tsx`
*   **Path**: `components/ui/button.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `variant` (enum: 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link'). Controls the visual style via `cva` mappings.
    *   `size` (enum: 'default', 'sm', 'lg', 'icon'). Controls the dimensions.
    *   `asChild` (boolean, default: `false`). When true, the button forwards its props and renders its immediate child as the root element using `@radix-ui/react-slot`.
    *   Inherits all standard `React.ButtonHTMLAttributes<HTMLButtonElement>`.
*   **Slots**:
    *   Supports a polymorphic slot pattern via `@radix-ui/react-slot` when `asChild=true`.
*   **State Dependencies**:
    *   Inherits native DOM states (e.g., `disabled`, `hover`, `focus-visible`).
    *   When disabled, adds `disabled:pointer-events-none disabled:opacity-50`.
    *   For accessibility, disabled buttons communicating async states should also apply `aria-busy={true}` or `aria-hidden="true"` to internal decorative SVGs.
*   **Performance Characteristics**:
    *   High-performance pure functional component.
    *   Uses `cva` for static, deterministic class string generation avoiding expensive runtime interpolations.
*   **Edge Case Handling**:
    *   For accessibility, disabled buttons communicating async states should also apply `aria-busy={true}` or `aria-hidden="true"` to internal decorative SVGs.

#### `card.tsx`
*   **Path**: `components/ui/card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `className` (string).
    *   Inherits all standard `React.HTMLAttributes<HTMLDivElement>`.
*   **Slots**:
    *   `CardHeader`: Flex column layout with padding.
    *   `CardTitle`: Styled `h3`-equivalent heading typography (`text-2xl font-semibold`).
    *   `CardDescription`: Muted text block for context (`text-muted-foreground`).
    *   `CardContent`: Primary content area (`p-6 pt-0`).
    *   `CardFooter`: Aligned flex container for action areas (`p-6 pt-0`).
*   **State Dependencies**:
    *   Fully stateless presentational components.
*   **Performance Characteristics**:
    *   Render overhead is minimal. Class resolution is handled via `cn()` utility mapping.
*   **Edge Case Handling**:
    *   Inherits standard error boundaries and loading states.

#### `input.tsx`
*   **Path**: `components/ui/input.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**:
    *   `type` (string, e.g., 'text', 'email', 'password').
    *   `className` (string).
    *   Inherits all standard `React.InputHTMLAttributes<HTMLInputElement>`.
*   **Slots**:
    *   No specialized internal structural slots.
*   **State Dependencies**:
    *   Uncontrolled by default. Can be managed via React state or `react-hook-form`.
    *   Inherits standard HTMLInputElement state (`disabled`, `readOnly`, `required`).
*   **Performance Characteristics**:
    *   Standard DOM input rendering. Very lightweight.
*   **Edge Case Handling**:
    *   Applies `disabled:cursor-not-allowed` and `disabled:opacity-50` for disabled states natively via Tailwind.
    *   File input types are handled explicitly with specific file pseudo-classes (`file:border-0 file:bg-transparent`).

### Mold Components (components/mold)

#### `achievement-gallery.tsx`
*   **Path**: `components/mold/achievement/achievement-gallery.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useAchievements, useEffect, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `achievement-toast.tsx`
*   **Path**: `components/mold/achievement/achievement-toast.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `toasts`: ToastItem[], `onDismiss`: (id: string) => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useAchievementToast, useEffect, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useCallback).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `achievements-panel.tsx`
*   **Path**: `components/mold/home/achievements-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `unlockedCount`: number, `totalAchievementsCount`: number, `topAchievements`: AchievementDef[], `hasMoreAchievements`: boolean, `totalCount`: number, `onShowGallery`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `action-hub.tsx`
*   **Path**: `components/mold/home/action-hub.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onInitialize`: () => void, `selectedMode`: GameModeId, `disabled`: boolean | undefined, `className`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `add-questions-wizard.tsx`
*   **Path**: `components/mold/home/add-questions-wizard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `activeSubject`: FullSubjectData, `onMerge`: (mergedSubject: FullSubjectData) => void, `onCancel`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo/useCallback).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `analytics-dashboard.tsx`
*   **Path**: `components/mold/analytics/analytics-dashboard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useAuditReport, useEffect, usePointer, usePointerClick, useReport, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo/useCallback).
*   **Edge Case Handling**: Requires careful handling of Web Storage API quotas.

#### `base-page-wrapper.tsx`
*   **Path**: `components/mold/layouts/base-page-wrapper.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `children`: React.ReactNode, `topNav`: React.ReactNode, `mobileNav`: React.ReactNode, `footer`: React.ReactNode, `scanlinesClassName`: string | undefined
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `bottom-mobile-nav.tsx`
*   **Path**: `components/mold/home/bottom-mobile-nav.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `view`: AppView, `setView`: (view: AppView) => void, `handleModeSelect`: (id: GameModeId) => void, `setShowEncyclopedia`: (show: boolean) => void, `setShowGallery`: (show: boolean) => void, `onChangeSubject`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `cheat-sheet-terminal.tsx`
*   **Path**: `components/mold/game/cheat-sheet-terminal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useCheatSheet, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Sanitizes HTML input via DOMPurify to prevent XSS.

#### `default-sidebar-layout.tsx`
*   **Path**: `components/mold/layouts/default-sidebar-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `encyclopedia-overlay.tsx`
*   **Path**: `components/mold/common/encyclopedia-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`: FullSubjectData, `onClose`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `example-module-card.tsx`
*   **Path**: `components/mold/subject/example-module-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `entry`: ExampleManifestEntry, `isLoading`: boolean, `onLoad`: (entry: ExampleManifestEntry) => void, `onShare`: (e: React.MouseEvent<Element, MouseEvent>, entry: ExampleManifestEntry) => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEvent
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `flashcard-components.tsx`
*   **Path**: `components/mold/flashcard/flashcard-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `onQuit`: () => void, `progress`: number, `position`: string, `round`: number, `confident`: number, `learning`: number
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `flashcard-screen-blocks.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `card`: Flashcard, `index`: number, `flipped`: boolean, `animClass`: string, `accent`: { color: string; border: string; label: string; }, `onFlip`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `flashcard-screen.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `flashcards`: Flashcard[], `subjectId`: string | undefined, `onComplete`: () => void, `onReturnHome`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo/useCallback).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `footer.tsx`
*   **Path**: `components/mold/common/footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `rightText`: string | undefined, `className`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-error-boundary.tsx`
*   **Path**: `components/mold/game/game-error-boundary.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`: () => void, `children`: React.ReactNode
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-footer.tsx`
*   **Path**: `components/mold/game/game-footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onHintRequest`: () => void, `initialLockRemaining`: number, `hintTimeRemaining`: number, `hintUsedThisQuestion`: boolean, `showHint`: boolean
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useGameEngine
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-header.tsx`
*   **Path**: `components/mold/game/game-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useCheatSheet, useGameEngine
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-icons.tsx`
*   **Path**: `components/mold/game/game-icons.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-runner.tsx`
*   **Path**: `components/mold/game/game-runner.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `config`: GameConfig, `subject`: FullSubjectData, `runs`: RunRecord[], `onReturnHome`: () => void, `onRunComplete`: (() => void) | undefined, `onRunSaved`: ((run: RunRecord) => void) | undefined
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useAchievementToast, useAchievements, useCheatSheet, useEffect, useGameEngine, useHint, useRef, useState, useStreak
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-stat-cell.tsx`
*   **Path**: `components/mold/game/game-stat-cell.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-link.tsx`
*   **Path**: `components/mold/common/guide-link.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `children`: React.ReactNode, `source`: string | undefined, `href`: string | undefined
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: usePathname, useSearchParams
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-overlay.tsx`
*   **Path**: `components/mold/common/guide-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `open`: boolean, `onClose`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useRouter
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-page-content.tsx`
*   **Path**: `components/mold/guide/guide-page-content.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useRef, useSearchParams, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-sections.tsx`
*   **Path**: `components/mold/guide/guide-sections.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `register`: (id: SectionId) => (el: HTMLElement | null) => void, `highlightText`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Requires careful handling of Web Storage API quotas.

#### `header-well.tsx`
*   **Path**: `components/mold/home/header-well.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectName`: string, `description`: string, `runCount`: number, `visualAccuracyPct`: number
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `hero-header.tsx`
*   **Path**: `components/mold/home/hero-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`: SubjectData, `achievements`: Achievement[], `onTrophyClick`: (() => void) | undefined, `onChangeSubject`: (() => void) | undefined, `onImportNew`: (() => void) | undefined, `className`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen-blocks.tsx`
*   **Path**: `components/mold/home/home-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `selectedMode`: GameModeId, `handleModeSelect`: (id: GameModeId) => void, `handleInitialize`: () => void, `config`: SetupConfig, `handleConfigChange`: (patch: SetupConfig) => void, `categories`: CategoryData[], `questions`: Question[] | undefined, `subjectId`: string | undefined, `unlockedCount`: number, `totalAchievementsCount`: number, `topAchievements`: Achievement[], `achievements`: Achievement[], `setShowGallery`: (show: boolean) => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen-components.tsx`
*   **Path**: `components/mold/home/home-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `view`: import("/app/components/mold/home/home-screen-types").AppView, `setView`: (view: import("/app/components/mold/home/home-screen-types").AppView) => void, `handleModeSelect`: (id: GameModeId) => void, `setShowEncyclopedia`: (show: boolean) => void, `setShowGallery`: (show: boolean) => void, `onChangeSubject`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen-types.ts`
*   **Path**: `components/mold/home/home-screen-types.ts`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen.tsx`
*   **Path**: `components/mold/home/home-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `activeSubject`: FullSubjectData, `allSubjectIds`: string[], `onAddSubject`: (subject: FullSubjectData) => void, `onChangeSubject`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useAchievements, useEffect, usePageLayout, useSafeAuth, useState, useStats
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `layout-map.tsx`
*   **Path**: `components/mold/layouts/layout-map.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `layout-switcher-modal.tsx`
*   **Path**: `components/mold/common/layout-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onClose`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, usePageLayout, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `memory-heatmap.tsx`
*   **Path**: `components/mold/flashcard/memory-heatmap.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `cards`: Flashcard[], `retentionMap`: RetentionMap, `subjectId`: string, `onStartDrill`: (strategy: "SMART_ADAPTIVE" | "DUE_ONLY" | "CRITICAL_ONLY", category?: string | undefined) => void, `onClose`: (() => void) | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEnter, useLeave, useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `mermaid-diagram.tsx`
*   **Path**: `components/mold/common/mermaid-diagram.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `chart`: string, `id`: string, `className`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useMaxWidth, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `mode-selector.tsx`
*   **Path**: `components/mold/home/mode-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `selected`: GameModeId, `onSelect`: (id: GameModeId) => void, `onLaunch`: (() => void) | undefined, `className`: string | undefined
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `neural-core-panel.tsx`
*   **Path**: `components/mold/subject/neural-core-panel.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `onboarding-screen.tsx`
*   **Path**: `components/mold/common/onboarding-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `mode`: GameMode
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `paywall-modal.tsx`
*   **Path**: `components/mold/payment/paywall-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `isOpen`: boolean | undefined, `onClose`: (() => void) | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, usePurchases, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useCallback).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `performance-table.tsx`
*   **Path**: `components/mold/home/performance-table.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `runs`: RunRecord[], `stats`: AggregateStats, `className`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `print-layout.tsx`
*   **Path**: `components/mold/subject/print-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`: FullSubjectData
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card-blocks.tsx`
*   **Path**: `components/mold/game/question-card-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Sanitizes HTML input via DOMPurify to prevent XSS.

#### `question-card-builder.tsx`
*   **Path**: `components/mold/game/question-card-builder.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `idx`: number, `label`: string, `text`: string | undefined, `isSelected`: boolean, `isRevealed`: boolean, `isCorrect`: boolean, `isWrong`: boolean, `isDimmed`: boolean, `onSelect`: () => void
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useGameEngine, useQuestionCard
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Sanitizes HTML input via DOMPurify to prevent XSS.

#### `question-card-components.tsx`
*   **Path**: `components/mold/game/question-card-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Sanitizes HTML input via DOMPurify to prevent XSS.

#### `question-card-types.ts`
*   **Path**: `components/mold/game/question-card-types.ts`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `idx`: number, `label`: string, `text`: string | undefined, `isSelected`: boolean, `isRevealed`: boolean, `isCorrect`: boolean, `isWrong`: boolean, `isDimmed`: boolean, `onSelect`: () => void
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card.tsx`
*   **Path**: `components/mold/game/question-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `results-screen-components.tsx`
*   **Path**: `components/mold/game/results-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `elapsedSeconds`: number, `avgTimeSec`: string | null, `bestStreak`: number, `xpYield`: number
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `results-screen.tsx`
*   **Path**: `components/mold/game/results-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`: () => void, `onPlayAgain`: () => void, `onReDrillMistakes`: ((mistakeQuestions: Question[]) => void) | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useGameEngine, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo/useCallback).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `retention-badge.tsx`
*   **Path**: `components/mold/flashcard/retention-badge.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `urgency`: CardRetentionState, `retrievability`: number | undefined, `className`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `revenuecat-logo.tsx`
*   **Path**: `components/mold/payment/revenuecat-logo.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `className`: string | undefined, `color`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `rich-text.tsx`
*   **Path**: `components/mold/common/rich-text.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `content`: string, `className`: string | undefined, `id`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Sanitizes HTML input via DOMPurify to prevent XSS.

#### `session-stats-panel.tsx`
*   **Path**: `components/mold/home/session-stats-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useStats
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `setup-panel-blocks.tsx`
*   **Path**: `components/mold/home/setup-panel-blocks.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `config`: SetupConfig, `onChange`: (patch: SetupConfig) => void, `categories`: CategoryData[], `questions`: Question[] | undefined, `subjectId`: string | undefined
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useConfigControls, useContext, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `setup-panel.tsx`
*   **Path**: `components/mold/home/setup-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `config`: SetupConfig, `onChange`: (patch: SetupConfig) => void, `selectedMode`: GameModeId, `categories`: CategoryData[], `questions`: Question[] | undefined, `subjectId`: string | undefined, `className`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-modal-blocks.tsx`
*   **Path**: `components/mold/common/share-modal-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `encoding`: boolean, `encodeError`: string | null, `shareUrl`: string, `shortUrl`: string, `copyState`: import("/app/components/mold/common/share-modal-blocks").CopyState, `shortenState`: import("/app/components/mold/common/share-modal-blocks").ShortenState, `shortenError`: string | null, `sizeKb`: string, `isSizeLarge`: boolean, `onCopy`: () => void, `onShorten`: () => void, `onCopyShortUrl`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-modal.tsx`
*   **Path**: `components/mold/common/share-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`: FullSubjectData, `onClose`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useCallback).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-receiver.tsx`
*   **Path**: `components/mold/subject/share-receiver.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `payload`: string, `onAccept`: (subject: FullSubjectData) => void, `onDecline`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `side-nav-bar.tsx`
*   **Path**: `components/mold/home/side-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectId`: string, `activeView`: "home" | "stats", `onShowDashboard`: () => void, `onShowStats`: () => void, `onShowEncyclopedia`: () => void, `onShowGallery`: () => void, `onChangeSubject`: () => void, `onImportNew`: () => void, `onAddQuestions`: () => void, `onInitialize`: () => void, `onDownloadHtml`: () => void, `onDownloadPdf`: () => void, `onDownloadSolvedPdf`: () => void, `onShowThemeModal`: (() => void) | undefined, `onShowLayoutModal`: (() => void) | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `split-terminal-layout.tsx`
*   **Path**: `components/mold/layouts/split-terminal-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `stats-screen.tsx`
*   **Path**: `components/mold/home/stats-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useState, useStats
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `streak-ascent.tsx`
*   **Path**: `components/mold/home/streak-ascent.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `currentStreak`: number, `bestStreak`: number, `isAtRisk`: boolean | undefined, `className`: string | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-blocks.tsx`
*   **Path**: `components/mold/subject/subject-importer-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `promptCopied`: boolean, `onCopyPrompt`: (promptText: string) => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useRef, useReferenceBank, useState
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC). Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-components.tsx`
*   **Path**: `components/mold/subject/subject-importer-components.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEnter, useLeave, useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-steps.tsx`
*   **Path**: `components/mold/subject/subject-importer-steps.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `topic`: string, `setTopic`: (val: string) => void, `useReferenceBank`: boolean, `setUseReferenceBank`: (val: boolean) => void, `selectedPreset`: string, `onPresetSelect`: (presetId: string) => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useReferenceBank, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useCallback).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer.tsx`
*   **Path**: `components/mold/subject/subject-importer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onImport`: (subject: FullSubjectData) => void, `onCancel`: () => void, `existingIds`: string[] | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useRef, useReferenceBank, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo/useCallback).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector-blocks.tsx`
*   **Path**: `components/mold/subject/subject-selector-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `subjects`: FullSubjectData[], `confirmDeleteId`: string | null, `onSelect`: (subject: FullSubjectData) => void, `onShare`: (subject: FullSubjectData) => void, `onDeleteConfirm`: (id: string) => void, `onDeleteCancel`: () => void, `onRemoveClick`: (id: string) => void, `onShowImporter`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEvent
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector-components.tsx`
*   **Path**: `components/mold/subject/subject-selector-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector.tsx`
*   **Path**: `components/mold/subject/subject-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `subjects`: FullSubjectData[], `onSelect`: (subject: FullSubjectData) => void, `onAddSubject`: (subject: FullSubjectData) => void, `onRemoveSubject`: (id: string) => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useEffect, useEvent, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-visual-card.tsx`
*   **Path**: `components/mold/home/subject-visual-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectId`: string, `subjectName`: string
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `telemetry-panel.tsx`
*   **Path**: `components/mold/home/telemetry-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useStats
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `theme-switcher-modal.tsx`
*   **Path**: `components/mold/common/theme-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onClose`: () => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useColorTheme, useEffect, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration. Uses memoization (useMemo).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `top-nav-bar.tsx`
*   **Path**: `components/mold/home/top-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `activeSubjectName`: string | undefined, `loadedSubjectsCount`: number | undefined, `onShowEncyclopedia`: (() => void) | undefined, `onShowGallery`: (() => void) | undefined, `onImportNew`: (() => void) | undefined, `onShowThemeModal`: (() => void) | undefined, `onShowLayoutModal`: (() => void) | undefined
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: useColorTheme, useEffect, useEvent, usePurchases, useRef, useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `user-subject-card.tsx`
*   **Path**: `components/mold/subject/user-subject-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `full`: FullSubjectData, `isConfirming`: boolean, `categoryCount`: number, `onSelect`: (full: FullSubjectData) => void, `onShare`: (full: FullSubjectData) => void, `onDeleteConfirm`: (id: string) => void, `onDeleteCancel`: () => void, `onRemoveClick`: (id: string) => void
*   **Slots**: No specialized internal structural slots.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `zen-focus-layout.tsx`
*   **Path**: `components/mold/layouts/zen-focus-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `zen-minimal-dock-layout.tsx`
*   **Path**: `components/mold/layouts/zen-minimal-dock-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

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
