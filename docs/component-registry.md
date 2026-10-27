# Component Registry Developer Guide

This automated registry specifies exact properties, slots, state dependencies, and performance characteristics of UI modules.

## Content Hydration & Delivery

- **Client-Side Lazy Loading**: Components containing heavy libraries (like recharts or mermaid) or non-critical islands are typically wrapped in `next/dynamic`.
- **Asset Delivery**: Assets are optimized via Next.js pipelines. Heavy visuals are requested asynchronously.
- **Routing States**: Handled by App Router. React Server Components are default unless `'use client'` is present.
- **Edge-case Input Handling**: Forms validate via `zod`, and telemetry payloads are sanitized via `maskData`. Empty states must have `role="status"` and `aria-live="polite"`.

### clarity-analytics.tsx
- **Path**: `components/analytics/clarity-analytics.tsx`
- **Type**: Client Component
- **Properties**: `projectId`
- **Slots**: None
- **State Dependencies**: `useEffect`

### google-analytics.tsx
- **Path**: `components/analytics/google-analytics.tsx`
- **Type**: Client Component
- **Properties**: `gaId`
- **Slots**: None
- **State Dependencies**: None

### achievement-gallery.tsx
- **Path**: `components/mold/achievement/achievement-gallery.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: `useAchievements, useRef, useEffect, useMemo, useState`

### achievement-toast.tsx
- **Path**: `components/mold/achievement/achievement-toast.tsx`
- **Type**: Client Component
- **Properties**: `toasts, onDismiss`
- **Slots**: None
- **State Dependencies**: `useState, useCallback, useEffect`

### analytics-dashboard.tsx
- **Path**: `components/mold/analytics/analytics-dashboard.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: `useState, useCallback, useEffect, useMemo`

### encyclopedia-overlay.tsx
- **Path**: `components/mold/common/encyclopedia-overlay.tsx`
- **Type**: Client Component
- **Properties**: `subject, onClose`
- **Slots**: None
- **State Dependencies**: `useState, useRef, useEffect`

### footer.tsx
- **Path**: `components/mold/common/footer.tsx`
- **Type**: Client Component
- **Properties**: `rightText, className`
- **Slots**: None
- **State Dependencies**: None

### guide-link.tsx
- **Path**: `components/mold/common/guide-link.tsx`
- **Type**: Client Component
- **Properties**: `children, source, href`
- **Slots**: `children`
- **State Dependencies**: `usePathname, useSearchParams, useMemo`

### guide-overlay.tsx
- **Path**: `components/mold/common/guide-overlay.tsx`
- **Type**: Client Component
- **Properties**: `open, onClose`
- **Slots**: None
- **State Dependencies**: `useRouter, useEffect`

### layout-switcher-modal.tsx
- **Path**: `components/mold/common/layout-switcher-modal.tsx`
- **Type**: Client Component
- **Properties**: `onClose`
- **Slots**: None
- **State Dependencies**: `usePageLayout, useRef, useEffect`

### mermaid-diagram.tsx
- **Path**: `components/mold/common/mermaid-diagram.tsx`
- **Type**: Client Component
- **Performance Alert**: Contains heavy library dependencies ( mermaid). Ensure dynamic import with `ssr: false`.
- **Properties**: `chart, id, className`
- **Slots**: None
- **State Dependencies**: `useRef, useState, useEffect`

### onboarding-screen.tsx
- **Path**: `components/mold/common/onboarding-screen.tsx`
- **Type**: Client Component
- **Lazy Loaded**: Yes
- **Properties**: `mode, onSubjectAdded`
- **Slots**: None
- **State Dependencies**: `useState`

### rich-text.tsx
- **Path**: `components/mold/common/rich-text.tsx`
- **Type**: Client Component
- **Performance Alert**: Contains heavy library dependencies ( mermaid). Ensure dynamic import with `ssr: false`.
- **Properties**: `content, className, id`
- **Slots**: None
- **State Dependencies**: `useMemo`

### share-modal-blocks.tsx
- **Path**: `components/mold/common/share-modal-blocks.tsx`
- **Type**: Server Component
- **Properties**: `encoding, encodeError, shareUrl, shortUrl, copyState, shortenState, shortenError, sizeKb, isSizeLarge, onCopy, onShorten, onCopyShortUrl, subject, onDownload`
- **Slots**: None
- **State Dependencies**: None

