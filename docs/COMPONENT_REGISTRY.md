# Frontend Component Registry

This document serves as an automated component registry documentation file, specifying the properties, slots, state dependencies, and performance characteristics of each UI module. It also outlines client-side lazy-loading logic, asset delivery configurations, and routing states.

## Table of Contents

1. [Overview](#overview)
2. [Hydration & Lazy Loading](#hydration--lazy-loading)
3. [Routing & Asset Delivery](#routing--asset-delivery)
4. [Component Registry](#component-registry)
5. [Edge-Case Input Handling & Validation](#edge-case-input-handling--validation)

## Overview

The modern frontend repository is built with Next.js, React, TypeScript, and Tailwind CSS. It uses client-side state management through React Context and local storage, enabling a highly interactive, offline-first experience.

## Hydration & Lazy Loading

*   **Client Components:** Components handling interactivity (using hooks like `useState`, `useEffect`, or `useContext`) are designated as client components using the `"use client"` directive. This instructs Next.js to hydrate these components on the client-side.
*   **Lazy Loading:** Heavy components or routes may be lazy-loaded using `next/dynamic` or `React.lazy` to reduce the initial bundle size and improve load times.
*   **Suspense:** Boundaries are used to provide fallback UIs while lazy-loaded components or async data are being fetched.

## Routing & Asset Delivery

*   **App Router:** Next.js App Router (`app/`) is used for routing, supporting server components by default, nested layouts, and loading states.
*   **Asset Delivery:** Static assets are served from the `public/` directory. Next.js automatically optimizes images using `next/image`.
*   **Offline-First:** Critical game state and user progress are stored locally (`localStorage`), allowing immediate access and offline capabilities.

## Component Registry

### Directory: `components/analytics`

#### `clarity-analytics.tsx`

- **Exports:** `MicrosoftClarity`
- **Props Interface:** `MicrosoftClarityProps`
- **Characteristics:** Client Component (Hydrated), Uses Side-Effects (useEffect)

#### `google-analytics.tsx`

- **Exports:** `GoogleAnalytics`
- **Props Interface:** `GoogleAnalyticsProps`
- **Characteristics:** Client Component (Hydrated)

### Directory: `components/mold/achievement`

#### `achievement-gallery.tsx`

- **Exports:** `AchievementGallery`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect), Consumes Global Context/Hooks

#### `achievement-toast.tsx`

- **Exports:** `useAchievementToast`, `AchievementToastContainer`
- **Props Interface:** `AchievementToastContainerProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

### Directory: `components/mold/analytics`

#### `analytics-dashboard.tsx`

- **Exports:** `AnalyticsDashboard`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

### Directory: `components/mold/common`

#### `encyclopedia-overlay.tsx`

- **Exports:** `EncyclopediaOverlay`
- **Props Interface:** `EncyclopediaOverlayProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `footer.tsx`

- **Exports:** `Footer`
- **Props Interface:** `FooterProps`
- **Characteristics:** Client Component (Hydrated)

#### `guide-link.tsx`

- **Exports:** `GuideLink`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `guide-overlay.tsx`

- **Exports:** `GuideOverlay`
- **Props Interface:** `GuideOverlayProps`
- **Characteristics:** Client Component (Hydrated), Uses Side-Effects (useEffect)

#### `layout-switcher-modal.tsx`

- **Exports:** `LayoutSwitcherModal`
- **Props Interface:** `LayoutSwitcherModalProps`
- **Characteristics:** Client Component (Hydrated), Uses Side-Effects (useEffect)

#### `mermaid-diagram.tsx`

- **Exports:** `MermaidDiagram`
- **Props Interface:** `MermaidDiagramProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `onboarding-screen.tsx`

- **Exports:** `OnboardingScreen`
- **Props Interface:** `ModeCardProps`, `OnboardingScreenProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Lazy Loading (dynamic/lazy)

#### `rich-text.tsx`

- **Exports:** `parseRichTextParts`, `RichText`
- **Props Interface:** `RichTextProps`
- **Characteristics:** Client Component (Hydrated)

#### `share-modal-blocks.tsx`

- **Exports:** `LinkTabContent`, `FileTabContent`, `CloseIcon`, `SpinnerIcon`, `InfoIcon`, `WarnIcon`
- **Props Interface:** `LinkTabContentProps`, `FileTabContentProps`
- **Characteristics:** Stateless / Pure UI

#### `share-modal.tsx`

- **Exports:** `ShareModal`
- **Props Interface:** `ShareModalProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `theme-switcher-modal.tsx`

- **Exports:** `ThemeSwitcherModal`
- **Props Interface:** `ThemeSwitcherModalProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

### Directory: `components/mold/flashcard`

#### `flashcard-components.tsx`

- **Exports:** `Header`, `StatCell`, `ScorePill`, `DistributionBar`
- **Props Interface:** `HeaderProps`, `StatCellProps`, `ScorePillProps`, `DistributionBarProps`
- **Characteristics:** Stateless / Pure UI

#### `flashcard-screen-blocks.tsx`

- **Exports:** `FlashcardDossierCard`, `FlashcardResponseControls`, `SessionEndScreen`, `RoundEndScreen`
- **Props Interface:** `FlashcardDossierCardProps`, `FlashcardResponseControlsProps`, `SessionEndScreenProps`, `RoundEndScreenProps`
- **Characteristics:** Stateless / Pure UI

#### `flashcard-screen.tsx`

- **Exports:** `FlashcardScreen`
- **Props Interface:** `FlashcardScreenProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `memory-heatmap.tsx`

- **Exports:** `MemoryHeatmap`
- **Props Interface:** `MemoryHeatmapProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State

#### `retention-badge.tsx`

- **Exports:** `RetentionBadge`
- **Props Interface:** `RetentionBadgeProps`
- **Characteristics:** Stateless / Pure UI

### Directory: `components/mold/game`

#### `cheat-sheet-terminal.tsx`

- **Exports:** `CheatSheetTerminal`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated), Uses Side-Effects (useEffect)

#### `game-error-boundary.tsx`

- **Exports:** `GameErrorBoundary`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `game-footer.tsx`

- **Exports:** `GameFooter`
- **Props Interface:** `GameFooterProps`
- **Characteristics:** Client Component (Hydrated), Consumes Global Context/Hooks

#### `game-header.tsx`

- **Exports:** `GameHeader`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated), Consumes Global Context/Hooks

#### `game-icons.tsx`

- **Exports:** `BoltIcon`, `HeartIcon`, `CheckIcon`, `XIcon`, `LightbulbIcon`, `CheckCircleIcon`, `RadioIcon`, `SkipIcon`, `ChevronRightIcon`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `game-runner.tsx`

- **Exports:** `GameRunner`
- **Props Interface:** `GameRunnerProps`, `InnerProps`, `QuestionCardVariantProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect), Consumes Global Context/Hooks

#### `game-stat-cell.tsx`

- **Exports:** `StatCell`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `question-card-blocks.tsx`

- **Exports:** `QuestionHeader`, `QuestionContent`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `question-card-builder.tsx`

- **Exports:** `QuestionCard`
- **Props Interface:** `OptionButtonProps`
- **Characteristics:** Client Component (Hydrated), Consumes Global Context/Hooks

#### `question-card-components.tsx`

- **Exports:** `OptionButton`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `question-card-types.ts`

- **Exports:** None
- **Props Interface:** `OptionButtonProps`, `QuestionHeaderProps`, `QuestionContentProps`
- **Characteristics:** Stateless / Pure UI

#### `question-card.tsx`

- **Exports:** None
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `results-screen-components.tsx`

- **Exports:** `StatsGrid`, `SequenceMap`, `ModulePerformance`
- **Props Interface:** `StatsGridProps`, `SequenceMapProps`, `ModulePerformanceProps`
- **Characteristics:** Stateless / Pure UI

#### `results-screen.tsx`

- **Exports:** `ResultsScreen`
- **Props Interface:** `ResultsScreenProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect), Consumes Global Context/Hooks

### Directory: `components/mold/guide`

#### `guide-page-content.tsx`

- **Exports:** `GuidePageContent`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `guide-sections.tsx`

- **Exports:** `SectionHeader`, `OverviewSection`, `QuickStartSection`, `GameModesSection`, `ScienceSection`, `ScoringSection`, `FlashcardsSection`, `AIImportSection`, `ShortcutsSection`, `TipsSection`, `ProjectLinksSection`
- **Props Interface:** `SectionProps`
- **Characteristics:** Client Component (Hydrated)

### Directory: `components/mold/home`

#### `achievements-panel.tsx`

- **Exports:** `AchievementsPanel`
- **Props Interface:** `AchievementsPanelProps`
- **Characteristics:** Client Component (Hydrated)

#### `action-hub.tsx`

- **Exports:** `ActionHub`
- **Props Interface:** `ActionHubProps`
- **Characteristics:** Client Component (Hydrated)

#### `add-questions-wizard.tsx`

- **Exports:** `AddQuestionsWizard`
- **Props Interface:** `AddQuestionsWizardProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `bottom-mobile-nav.tsx`

- **Exports:** `BottomMobileNav`
- **Props Interface:** `BottomMobileNavProps`
- **Characteristics:** Client Component (Hydrated)

#### `header-well.tsx`

- **Exports:** `HeaderWell`
- **Props Interface:** `HeaderWellProps`
- **Characteristics:** Client Component (Hydrated)

#### `hero-header.tsx`

- **Exports:** `HeroHeader`
- **Props Interface:** `HeroHeaderProps`
- **Characteristics:** Client Component (Hydrated)

#### `home-screen-blocks.tsx`

- **Exports:** `MainContentGrid`
- **Props Interface:** `MainContentGridProps`
- **Characteristics:** Stateless / Pure UI

#### `home-screen-components.tsx`

- **Exports:** `MobileBottomNavBar`
- **Props Interface:** `MobileBottomNavBarProps`
- **Characteristics:** Stateless / Pure UI

#### `home-screen-types.ts`

- **Exports:** None
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `home-screen.tsx`

- **Exports:** `HomeScreen`
- **Props Interface:** `HomeScreenProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect), Consumes Global Context/Hooks, Uses Lazy Loading (dynamic/lazy)

