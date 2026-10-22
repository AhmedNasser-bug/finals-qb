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
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `achievement-toast.tsx`
*   **Path**: `components/mold/achievement/achievement-toast.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `toasts`, `onDismiss`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `analytics-dashboard.tsx`
*   **Path**: `components/mold/analytics/analytics-dashboard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `encyclopedia-overlay.tsx`
*   **Path**: `components/mold/common/encyclopedia-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`, `onClose`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `footer.tsx`
*   **Path**: `components/mold/common/footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `rightText`, `className`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `guide-link.tsx`
*   **Path**: `components/mold/common/guide-link.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `source`, `href`
*   **Slots**: Supports `children` prop for nested structural content.
*   **State Dependencies**: Pure presentational (Stateless) + Route dependent
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `guide-overlay.tsx`
*   **Path**: `components/mold/common/guide-overlay.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `open`, `onClose`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect) + Route dependent
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `layout-switcher-modal.tsx`
*   **Path**: `components/mold/common/layout-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onClose`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `mermaid-diagram.tsx`
*   **Path**: `components/mold/common/mermaid-diagram.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `chart`, `id`, `className`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead. Optimally bypasses initial bundle block via lazy evaluation.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `onboarding-screen.tsx`
*   **Path**: `components/mold/common/onboarding-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `mode`, `onSubjectAdded`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead. Optimally bypasses initial bundle block via lazy evaluation.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `rich-text.tsx`
*   **Path**: `components/mold/common/rich-text.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `content`, `className`, `id`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Sanitizes rich text against XSS

#### `share-modal-blocks.tsx`
*   **Path**: `components/mold/common/share-modal-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `encoding`, `encodeError`, `shareUrl`, `shortUrl`, `copyState`, `shortenState`, `shortenError`, `sizeKb`, `isSizeLarge`, `onCopy`, `onShorten`, `onCopyShortUrl`, `subject`, `onDownload`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `share-modal.tsx`
*   **Path**: `components/mold/common/share-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`, `onClose`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `theme-switcher-modal.tsx`
*   **Path**: `components/mold/common/theme-switcher-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onClose`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `flashcard-components.tsx`
*   **Path**: `components/mold/flashcard/flashcard-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `onQuit`, `progress`, `position`, `round`, `confident`, `learning`, `label`, `value`, `color`, `borderColor`, `count`, `neutral`, `total`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `flashcard-screen-blocks.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `card`, `index`, `flipped`, `animClass`, `accent`, `onFlip`, `onRespond`, `round`, `flashcardsLength`, `confident`, `neutral`, `learning`, `hardest`, `scores`, `onReturnHome`, `onComplete`, `deckLength`, `roundGotIt`, `roundStillLearning`, `hardestCards`, `onContinue`, `onEndSession`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `flashcard-screen.tsx`
*   **Path**: `components/mold/flashcard/flashcard-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `flashcards`, `subjectId`, `onComplete`, `onReturnHome`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `memory-heatmap.tsx`
*   **Path**: `components/mold/flashcard/memory-heatmap.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `cards`, `retentionMap`, `subjectId`, `onStartDrill`, `onClose`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `retention-badge.tsx`
*   **Path**: `components/mold/flashcard/retention-badge.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `urgency`, `retrievability`, `className`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `cheat-sheet-terminal.tsx`
*   **Path**: `components/mold/game/cheat-sheet-terminal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers; Sanitizes rich text against XSS

#### `game-error-boundary.tsx`
*   **Path**: `components/mold/game/game-error-boundary.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`
*   **Slots**: Supports `children` prop for nested structural content.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Explicit ErrorBoundary wrapped

#### `game-footer.tsx`
*   **Path**: `components/mold/game/game-footer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onHintRequest`, `initialLockRemaining`, `hintTimeRemaining`, `hintUsedThisQuestion`, `showHint`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `game-header.tsx`
*   **Path**: `components/mold/game/game-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `game-icons.tsx`
*   **Path**: `components/mold/game/game-icons.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `game-runner.tsx`
*   **Path**: `components/mold/game/game-runner.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `config`, `subject`, `runs`, `onReturnHome`, `onRunComplete`, `onRunSaved`, `onInstantRestart`, `onReDrillMistakes`, `showUnlocks`, `value`, `accuracyPct`, `showHint`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead. Optimally bypasses initial bundle block via lazy evaluation.
*   **Edge Case Handling**: Explicit ErrorBoundary wrapped

