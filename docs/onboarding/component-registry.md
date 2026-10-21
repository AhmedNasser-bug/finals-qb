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
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `achievement-toast.tsx`
*   **Path**: `components/mold/achievement/achievement-toast.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `toasts`: ToastItem[], `onDismiss`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `encyclopedia-overlay.tsx`
*   **Path**: `components/mold/common/encyclopedia-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`: FullSubjectData, `onClose`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `footer.tsx`
*   **Path**: `components/mold/common/footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `rightText?`: string, `className?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-link.tsx`
*   **Path**: `components/mold/common/guide-link.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `children?`: React.ReactNode, `source?`: string, `href?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-overlay.tsx`
*   **Path**: `components/mold/common/guide-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `open`: boolean, `onClose`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `layout-switcher-modal.tsx`
*   **Path**: `components/mold/common/layout-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onClose`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `mermaid-diagram.tsx`
*   **Path**: `components/mold/common/mermaid-diagram.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `chart`: string, `id`: string, `className?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `onboarding-screen.tsx`
*   **Path**: `components/mold/common/onboarding-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `mode`: GameMode, `onSubjectAdded`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `rich-text.tsx`
*   **Path**: `components/mold/common/rich-text.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `content`: string, `className?`: string, `id?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-modal-blocks.tsx`
*   **Path**: `components/mold/common/share-modal-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `encoding`: boolean, `encodeError`: string | unknown, `shareUrl`: string, `shortUrl`: string, `copyState`: CopyState, `shortenState`: ShortenState, `shortenError`: string | unknown, `sizeKb`: string, `isSizeLarge`: boolean, `onCopy`: Function, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-modal.tsx`
*   **Path**: `components/mold/common/share-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`: FullSubjectData, `onClose`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `theme-switcher-modal.tsx`
*   **Path**: `components/mold/common/theme-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onClose`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `flashcard-components.tsx`
*   **Path**: `components/mold/flashcard/flashcard-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `onQuit`: Function, `progress`: number, `position`: string, `round`: number, `confident`: number, `learning`: number, `label`: string, `value`: string, `color`: string, `borderColor`: string, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `flashcard-screen-blocks.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `card`: Flashcard, `index`: number, `flipped`: boolean, `animClass`: string, `accent`: unknown, `onFlip`: Function, `onRespond`: Function, `round`: number, `flashcardsLength`: number, `confident`: number, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `flashcard-screen.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `flashcards`: Flashcard[], `subjectId?`: string, `onComplete`: Function, `onReturnHome`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `memory-heatmap.tsx`
*   **Path**: `components/mold/flashcard/memory-heatmap.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `cards`: Flashcard[], `retentionMap`: RetentionMap, `subjectId`: string, `onStartDrill`: Function, `onClose?`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `retention-badge.tsx`
*   **Path**: `components/mold/flashcard/retention-badge.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `urgency`: unknown, `retrievability?`: number, `className?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `cheat-sheet-terminal.tsx`
*   **Path**: `components/mold/game/cheat-sheet-terminal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-error-boundary.tsx`
*   **Path**: `components/mold/game/game-error-boundary.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`: Function, `children`: ReactNode
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-footer.tsx`
*   **Path**: `components/mold/game/game-footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onHintRequest`: Function, `initialLockRemaining`: number, `hintTimeRemaining`: number, `hintUsedThisQuestion`: boolean, `showHint`: boolean
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-header.tsx`
*   **Path**: `components/mold/game/game-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-icons.tsx`
*   **Path**: `components/mold/game/game-icons.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-runner.tsx`
*   **Path**: `components/mold/game/game-runner.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `config`: GameConfig, `subject`: FullSubjectData, `runs`: RunRecord[], `onReturnHome`: Function, `onRunComplete?`: Function, `onRunSaved?`: Function, `onReturnHome`: Function, `onRunComplete?`: Function, `onRunSaved?`: Function, `onInstantRestart?`: Function, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-stat-cell.tsx`
*   **Path**: `components/mold/game/game-stat-cell.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card-blocks.tsx`
*   **Path**: `components/mold/game/question-card-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card-builder.tsx`
*   **Path**: `components/mold/game/question-card-builder.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `idx`: number, `label`: string, `text?`: string, `isSelected`: boolean, `isRevealed`: boolean, `isCorrect`: boolean, `isWrong`: boolean, `isDimmed`: boolean, `onSelect`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card-components.tsx`
*   **Path**: `components/mold/game/question-card-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card.tsx`
*   **Path**: `components/mold/game/question-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `results-screen-components.tsx`
*   **Path**: `components/mold/game/results-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `elapsedSeconds`: number, `avgTimeSec`: string | unknown, `bestStreak`: number, `xpYield`: number, `pixels`: unknown[], `total`: number, `pixelCount`: number, `score`: number, `wrongCountVal`: number, `skipCount`: number, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `results-screen.tsx`
*   **Path**: `components/mold/game/results-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`: Function, `onPlayAgain`: Function, `onReDrillMistakes?`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-page-content.tsx`
*   **Path**: `components/mold/guide/guide-page-content.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-sections.tsx`
*   **Path**: `components/mold/guide/guide-sections.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `register`: Function, `highlightText?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `achievements-panel.tsx`
*   **Path**: `components/mold/home/achievements-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `unlockedCount`: number, `totalAchievementsCount`: number, `topAchievements`: AchievementDef[], `hasMoreAchievements`: boolean, `totalCount`: number, `onShowGallery`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `action-hub.tsx`
*   **Path**: `components/mold/home/action-hub.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onInitialize`: Function, `selectedMode`: GameModeId, `disabled?`: boolean, `className?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `add-questions-wizard.tsx`
*   **Path**: `components/mold/home/add-questions-wizard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `activeSubject`: FullSubjectData, `onMerge`: Function, `onCancel`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `bottom-mobile-nav.tsx`
*   **Path**: `components/mold/home/bottom-mobile-nav.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `view`: AppView, `setView`: Function, `handleModeSelect`: Function, `setShowEncyclopedia`: Function, `setShowGallery`: Function, `onChangeSubject`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `header-well.tsx`
*   **Path**: `components/mold/home/header-well.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectName`: string, `description`: string, `runCount`: number, `visualAccuracyPct`: number
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `hero-header.tsx`
*   **Path**: `components/mold/home/hero-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`: SubjectData, `achievements`: Achievement[], `onTrophyClick?`: Function, `onChangeSubject?`: Function, `onImportNew?`: Function, `className?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen-blocks.tsx`
*   **Path**: `components/mold/home/home-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `selectedMode`: GameModeId, `handleModeSelect`: Function, `handleInitialize`: Function, `config`: SetupConfig, `handleConfigChange`: Function, `categories`: CategoryData[], `questions?`: Question[], `subjectId?`: string, `unlockedCount`: number, `totalAchievementsCount`: number, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen-components.tsx`
*   **Path**: `components/mold/home/home-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `view`: AppView, `setView`: Function, `handleModeSelect`: Function, `setShowEncyclopedia`: Function, `setShowGallery`: Function, `onChangeSubject`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen.tsx`
*   **Path**: `components/mold/home/home-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `activeSubject`: FullSubjectData, `allSubjectIds`: string[], `onAddSubject`: Function, `onChangeSubject`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `mode-selector.tsx`
*   **Path**: `components/mold/home/mode-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `selected`: GameModeId, `onSelect`: Function, `onLaunch?`: Function, `className?`: string, `label`: string, `modes`: GameMode[], `selected`: GameModeId, `onSelect`: Function, `onLaunch?`: Function, `accent`: unknown | unknown, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `performance-table.tsx`
*   **Path**: `components/mold/home/performance-table.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `runs`: RunRecord[], `stats`: AggregateStats, `className?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `session-stats-panel.tsx`
*   **Path**: `components/mold/home/session-stats-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `setup-panel-blocks.tsx`
*   **Path**: `components/mold/home/setup-panel-blocks.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `config`: SetupConfig, `onChange`: Function, `categories`: CategoryData[], `questions?`: Question[], `subjectId?`: string, `id`: string | unknown, `name`: string, `questionCount`: number, `selected`: boolean, `recallabilityPct?`: number, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState, useContext
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `setup-panel.tsx`
*   **Path**: `components/mold/home/setup-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `config`: SetupConfig, `onChange`: Function, `selectedMode`: GameModeId, `categories`: CategoryData[], `questions?`: Question[], `subjectId?`: string, `className?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `side-nav-bar.tsx`
*   **Path**: `components/mold/home/side-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectId`: string, `activeView`: unknown | unknown, `onShowDashboard`: Function, `onShowStats`: Function, `onShowEncyclopedia`: Function, `onShowGallery`: Function, `onChangeSubject`: Function, `onImportNew`: Function, `onAddQuestions`: Function, `onInitialize`: Function, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `stats-screen.tsx`
*   **Path**: `components/mold/home/stats-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `streak-ascent.tsx`
*   **Path**: `components/mold/home/streak-ascent.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `currentStreak`: number, `bestStreak`: number, `isAtRisk?`: boolean, `className?`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-visual-card.tsx`
*   **Path**: `components/mold/home/subject-visual-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectId`: string, `subjectName`: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `telemetry-panel.tsx`
*   **Path**: `components/mold/home/telemetry-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `top-nav-bar.tsx`
*   **Path**: `components/mold/home/top-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `activeSubjectName?`: string, `loadedSubjectsCount?`: number, `onShowEncyclopedia?`: Function, `onShowGallery?`: Function, `onImportNew?`: Function, `onShowThemeModal?`: Function, `onShowLayoutModal?`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `default-sidebar-layout.tsx`
*   **Path**: `components/mold/layouts/default-sidebar-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `layout-map.tsx`
*   **Path**: `components/mold/layouts/layout-map.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
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