### share-modal.tsx
- **Path**: `components/mold/common/share-modal.tsx`
- **Type**: Client Component
- **Properties**: `subject, onClose`
- **Slots**: None
- **State Dependencies**: `useState, useRef, useEffect, useCallback`

### theme-switcher-modal.tsx
- **Path**: `components/mold/common/theme-switcher-modal.tsx`
- **Type**: Client Component
- **Properties**: `onClose`
- **Slots**: None
- **State Dependencies**: `useColorTheme, useRef, useState, useEffect, useMemo`

### flashcard-components.tsx
- **Path**: `components/mold/flashcard/flashcard-components.tsx`
- **Type**: Server Component
- **Properties**: `onQuit, progress, position, round, confident, learning, label, value, color, borderColor, label, count, color, confident, neutral, learning, total`
- **Slots**: None
- **State Dependencies**: None

### flashcard-screen-blocks.tsx
- **Path**: `components/mold/flashcard/flashcard-screen-blocks.tsx`
- **Type**: Server Component
- **Properties**: `card, index, flipped, animClass, accent, onFlip, onRespond, round, flashcardsLength, confident, neutral, learning, hardest, scores, onReturnHome, onComplete, round, deckLength, flashcardsLength, confident, neutral, learning, roundGotIt, roundStillLearning, hardestCards, scores, onReturnHome, onContinue, onEndSession`
- **Slots**: None
- **State Dependencies**: None

### flashcard-screen.tsx
- **Path**: `components/mold/flashcard/flashcard-screen.tsx`
- **Type**: Client Component
- **Properties**: `flashcards, subjectId, onComplete, onReturnHome`
- **Slots**: None
- **State Dependencies**: `useState, useRef, useEffect, useCallback, useMemo`

### memory-heatmap.tsx
- **Path**: `components/mold/flashcard/memory-heatmap.tsx`
- **Type**: Client Component
- **Properties**: `cards, retentionMap, subjectId, onStartDrill, onClose`
- **Slots**: None
- **State Dependencies**: `useState`

### retention-badge.tsx
- **Path**: `components/mold/flashcard/retention-badge.tsx`
- **Type**: Server Component
- **Properties**: `urgency, retrievability, className`
- **Slots**: None
- **State Dependencies**: None

### cheat-sheet-terminal.tsx
- **Path**: `components/mold/game/cheat-sheet-terminal.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: `useCheatSheet, useEffect`

### game-error-boundary.tsx
- **Path**: `components/mold/game/game-error-boundary.tsx`
- **Type**: Client Component
- **Properties**: `onReturnHome, children`
- **Slots**: `children`
- **State Dependencies**: None

### game-footer.tsx
- **Path**: `components/mold/game/game-footer.tsx`
- **Type**: Client Component
- **Properties**: `onHintRequest, initialLockRemaining, hintTimeRemaining, hintUsedThisQuestion, showHint`
- **Slots**: None
- **State Dependencies**: `useGameEngine`

### game-header.tsx
- **Path**: `components/mold/game/game-header.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: `useGameEngine, useCheatSheet`

### game-icons.tsx
- **Path**: `components/mold/game/game-icons.tsx`
- **Type**: Server Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### game-runner.tsx
- **Path**: `components/mold/game/game-runner.tsx`
- **Type**: Client Component
- **Properties**: `config, subject, runs, onReturnHome, onRunComplete, onRunSaved, onReturnHome, onRunComplete, onRunSaved, onInstantRestart, onReDrillMistakes, config, runs, showUnlocks, subject, value, accuracyPct, showHint`
- **Slots**: None
- **State Dependencies**: `useAchievementToast, useState, useGameEngine, useAchievements, useStreak, useCheatSheet, useRef, useEffect, useHint`

### game-stat-cell.tsx
- **Path**: `components/mold/game/game-stat-cell.tsx`
- **Type**: Server Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### question-card-blocks.tsx
- **Path**: `components/mold/game/question-card-blocks.tsx`
- **Type**: Server Component
- **Performance Alert**: Contains heavy library dependencies ( mermaid). Ensure dynamic import with `ssr: false`.
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### question-card-builder.tsx
- **Path**: `components/mold/game/question-card-builder.tsx`
- **Type**: Client Component
- **Performance Alert**: Contains heavy library dependencies ( mermaid). Ensure dynamic import with `ssr: false`.
- **Properties**: `idx, label, text, isSelected, isRevealed, isCorrect, isWrong, isDimmed, onSelect`
- **Slots**: None
- **State Dependencies**: `useQuestionCard, useGameEngine`