#### `game-stat-cell.tsx`
*   **Path**: `components/mold/game/game-stat-cell.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `question-card-blocks.tsx`
*   **Path**: `components/mold/game/question-card-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Sanitizes rich text against XSS

#### `question-card-builder.tsx`
*   **Path**: `components/mold/game/question-card-builder.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `idx`, `label`, `text`, `isSelected`, `isRevealed`, `isCorrect`, `isWrong`, `isDimmed`, `onSelect`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead. Optimally bypasses initial bundle block via lazy evaluation.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers; Sanitizes rich text against XSS

#### `question-card-components.tsx`
*   **Path**: `components/mold/game/question-card-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Sanitizes rich text against XSS

#### `question-card-types.ts`
*   **Path**: `components/mold/game/question-card-types.ts`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `idx`, `label`, `text`, `isSelected`, `isRevealed`, `isCorrect`, `isWrong`, `isDimmed`, `onSelect`, `question`, `currentIndex`, `grade`, `gradeColor`, `parts`, `hasDedicatedDiagram`, `diagramBelow`, `renderOptions`, `renderDiagram`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `question-card.tsx`
*   **Path**: `components/mold/game/question-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `results-screen-components.tsx`
*   **Path**: `components/mold/game/results-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `elapsedSeconds`, `avgTimeSec`, `bestStreak`, `xpYield`, `pixels`, `total`, `pixelCount`, `score`, `wrongCountVal`, `skipCount`, `modules`, `resolveGradeColor`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `results-screen.tsx`
*   **Path**: `components/mold/game/results-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`, `onPlayAgain`, `onReDrillMistakes`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `guide-page-content.tsx`
*   **Path**: `components/mold/guide/guide-page-content.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect) + Route dependent
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `guide-sections.tsx`
*   **Path**: `components/mold/guide/guide-sections.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `register`, `highlightText`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `achievements-panel.tsx`
*   **Path**: `components/mold/home/achievements-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `unlockedCount`, `totalAchievementsCount`, `topAchievements`, `hasMoreAchievements`, `totalCount`, `onShowGallery`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `action-hub.tsx`
*   **Path**: `components/mold/home/action-hub.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onInitialize`, `selectedMode`, `disabled`, `className`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `add-questions-wizard.tsx`
*   **Path**: `components/mold/home/add-questions-wizard.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `activeSubject`, `onMerge`, `onCancel`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements aria-busy for loading states; Decorative elements hidden from screen readers

#### `bottom-mobile-nav.tsx`
*   **Path**: `components/mold/home/bottom-mobile-nav.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `view`, `setView`, `handleModeSelect`, `setShowEncyclopedia`, `setShowGallery`, `onChangeSubject`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `header-well.tsx`
*   **Path**: `components/mold/home/header-well.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectName`, `description`, `runCount`, `visualAccuracyPct`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `hero-header.tsx`
*   **Path**: `components/mold/home/hero-header.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`, `achievements`, `onTrophyClick`, `onChangeSubject`, `onImportNew`, `className`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `home-screen-blocks.tsx`
*   **Path**: `components/mold/home/home-screen-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `selectedMode`, `handleModeSelect`, `handleInitialize`, `config`, `handleConfigChange`, `categories`, `questions`, `subjectId`, `unlockedCount`, `totalAchievementsCount`, `topAchievements`, `achievements`, `setShowGallery`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `home-screen-components.tsx`
*   **Path**: `components/mold/home/home-screen-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `view`, `setView`, `handleModeSelect`, `setShowEncyclopedia`, `setShowGallery`, `onChangeSubject`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `home-screen-types.ts`
*   **Path**: `components/mold/home/home-screen-types.ts`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `home-screen.tsx`
*   **Path**: `components/mold/home/home-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `activeSubject`, `allSubjectIds`, `onAddSubject`, `onChangeSubject`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead. Optimally bypasses initial bundle block via lazy evaluation.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `mode-selector.tsx`
*   **Path**: `components/mold/home/mode-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `selected`, `onSelect`, `onLaunch`, `className`, `label`, `modes`, `accent`, `startIndex`, `mode`, `indexNumber`, `icon`, `isSelected`, `selectedClass`, `accentClass`
*   **Slots**: No explicit slots; rigid layout. Accepts custom element injection via: icon.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `performance-table.tsx`
*   **Path**: `components/mold/home/performance-table.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `runs`, `stats`, `className`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states