#### `example-module-card.tsx`
*   **Path**: `components/mold/subject/example-module-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `entry`: ExampleManifestEntry, `isLoading`: boolean, `onLoad`: Function, `onShare`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `neural-core-panel.tsx`
*   **Path**: `components/mold/subject/neural-core-panel.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `print-layout.tsx`
*   **Path**: `components/mold/subject/print-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`: FullSubjectData
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-receiver.tsx`
*   **Path**: `components/mold/subject/share-receiver.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `payload`: string, `onAccept`: Function, `onDecline`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-blocks.tsx`
*   **Path**: `components/mold/subject/subject-importer-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `promptCopied`: boolean, `onCopyPrompt`: Function, `json`: string, `state`: ImporterState, `isDragging`: boolean, `onPaste`: Function, `onChange`: Function, `onDragOver`: Function, `onDragLeave`: Function, `onDrop`: Function, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-components.tsx`
*   **Path**: `components/mold/subject/subject-importer-components.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-steps.tsx`
*   **Path**: `components/mold/subject/subject-importer-steps.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `topic`: string, `setTopic`: Function, `useReferenceBank`: boolean, `setUseReferenceBank`: Function, `selectedPreset`: string, `onPresetSelect`: Function, `subjectType`: SubjectTypeBias, `setSubjectType`: Function, `questionCount`: number, `setQuestionCount`: Function, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer.tsx`
*   **Path**: `components/mold/subject/subject-importer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onImport`: Function, `onCancel`: Function, `existingIds?`: string[]
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector-blocks.tsx`
*   **Path**: `components/mold/subject/subject-selector-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `subjects`: FullSubjectData[], `confirmDeleteId`: string | unknown, `onSelect`: Function, `onShare`: Function, `onDeleteConfirm`: Function, `onDeleteCancel`: Function, `onRemoveClick`: Function, `onShowImporter`: Function, `examples`: ExampleManifestEntry[], `examplesLoading`: boolean, ...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector-components.tsx`
*   **Path**: `components/mold/subject/subject-selector-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector.tsx`
*   **Path**: `components/mold/subject/subject-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `subjects`: FullSubjectData[], `onSelect`: Function, `onAddSubject`: Function, `onRemoveSubject`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `user-subject-card.tsx`
*   **Path**: `components/mold/subject/user-subject-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `full`: FullSubjectData, `isConfirming`: boolean, `categoryCount`: number, `onSelect`: Function, `onShare`: Function, `onDeleteConfirm`: Function, `onDeleteCancel`: Function, `onRemoveClick`: Function
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