### question-card-components.tsx
- **Path**: `components/mold/game/question-card-components.tsx`
- **Type**: Server Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### question-card.tsx
- **Path**: `components/mold/game/question-card.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### results-screen-components.tsx
- **Path**: `components/mold/game/results-screen-components.tsx`
- **Type**: Server Component
- **Properties**: `elapsedSeconds, avgTimeSec, bestStreak, xpYield, pixels, total, pixelCount, score, wrongCountVal, skipCount, modules, resolveGradeColor`
- **Slots**: None
- **State Dependencies**: None

### results-screen.tsx
- **Path**: `components/mold/game/results-screen.tsx`
- **Type**: Client Component
- **Properties**: `onReturnHome, onPlayAgain, onReDrillMistakes`
- **Slots**: None
- **State Dependencies**: `useGameEngine`

### guide-page-content.tsx
- **Path**: `components/mold/guide/guide-page-content.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: `useSearchParams, useState, useRef, useEffect, useMemo`

### guide-sections.tsx
- **Path**: `components/mold/guide/guide-sections.tsx`
- **Type**: Client Component
- **Performance Alert**: Contains heavy library dependencies ( mermaid). Ensure dynamic import with `ssr: false`.
- **Properties**: `register, highlightText`
- **Slots**: None
- **State Dependencies**: None

### achievements-panel.tsx
- **Path**: `components/mold/home/achievements-panel.tsx`
- **Type**: Client Component
- **Properties**: `unlockedCount, totalAchievementsCount, topAchievements, hasMoreAchievements, totalCount, onShowGallery`
- **Slots**: None
- **State Dependencies**: None

### action-hub.tsx
- **Path**: `components/mold/home/action-hub.tsx`
- **Type**: Client Component
- **Properties**: `onInitialize, selectedMode, disabled, className`
- **Slots**: None
- **State Dependencies**: None

### add-questions-wizard.tsx
- **Path**: `components/mold/home/add-questions-wizard.tsx`
- **Type**: Client Component
- **Properties**: `activeSubject, onMerge, onCancel`
- **Slots**: None
- **State Dependencies**: `useState, useMemo, useCallback`

### bottom-mobile-nav.tsx
- **Path**: `components/mold/home/bottom-mobile-nav.tsx`
- **Type**: Client Component
- **Properties**: `view, setView, handleModeSelect, setShowEncyclopedia, setShowGallery, onChangeSubject`
- **Slots**: None
- **State Dependencies**: None

### header-well.tsx
- **Path**: `components/mold/home/header-well.tsx`
- **Type**: Client Component
- **Properties**: `subjectName, description, runCount, visualAccuracyPct`
- **Slots**: None
- **State Dependencies**: None

### hero-header.tsx
- **Path**: `components/mold/home/hero-header.tsx`
- **Type**: Client Component
- **Properties**: `subject, achievements, onTrophyClick, onChangeSubject, onImportNew, className`
- **Slots**: None
- **State Dependencies**: None

### home-screen-blocks.tsx
- **Path**: `components/mold/home/home-screen-blocks.tsx`
- **Type**: Server Component
- **Properties**: `selectedMode, handleModeSelect, handleInitialize, config, handleConfigChange, categories, questions, subjectId, unlockedCount, totalAchievementsCount, topAchievements, achievements, setShowGallery`
- **Slots**: None
- **State Dependencies**: None

### home-screen-components.tsx
- **Path**: `components/mold/home/home-screen-components.tsx`
- **Type**: Server Component
- **Properties**: `view, setView, handleModeSelect, setShowEncyclopedia, setShowGallery, onChangeSubject`
- **Slots**: None
- **State Dependencies**: None

### home-screen.tsx
- **Path**: `components/mold/home/home-screen.tsx`
- **Type**: Client Component
- **Lazy Loaded**: Yes
- **Properties**: `activeSubject, allSubjectIds, onAddSubject, onChangeSubject`
- **Slots**: None
- **State Dependencies**: `useSafeAuth, useState, usePageLayout, useStats, useAchievements, useEffect, useMemo`