#### `session-stats-panel.tsx`
*   **Path**: `components/mold/home/session-stats-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `setup-panel-blocks.tsx`
*   **Path**: `components/mold/home/setup-panel-blocks.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `config`, `onChange`, `categories`, `questions`, `subjectId`, `id`, `name`, `questionCount`, `selected`, `recallabilityPct`, `onSelect`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect) + Context dependent
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `setup-panel.tsx`
*   **Path**: `components/mold/home/setup-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `config`, `onChange`, `selectedMode`, `categories`, `questions`, `subjectId`, `className`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `side-nav-bar.tsx`
*   **Path**: `components/mold/home/side-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectId`, `activeView`, `onShowDashboard`, `onShowStats`, `onShowEncyclopedia`, `onShowGallery`, `onChangeSubject`, `onImportNew`, `onAddQuestions`, `onInitialize`, `onDownloadHtml`, `onDownloadPdf`, `onDownloadSolvedPdf`, `onShowThemeModal`, `onShowLayoutModal`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `stats-screen.tsx`
*   **Path**: `components/mold/home/stats-screen.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onReturnHome`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `streak-ascent.tsx`
*   **Path**: `components/mold/home/streak-ascent.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `currentStreak`, `bestStreak`, `isAtRisk`, `className`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `subject-visual-card.tsx`
*   **Path**: `components/mold/home/subject-visual-card.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subjectId`, `subjectName`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `telemetry-panel.tsx`
*   **Path**: `components/mold/home/telemetry-panel.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `top-nav-bar.tsx`
*   **Path**: `components/mold/home/top-nav-bar.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `activeSubjectName`, `loadedSubjectsCount`, `onShowEncyclopedia`, `onShowGallery`, `onImportNew`, `onShowThemeModal`, `onShowLayoutModal`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `base-page-wrapper.tsx`
*   **Path**: `components/mold/layouts/base-page-wrapper.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `topNav`, `mobileNav`, `footer`, `scanlinesClassName`
*   **Slots**: Supports `children` prop for nested structural content.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `default-sidebar-layout.tsx`
*   **Path**: `components/mold/layouts/default-sidebar-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `layout-map.tsx`
*   **Path**: `components/mold/layouts/layout-map.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `split-terminal-layout.tsx`
*   **Path**: `components/mold/layouts/split-terminal-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `zen-focus-layout.tsx`
*   **Path**: `components/mold/layouts/zen-focus-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `zen-minimal-dock-layout.tsx`
*   **Path**: `components/mold/layouts/zen-minimal-dock-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `paywall-modal.tsx`
*   **Path**: `components/mold/payment/paywall-modal.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `isOpen`, `onClose`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `revenuecat-logo.tsx`
*   **Path**: `components/mold/payment/revenuecat-logo.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `className`, `color`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `example-module-card.tsx`
*   **Path**: `components/mold/subject/example-module-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `entry`, `isLoading`, `onLoad`, `onShare`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `neural-core-panel.tsx`
*   **Path**: `components/mold/subject/neural-core-panel.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `print-layout.tsx`
*   **Path**: `components/mold/subject/print-layout.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `subject`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `share-receiver.tsx`
*   **Path**: `components/mold/subject/share-receiver.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `payload`, `onAccept`, `onDecline`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements ARIA live region for async states; Decorative elements hidden from screen readers