### Providers

#### `theme-provider.tsx`
*   **Path**: `components/theme-provider.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.




### Analytics

#### `clarity-analytics.tsx`
*   **Path**: `components/analytics/clarity-analytics.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: projectId?: string
*   **Slots**: None
*   **State Dependencies**: useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `google-analytics.tsx`
*   **Path**: `components/analytics/google-analytics.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: gaId?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `analytics-dashboard.tsx`
*   **Path**: `components/mold/analytics/analytics-dashboard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Achievement

#### `achievement-gallery.tsx`
*   **Path**: `components/mold/achievement/achievement-gallery.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `achievement-toast.tsx`
*   **Path**: `components/mold/achievement/achievement-toast.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: id: string achievement: Achievement
*   **Slots**: None
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Common

#### `encyclopedia-overlay.tsx`
*   **Path**: `components/mold/common/encyclopedia-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: subject: FullSubjectData onClose: () => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `footer.tsx`
*   **Path**: `components/mold/common/footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: rightText?: string className?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-link.tsx`
*   **Path**: `components/mold/common/guide-link.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: children?: React.ReactNode source?: string href?: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-overlay.tsx`
*   **Path**: `components/mold/common/guide-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: open: boolean onClose: () => void
*   **Slots**: None
*   **State Dependencies**: useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `layout-switcher-modal.tsx`
*   **Path**: `components/mold/common/layout-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: onClose: () => void
*   **Slots**: None
*   **State Dependencies**: useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `mermaid-diagram.tsx`
*   **Path**: `components/mold/common/mermaid-diagram.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: code: DiagramErrorCode message: string details?: string
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `onboarding-screen.tsx`
*   **Path**: `components/mold/common/onboarding-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: mode: GameMode;
*   **Slots**: None
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `rich-text.tsx`
*   **Path**: `components/mold/common/rich-text.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: content: string className?: string id?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-modal-blocks.tsx`
*   **Path**: `components/mold/common/share-modal-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: encoding: boolean; encodeError: string | null; shareUrl: string; shortUrl: string; copyState: CopyState; shortenState: ShortenState; shortenError: string | null; sizeKb: string; isSizeLarge: boolea...
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-modal.tsx`
*   **Path**: `components/mold/common/share-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: subject: FullSubjectData onClose: () => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `theme-switcher-modal.tsx`
*   **Path**: `components/mold/common/theme-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: onClose: () => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Flashcard

#### `flashcard-components.tsx`
*   **Path**: `components/mold/flashcard/flashcard-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: onQuit: () => void progress: number position: string round: number confident: number learning: number
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `flashcard-screen-blocks.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: card: Flashcard; index: number; flipped: boolean; animClass: string; accent: { color: string; border: string; label: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `flashcard-screen.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: flashcards: Flashcard[] subjectId?: string onComplete: () => void onReturnHome: () => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `memory-heatmap.tsx`
*   **Path**: `components/mold/flashcard/memory-heatmap.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: cards: Flashcard[] retentionMap: RetentionMap subjectId: string onStartDrill: (strategy: "SMART_ADAPTIVE" | "DUE_ONLY" | "CRITICAL_ONLY", category?: string) => void onClose?: () => void
*   **Slots**: None
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `retention-badge.tsx`
*   **Path**: `components/mold/flashcard/retention-badge.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: urgency: CardRetentionState["urgencyLevel"] retrievability?: number className?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Game