### mode-selector.tsx
- **Path**: `components/mold/home/mode-selector.tsx`
- **Type**: Client Component
- **Properties**: `selected, onSelect, onLaunch, className, label, modes, selected, onSelect, onLaunch, accent, startIndex, mode, indexNumber, icon, isSelected, onSelect, onLaunch, selectedClass, accentClass`
- **Slots**: None
- **State Dependencies**: None

### performance-table.tsx
- **Path**: `components/mold/home/performance-table.tsx`
- **Type**: Client Component
- **Properties**: `runs, stats, className`
- **Slots**: None
- **State Dependencies**: `useState, useMemo`

### session-stats-panel.tsx
- **Path**: `components/mold/home/session-stats-panel.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: `useStats`

### setup-panel-blocks.tsx
- **Path**: `components/mold/home/setup-panel-blocks.tsx`
- **Type**: Client Component
- **Properties**: `config, onChange, categories, questions, subjectId, id, name, questionCount, selected, recallabilityPct, onSelect`
- **Slots**: None
- **State Dependencies**: `useContext, useConfigControls, useState, useMemo`

### setup-panel.tsx
- **Path**: `components/mold/home/setup-panel.tsx`
- **Type**: Client Component
- **Properties**: `config, onChange, selectedMode, categories, questions, subjectId, className`
- **Slots**: None
- **State Dependencies**: None

### side-nav-bar.tsx
- **Path**: `components/mold/home/side-nav-bar.tsx`
- **Type**: Client Component
- **Properties**: `subjectId, activeView, onShowDashboard, onShowStats, onShowEncyclopedia, onShowGallery, onChangeSubject, onImportNew, onAddQuestions, onInitialize, onDownloadHtml, onDownloadPdf, onDownloadSolvedPdf, onShowThemeModal, onShowLayoutModal`
- **Slots**: None
- **State Dependencies**: `useState`

### stats-screen.tsx
- **Path**: `components/mold/home/stats-screen.tsx`
- **Type**: Client Component
- **Properties**: `onReturnHome`
- **Slots**: None
- **State Dependencies**: `useStats, useState, useMemo`

### streak-ascent.tsx
- **Path**: `components/mold/home/streak-ascent.tsx`
- **Type**: Client Component
- **Properties**: `currentStreak, bestStreak, isAtRisk, className`
- **Slots**: None
- **State Dependencies**: None

### subject-visual-card.tsx
- **Path**: `components/mold/home/subject-visual-card.tsx`
- **Type**: Client Component
- **Properties**: `subjectId, subjectName`
- **Slots**: None
- **State Dependencies**: None

### telemetry-panel.tsx
- **Path**: `components/mold/home/telemetry-panel.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: `useStats, useMemo`

### top-nav-bar.tsx
- **Path**: `components/mold/home/top-nav-bar.tsx`
- **Type**: Client Component
- **Properties**: `activeSubjectName, loadedSubjectsCount, onShowEncyclopedia, onShowGallery, onImportNew, onShowThemeModal, onShowLayoutModal`
- **Slots**: None
- **State Dependencies**: `useColorTheme, usePurchases, useState, useRef, useEffect`

### base-page-wrapper.tsx
- **Path**: `components/mold/layouts/base-page-wrapper.tsx`
- **Type**: Server Component
- **Properties**: `children, topNav, mobileNav, footer, scanlinesClassName`
- **Slots**: `children`
- **State Dependencies**: None