#### `subject-importer-blocks.tsx`
*   **Path**: `components/mold/subject/subject-importer-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `promptCopied`, `onCopyPrompt`, `json`, `state`, `isDragging`, `onPaste`, `onChange`, `onDragOver`, `onDragLeave`, `onDrop`, `clipboardBlocked`, `textareaRef`, `result`, `preview`, `questionCount`, `flashcardCount`, `categories`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Implements ARIA live region for async states

#### `subject-importer-components.tsx`
*   **Path**: `components/mold/subject/subject-importer-components.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `subject-importer-steps.tsx`
*   **Path**: `components/mold/subject/subject-importer-steps.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `topic`, `setTopic`, `useReferenceBank`, `setUseReferenceBank`, `selectedPreset`, `onPresetSelect`, `subjectType`, `setSubjectType`, `questionCount`, `setQuestionCount`, `presetJustification`, `onCustomPresetClick`, `compiledPrompt`, `promptCopied`, `onCopyPrompt`, `userMaterial`, `setUserMaterial`, `convertedMaterial`, `setConvertedMaterial`, `json`, `state`, `isDragging`, `onPaste`, `onChange`, `onDragOver`, `onDragLeave`, `onDrop`, `result`, `preview`, `flashcardCount`, `categories`, `clipboardBlocked`, `textareaRef`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `subject-importer.tsx`
*   **Path**: `components/mold/subject/subject-importer.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `onImport`, `onCancel`, `existingIds`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Implements aria-busy for loading states

#### `subject-selector-blocks.tsx`
*   **Path**: `components/mold/subject/subject-selector-blocks.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `subjects`, `confirmDeleteId`, `onSelect`, `onShare`, `onDeleteConfirm`, `onDeleteCancel`, `onRemoveClick`, `onShowImporter`, `examples`, `examplesLoading`, `exampleError`, `loadingExampleId`, `onExampleLoad`, `onExampleShare`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `subject-selector-components.tsx`
*   **Path**: `components/mold/subject/subject-selector-components.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `subject-selector.tsx`
*   **Path**: `components/mold/subject/subject-selector.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: Yes (`next/dynamic`)
*   **Properties**: `subjects`, `onSelect`, `onAddSubject`, `onRemoveSubject`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead. Optimally bypasses initial bundle block via lazy evaluation.
*   **Edge Case Handling**: Decorative elements hidden from screen readers

#### `user-subject-card.tsx`
*   **Path**: `components/mold/subject/user-subject-card.tsx`
*   **Hydration**: Server (RSC)
*   **Dynamic Loading**: No
*   **Properties**: `full`, `isConfirming`, `categoryCount`, `onSelect`, `onShare`, `onDeleteConfirm`, `onDeleteCancel`, `onRemoveClick`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Zero-JS static HTML overhead (RSC).
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

### Providers

#### `theme-provider.tsx`
*   **Path**: `components/theme-provider.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: None structurally explicit (or generic React.FC inferred)
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

### Analytics

#### `clarity-analytics.tsx`
*   **Path**: `components/analytics/clarity-analytics.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `projectId`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Stateful (Internal Hooks: useState/useEffect)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

#### `google-analytics.tsx`
*   **Path**: `components/analytics/google-analytics.tsx`
*   **Hydration**: Client (`use client`)
*   **Dynamic Loading**: No
*   **Properties**: `gaId`
*   **Slots**: No explicit slots; rigid layout.
*   **State Dependencies**: Pure presentational (Stateless)
*   **Performance Characteristics**: Standard Client Hydration overhead.
*   **Edge Case Handling**: Standard fallback: inherits parent error boundaries and structural loading states.

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