#### `mode-selector.tsx`

- **Exports:** `ModeSelector`
- **Props Interface:** `ModeSelectorProps`, `ModeGroupProps`, `ModeCardProps`
- **Characteristics:** Client Component (Hydrated)

#### `performance-table.tsx`

- **Exports:** `PerformanceTable`
- **Props Interface:** `PerformanceTableProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State

#### `session-stats-panel.tsx`

- **Exports:** `SessionStatsPanel`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `setup-panel-blocks.tsx`

- **Exports:** `ConfigControls`, `TimeLimitToggle`, `HintSystemToggle`, `QuestionCountGroup`, `RevisionNote`, `CategorySelectorSection`, `ConfigRow`, `Toggle`, `CategoryTile`
- **Props Interface:** `CategorySelectorSectionProps`, `CategoryTileProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Consumes Global Context/Hooks

#### `setup-panel.tsx`

- **Exports:** `SetupPanel`
- **Props Interface:** `SetupPanelProps`
- **Characteristics:** Client Component (Hydrated)

#### `side-nav-bar.tsx`

- **Exports:** `SideNavBar`
- **Props Interface:** `SideNavBarProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State

#### `stats-screen.tsx`

- **Exports:** `StatsScreen`
- **Props Interface:** `StatsScreenProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State