#### `cheat-sheet-terminal.tsx`
*   **Path**: `components/mold/game/cheat-sheet-terminal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-error-boundary.tsx`
*   **Path**: `components/mold/game/game-error-boundary.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: onReturnHome: () => void children: ReactNode
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Implements custom ErrorBoundary.

#### `game-footer.tsx`
*   **Path**: `components/mold/game/game-footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: onHintRequest: () => void initialLockRemaining: number hintTimeRemaining: number hintUsedThisQuestion: boolean showHint: boolean
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-header.tsx`
*   **Path**: `components/mold/game/game-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-icons.tsx`
*   **Path**: `components/mold/game/game-icons.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `game-runner.tsx`
*   **Path**: `components/mold/game/game-runner.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: config: GameConfig /** The active subject — provides questions and flashcards for this run. */ subject: FullSubjectData /** Real persisted run history — used for achievement evaluation (Fix 1-A). *...
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Implements custom ErrorBoundary.

#### `game-stat-cell.tsx`
*   **Path**: `components/mold/game/game-stat-cell.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card-blocks.tsx`
*   **Path**: `components/mold/game/question-card-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card-builder.tsx`
*   **Path**: `components/mold/game/question-card-builder.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: idx: number label: string text?: string isSelected: boolean isRevealed: boolean isCorrect: boolean isWrong: boolean isDimmed: boolean onSelect: () => void
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card-components.tsx`
*   **Path**: `components/mold/game/question-card-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `question-card.tsx`
*   **Path**: `components/mold/game/question-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `results-screen-components.tsx`
*   **Path**: `components/mold/game/results-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: elapsedSeconds: number avgTimeSec: string | null bestStreak: number xpYield: number
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `results-screen.tsx`
*   **Path**: `components/mold/game/results-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: onReturnHome: () => void onPlayAgain: () => void onReDrillMistakes?: (mistakeQuestions: Question[]) => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Guide

#### `guide-page-content.tsx`
*   **Path**: `components/mold/guide/guide-page-content.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `guide-sections.tsx`
*   **Path**: `components/mold/guide/guide-sections.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: register: (id: SectionId) => (el: HTMLElement | null) => void highlightText?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Home

#### `achievements-panel.tsx`
*   **Path**: `components/mold/home/achievements-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: id: string title: string description: string unlockedAt: string | null
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `action-hub.tsx`
*   **Path**: `components/mold/home/action-hub.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: onInitialize: () => void selectedMode: GameModeId disabled?: boolean className?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `add-questions-wizard.tsx`
*   **Path**: `components/mold/home/add-questions-wizard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: activeSubject: FullSubjectData onMerge: (mergedSubject: FullSubjectData) => void onCancel: () => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `bottom-mobile-nav.tsx`
*   **Path**: `components/mold/home/bottom-mobile-nav.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: view: AppView setView: (view: AppView) => void handleModeSelect: (id: GameModeId) => void setShowEncyclopedia: (show: boolean) => void setShowGallery: (show: boolean) => void onChangeSubject: () =>...
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `header-well.tsx`
*   **Path**: `components/mold/home/header-well.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: subjectName: string description: string runCount: number visualAccuracyPct: number
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `hero-header.tsx`
*   **Path**: `components/mold/home/hero-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: subject: SubjectData achievements: Achievement[] onTrophyClick?: () => void onChangeSubject?: () => void onImportNew?: () => void className?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen-blocks.tsx`
*   **Path**: `components/mold/home/home-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: // Mode Selection selectedMode: GameModeId handleModeSelect: (id: GameModeId) => void handleInitialize: () => void // Configuration config: SetupConfig handleConfigChange: (patch: Partial<SetupConf...
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen-components.tsx`
*   **Path**: `components/mold/home/home-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: view: AppView setView: (view: AppView) => void handleModeSelect: (id: GameModeId) => void setShowEncyclopedia: (show: boolean) => void setShowGallery: (show: boolean) => void onChangeSubject: () =>...
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `home-screen.tsx`
*   **Path**: `components/mold/home/home-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: /** The currently active FullSubjectData, chosen by the root orchestrator. */ activeSubject: FullSubjectData /** All subjects in the store — passed down so the importer can check for duplicate ids....
*   **Slots**: None
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `mode-selector.tsx`
*   **Path**: `components/mold/home/mode-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: selected: GameModeId onSelect: (id: GameModeId) => void onLaunch?: () => void className?: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `performance-table.tsx`
*   **Path**: `components/mold/home/performance-table.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: runs: RunRecord[] stats: AggregateStats className?: string
*   **Slots**: None
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `session-stats-panel.tsx`
*   **Path**: `components/mold/home/session-stats-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `setup-panel-blocks.tsx`
*   **Path**: `components/mold/home/setup-panel-blocks.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: config: SetupConfig onChange: (patch: Partial<SetupConfig>) => void
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: useState, useContext
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `setup-panel.tsx`
*   **Path**: `components/mold/home/setup-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: config: SetupConfig onChange: (patch: Partial<SetupConfig>) => void selectedMode: GameModeId categories: CategoryData[] questions?: Question[] subjectId?: string className?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `side-nav-bar.tsx`
*   **Path**: `components/mold/home/side-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: subjectId: string activeView: "home" | "stats" onShowDashboard: () => void onShowStats: () => void onShowEncyclopedia: () => void onShowGallery: () => void onChangeSubject: () => void onImportNew: ...
*   **Slots**: None
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `stats-screen.tsx`
*   **Path**: `components/mold/home/stats-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: onReturnHome: () => void
*   **Slots**: None
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `streak-ascent.tsx`
*   **Path**: `components/mold/home/streak-ascent.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: currentStreak: number bestStreak: number isAtRisk?: boolean // If true, make the flame flicker more intensely/look fragile className?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-visual-card.tsx`
*   **Path**: `components/mold/home/subject-visual-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: subjectId: string subjectName: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `telemetry-panel.tsx`
*   **Path**: `components/mold/home/telemetry-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `top-nav-bar.tsx`
*   **Path**: `components/mold/home/top-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: activeSubjectName?: string loadedSubjectsCount?: number onShowEncyclopedia?: () => void onShowGallery?: () => void onImportNew?: () => void onShowThemeModal?: () => void onShowLayoutModal?: () => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Layouts

#### `base-page-wrapper.tsx`
*   **Path**: `components/mold/layouts/base-page-wrapper.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: children: React.ReactNode topNav?: React.ReactNode mobileNav?: React.ReactNode footer?: React.ReactNode scanlinesClassName?: string
*   **Slots**: Supports `children` prop for content transclusion.
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `default-sidebar-layout.tsx`
*   **Path**: `components/mold/layouts/default-sidebar-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `layout-map.tsx`
*   **Path**: `components/mold/layouts/layout-map.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `split-terminal-layout.tsx`
*   **Path**: `components/mold/layouts/split-terminal-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `zen-focus-layout.tsx`
*   **Path**: `components/mold/layouts/zen-focus-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `zen-minimal-dock-layout.tsx`
*   **Path**: `components/mold/layouts/zen-minimal-dock-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Payment

#### `paywall-modal.tsx`
*   **Path**: `components/mold/payment/paywall-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: isOpen?: boolean onClose?: () => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `revenuecat-logo.tsx`
*   **Path**: `components/mold/payment/revenuecat-logo.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: className?: string color?: string
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Subject

#### `example-module-card.tsx`
*   **Path**: `components/mold/subject/example-module-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: entry: ExampleManifestEntry isLoading: boolean onLoad: (entry: ExampleManifestEntry) => void onShare: (e: React.MouseEvent, entry: ExampleManifestEntry) => void
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `neural-core-panel.tsx`
*   **Path**: `components/mold/subject/neural-core-panel.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `print-layout.tsx`
*   **Path**: `components/mold/subject/print-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: subject: FullSubjectData
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `share-receiver.tsx`
*   **Path**: `components/mold/subject/share-receiver.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: /** The raw Base64url payload extracted from the URL hash. */ payload: string /** Called when the user accepts the import. */ onAccept: (subject: FullSubjectData) => void /** Called when the user d...
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-blocks.tsx`
*   **Path**: `components/mold/subject/subject-importer-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: promptCopied: boolean onCopyPrompt: (promptText: string) => void
*   **Slots**: None
*   **State Dependencies**: useState, useRef
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-components.tsx`
*   **Path**: `components/mold/subject/subject-importer-components.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: useState
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer-steps.tsx`
*   **Path**: `components/mold/subject/subject-importer-steps.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: topic: string setTopic: (val: string) => void useReferenceBank: boolean setUseReferenceBank: (val: boolean) => void selectedPreset: string onPresetSelect: (presetId: string) => void
*   **Slots**: None
*   **State Dependencies**: useState, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-importer.tsx`
*   **Path**: `components/mold/subject/subject-importer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: onImport: (subject: FullSubjectData) => void onCancel: () => void existingIds?: string[]
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector-blocks.tsx`
*   **Path**: `components/mold/subject/subject-selector-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: subjects: FullSubjectData[] confirmDeleteId: string | null onSelect: (subject: FullSubjectData) => void onShare: (subject: FullSubjectData) => void onDeleteConfirm: (id: string) => void onDeleteCan...
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector-components.tsx`
*   **Path**: `components/mold/subject/subject-selector-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `subject-selector.tsx`
*   **Path**: `components/mold/subject/subject-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: subjects: FullSubjectData[] onSelect: (subject: FullSubjectData) => void onAddSubject: (subject: FullSubjectData) => void onRemoveSubject: (id: string) => void
*   **Slots**: None
*   **State Dependencies**: useState, useEffect, useRef
*   **Performance Characteristics**: Requires client JS hydration.
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.

#### `user-subject-card.tsx`
*   **Path**: `components/mold/subject/user-subject-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: full: FullSubjectData isConfirming: boolean categoryCount: number onSelect: (full: FullSubjectData) => void onShare: (full: FullSubjectData) => void onDeleteConfirm: (id: string) => void onDeleteCa...
*   **Slots**: None
*   **State Dependencies**: Stateless
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Inherits standard error boundaries and loading states.


### Theme-provider.tsx

#### `theme-provider.tsx`
*   **Path**: `components/theme-provider.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None or generic React props
*   **Slots**: None
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