### default-sidebar-layout.tsx
- **Path**: `components/mold/layouts/default-sidebar-layout.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### layout-map.tsx
- **Path**: `components/mold/layouts/layout-map.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### split-terminal-layout.tsx
- **Path**: `components/mold/layouts/split-terminal-layout.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### zen-focus-layout.tsx
- **Path**: `components/mold/layouts/zen-focus-layout.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### zen-minimal-dock-layout.tsx
- **Path**: `components/mold/layouts/zen-minimal-dock-layout.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### paywall-modal.tsx
- **Path**: `components/mold/payment/paywall-modal.tsx`
- **Type**: Client Component
- **Properties**: `isOpen, onClose`
- **Slots**: None
- **State Dependencies**: `usePurchases, useState, useEffect, useCallback`

### revenuecat-logo.tsx
- **Path**: `components/mold/payment/revenuecat-logo.tsx`
- **Type**: Server Component
- **Properties**: `className, color`
- **Slots**: None
- **State Dependencies**: None

### example-module-card.tsx
- **Path**: `components/mold/subject/example-module-card.tsx`
- **Type**: Server Component
- **Properties**: `entry, isLoading, onLoad, onShare`
- **Slots**: None
- **State Dependencies**: None

### neural-core-panel.tsx
- **Path**: `components/mold/subject/neural-core-panel.tsx`
- **Type**: Server Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### print-layout.tsx
- **Path**: `components/mold/subject/print-layout.tsx`
- **Type**: Client Component
- **Properties**: `subject`
- **Slots**: None
- **State Dependencies**: None

### share-receiver.tsx
- **Path**: `components/mold/subject/share-receiver.tsx`
- **Type**: Client Component
- **Properties**: `payload, onAccept, onDecline`
- **Slots**: None
- **State Dependencies**: `useState, useRef, useEffect`

### subject-importer-blocks.tsx
- **Path**: `components/mold/subject/subject-importer-blocks.tsx`
- **Type**: Server Component
- **Properties**: `promptCopied, onCopyPrompt, json, state, isDragging, onPaste, onChange, onDragOver, onDragLeave, onDrop, clipboardBlocked, textareaRef, state, result, preview, questionCount, flashcardCount, categories, json, onChange`
- **Slots**: None
- **State Dependencies**: `useState, useMemo, useRef`

### subject-importer-components.tsx
- **Path**: `components/mold/subject/subject-importer-components.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: `useState`

### subject-importer-steps.tsx
- **Path**: `components/mold/subject/subject-importer-steps.tsx`
- **Type**: Client Component
- **Properties**: `topic, setTopic, useReferenceBank, setUseReferenceBank, selectedPreset, onPresetSelect, subjectType, setSubjectType, questionCount, setQuestionCount, presetJustification, onCustomPresetClick, topic, compiledPrompt, promptCopied, onCopyPrompt, userMaterial, setUserMaterial, convertedMaterial, setConvertedMaterial, json, state, isDragging, onPaste, onChange, onDragOver, onDragLeave, onDrop, result, preview, questionCount, flashcardCount, categories, clipboardBlocked, textareaRef`
- **Slots**: None
- **State Dependencies**: None

### subject-importer.tsx
- **Path**: `components/mold/subject/subject-importer.tsx`
- **Type**: Client Component
- **Properties**: `onImport, onCancel, existingIds`
- **Slots**: None
- **State Dependencies**: `useMemo, useState, useRef, useEffect, useCallback`

### subject-selector-blocks.tsx
- **Path**: `components/mold/subject/subject-selector-blocks.tsx`
- **Type**: Server Component
- **Properties**: `subjects, confirmDeleteId, onSelect, onShare, onDeleteConfirm, onDeleteCancel, onRemoveClick, onShowImporter, examples, examplesLoading, exampleError, loadingExampleId, onExampleLoad, onExampleShare`
- **Slots**: None
- **State Dependencies**: None

### subject-selector-components.tsx
- **Path**: `components/mold/subject/subject-selector-components.tsx`
- **Type**: Server Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### subject-selector.tsx
- **Path**: `components/mold/subject/subject-selector.tsx`
- **Type**: Client Component
- **Lazy Loaded**: Yes
- **Properties**: `subjects, onSelect, onAddSubject, onRemoveSubject`
- **Slots**: None
- **State Dependencies**: `useState, useRef, useEffect, useMemo`

### user-subject-card.tsx
- **Path**: `components/mold/subject/user-subject-card.tsx`
- **Type**: Server Component
- **Properties**: `full, isConfirming, categoryCount, onSelect, onShare, onDeleteConfirm, onDeleteCancel, onRemoveClick`
- **Slots**: None
- **State Dependencies**: None

### theme-provider.tsx
- **Path**: `components/theme-provider.tsx`
- **Type**: Client Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### button.tsx
- **Path**: `components/ui/button.tsx`
- **Type**: Server Component
- **Properties**: `asChild`
- **Slots**: None
- **State Dependencies**: None

### card.tsx
- **Path**: `components/ui/card.tsx`
- **Type**: Server Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None

### input.tsx
- **Path**: `components/ui/input.tsx`
- **Type**: Server Component
- **Properties**: None explicitly documented.
- **Slots**: None
- **State Dependencies**: None