#### `streak-ascent.tsx`

- **Exports:** `STREAK_TIERS`, `getStreakTier`, `getNextMilestone`, `StreakAscent`
- **Props Interface:** `StreakAscentProps`
- **Characteristics:** Client Component (Hydrated)

#### `subject-visual-card.tsx`

- **Exports:** `SubjectVisualCard`
- **Props Interface:** `SubjectVisualCardProps`
- **Characteristics:** Client Component (Hydrated)

#### `telemetry-panel.tsx`

- **Exports:** `TelemetryPanel`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `top-nav-bar.tsx`

- **Exports:** `TopNavBar`
- **Props Interface:** `TopNavBarProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

### Directory: `components/mold/layouts`

#### `base-page-wrapper.tsx`

- **Exports:** `BasePageWrapper`
- **Props Interface:** `BasePageWrapperProps`
- **Characteristics:** Stateless / Pure UI

#### `default-sidebar-layout.tsx`

- **Exports:** `DefaultSidebarLayout`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `layout-map.tsx`

- **Exports:** `LAYOUT_COMPONENTS`, `resolveLayoutComponent`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `split-terminal-layout.tsx`

- **Exports:** `SplitTerminalLayout`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `zen-focus-layout.tsx`

- **Exports:** `ZenFocusLayout`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

#### `zen-minimal-dock-layout.tsx`

- **Exports:** `ZenMinimalDockLayout`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

### Directory: `components/mold/payment`

#### `paywall-modal.tsx`

- **Exports:** `PaywallModal`
- **Props Interface:** `PaywallModalProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `revenuecat-logo.tsx`

- **Exports:** `RevenueCatLogo`, `RevenueCatBadge`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

### Directory: `components/mold/subject`

#### `example-module-card.tsx`

- **Exports:** `ExampleModuleCard`
- **Props Interface:** `ExampleModuleCardProps`
- **Characteristics:** Stateless / Pure UI

#### `neural-core-panel.tsx`

- **Exports:** `NeuralCorePanel`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `print-layout.tsx`

- **Exports:** `PrintLayout`
- **Props Interface:** `PrintLayoutProps`
- **Characteristics:** Client Component (Hydrated)

#### `share-receiver.tsx`

- **Exports:** `ShareReceiver`
- **Props Interface:** `ShareReceiverProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `subject-importer-blocks.tsx`

- **Exports:** `AIPromptSection`, `DropZoneSection`, `ValidationFeedbackSection`
- **Props Interface:** `AIPromptSectionProps`, `DropZoneSectionProps`, `ValidationFeedbackSectionProps`
- **Characteristics:** Manages Local State

#### `subject-importer-components.tsx`

- **Exports:** `StatChip`, `CloseIcon`, `InfoToolbox`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated), Manages Local State

#### `subject-importer-steps.tsx`

- **Exports:** `Step1PresetTopic`, `Step2SubjectType`, `Step3QuestionCount`, `Step4PromptBuild`, `Step5LoadData`
- **Props Interface:** `Step1PresetTopicProps`, `Step2SubjectTypeProps`, `Step3QuestionCountProps`, `Step4PromptBuildProps`, `Step5LoadDataProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State

#### `subject-importer.tsx`

- **Exports:** `SubjectImporter`
- **Props Interface:** `SubjectImporterProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect)

#### `subject-selector-blocks.tsx`

- **Exports:** `WelcomeBanner`, `YourSubjectsSection`, `ExampleModulesSection`
- **Props Interface:** `YourSubjectsSectionProps`, `ExampleModulesSectionProps`
- **Characteristics:** Stateless / Pure UI

#### `subject-selector-components.tsx`

- **Exports:** `SectionLabel`, `StatPill`, `ProtocolIcon`, `PlusIcon`, `ShareIcon`, `SpinnerIcon`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `subject-selector.tsx`

- **Exports:** `SubjectSelector`
- **Props Interface:** `SubjectSelectorProps`
- **Characteristics:** Client Component (Hydrated), Manages Local State, Uses Side-Effects (useEffect), Uses Lazy Loading (dynamic/lazy)

#### `user-subject-card.tsx`

- **Exports:** `UserSubjectCard`
- **Props Interface:** `UserSubjectCardProps`
- **Characteristics:** Stateless / Pure UI

### Directory: `components`

#### `theme-provider.tsx`

- **Exports:** `ThemeProvider`
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Client Component (Hydrated)

### Directory: `components/ui`

#### `button.tsx`

- **Exports:** None
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `card.tsx`

- **Exports:** None
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

#### `input.tsx`

- **Exports:** None
- **Props Interface:** Inferred / Implicit
- **Characteristics:** Stateless / Pure UI

## Edge-Case Input Handling & Validation

1.  **Component Fallbacks:** All dynamic UI components must gracefully handle missing or undefined props (e.g., optional descriptions, empty lists) by providing sensible defaults or rendering fallback states.
2.  **Form Validation:** User inputs (e.g., question count, hints configuration) should use proper HTML validation attributes and controlled React state to prevent invalid submissions.
3.  **State Guards:** Context consumers must check if they are wrapped in their corresponding provider and fail gracefully or throw explicit errors in development if the context is null.
4.  **Error Boundaries:** Use `GameErrorBoundary` to catch React rendering errors in critical paths (like the game runner) to prevent the entire app from crashing and provide a recovery UI.
