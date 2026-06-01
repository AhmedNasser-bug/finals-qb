"use client"

import { useState, useEffect, useRef } from "react"
import { GameEngineProvider, useGameEngine } from "@/lib/game-engine"
import { useStreak } from "@/lib/game/streak-context"
import { useAchievements } from "@/lib/achievement-engine"
import { useAchievementToast, AchievementToastContainer } from "@/components/mold/achievement/achievement-toast"
import { GameErrorBoundary } from "@/components/mold/game/game-error-boundary"
import type { Achievement, GameConfig, RunRecord, FullSubjectData } from "@/lib/mold-types"
import { calculateGrade, calculateAccuracy, hasVisual } from "@/lib/mold-types"
import { GameHeader } from "@/components/mold/game/game-header"
import { QuestionCard } from "@/components/mold/game/question-card"
import { GameFooter } from "@/components/mold/game/game-footer"
import { ResultsScreen } from "@/components/mold/game/results-screen"
import { FlashcardScreen } from "@/components/mold/flashcard/flashcard-screen"
import { uuid } from "@/lib/crypto-utils"
import { cn } from "@/lib/utils"

// ─── Props ─────────────────────────────────────────────────────────────

interface GameRunnerProps {
  config: GameConfig
  /** The active subject — provides questions and flashcards for this run. */
  subject: FullSubjectData
  /** Real persisted run history — used for achievement evaluation (Fix 1-A). */
  runs: RunRecord[]
  onReturnHome: () => void
  onRunComplete?: () => void
  /** Called with the completed RunRecord so the parent can persist it. */
  onRunSaved?: (run: RunRecord) => void
}

// ─── ToastLayer — keeps hook above all conditional renders ───────────
/**
 * Wraps children with toast state and renders the container at the bottom.
 * Extracted so the hook call is never below a conditional return.
 */
function ToastLayer({
  children,
}: {
  children: (showUnlocks: (unlocked: Achievement[]) => void) => React.ReactNode
}) {
  const { toasts, showUnlocks, dismiss } = useAchievementToast()
  return (
    <>
      {children(showUnlocks)}
      <AchievementToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  )
}

// ─── GameRunner ───────────────────────────────────────────────────────────────

export function GameRunner({ config, subject, runs, onReturnHome, onRunComplete, onRunSaved }: GameRunnerProps) {
  return (
    <ToastLayer>
      {(showUnlocks) => (
        <div className="h-screen bg-background flex flex-col animate-fade-in">
          {/* Error boundary wraps the engine so crashes are recoverable */}
          <GameErrorBoundary onReturnHome={onReturnHome}>
            {config.mode === "flashcards" ? (
              <FlashcardScreen
                flashcards={subject.flashcards}
                onComplete={onReturnHome}
                onReturnHome={onReturnHome}
              />
            ) : (
              <GameEngineProvider
                config={config}
                questions={subject.questions}
              >
                <GameRunnerInner
                  onReturnHome={onReturnHome}
                  onRunComplete={onRunComplete}
                  onRunSaved={onRunSaved}
                  config={config}
                  runs={runs}
                  showUnlocks={showUnlocks}
                />
              </GameEngineProvider>
            )}
          </GameErrorBoundary>
        </div>
      )}
    </ToastLayer>
  )
}

// ─── Inner component (has access to useGameEngine) ────────────────────────────

interface InnerProps {
  onReturnHome: () => void
  onRunComplete?: () => void
  onRunSaved?: (run: RunRecord) => void
  config: GameConfig
  /** Real persisted run history for achievement evaluation. */
  runs: RunRecord[]
  showUnlocks: (unlocked: Achievement[]) => void
}

function GameRunnerInner({ onReturnHome, onRunComplete, onRunSaved, config, runs, showUnlocks }: InnerProps) {
  const {
    state,
    forfeit,
    currentQuestion,
    selectOption,
    revealAnswer,
    nextQuestion,
    useHint,
    accuracyPct,
  } = useGameEngine()
  const { onGameComplete } = useAchievements()
  const { recordSession } = useStreak()
  const [showHint, setShowHint] = useState(false)
  const [initialLockRemaining, setInitialLockRemaining] = useState(5)
  const [hintTimeRemaining, setHintTimeRemaining] = useState(10)
  const [hintUsedThisQuestion, setHintUsedThisQuestion] = useState(false)
  const completionProcessedRef = useRef(false)

  // Reset hint visibility when question advances
  const [lastIndex, setLastIndex] = useState(state.currentIndex)
  if (state.currentIndex !== lastIndex) {
    setLastIndex(state.currentIndex)
    setShowHint(false)
    setInitialLockRemaining(5)
    setHintTimeRemaining(10)
    setHintUsedThisQuestion(false)
  }

  // 1. Initial 5s lockout countdown
  useEffect(() => {
    if (state.phase !== "playing" || state.isRevealed) return

    const interval = setInterval(() => {
      setInitialLockRemaining((prev) => {
        if (prev > 0) return prev - 1
        return 0
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.currentIndex, state.phase, state.isRevealed])

  // 2. Active 10s display countdown
  useEffect(() => {
    if (!showHint || state.isRevealed || state.phase !== "playing") return

    const interval = setInterval(() => {
      setHintTimeRemaining((prev) => {
        if (prev > 1) return prev - 1
        // Timer expired: hide hint
        setShowHint(false)
        return 0
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showHint, state.isRevealed, state.phase])

  // Build RunRecord and evaluate achievements exactly once when the game transitions to complete.
  useEffect(() => {
    if (state.phase === "complete" && !completionProcessedRef.current) {
      completionProcessedRef.current = true

      const accuracyPctValue = calculateAccuracy(state.score, state.wrongAnswers)
      const totalQuestions = state.questions.length
      const run: RunRecord = {
        id: uuid(),
        date: new Date().toISOString(),
        mode: state.mode,
        score: accuracyPctValue,
        correctAnswers: state.score,
        totalQuestions,
        timeTaken: state.elapsedSeconds,
        streak: state.bestStreak,
        grade: calculateGrade(accuracyPctValue),
      }

      onRunSaved?.(run)
      recordSession(run)

      // Evaluate achievements using full history (including the current run)
      onGameComplete(state, [...runs, run]).then((unlocked) => {
        if (unlocked.length > 0) showUnlocks(unlocked)
        onRunComplete?.()
      })
    }
  }, [state, runs, onRunSaved, onGameComplete, showUnlocks, onRunComplete])

  if (state.phase === "complete") {
    return (
      <ResultsScreen
        onReturnHome={onReturnHome}
        onPlayAgain={onReturnHome}
      />
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm font-mono text-muted-foreground">
          No questions available for this configuration.
        </p>
      </div>
    )
  }

  const isCorrect = state.isRevealed
    ? state.selectedOption === currentQuestion.answer
    : null

  const cardContextValue = {
    state: {
      currentQuestion,
      currentIndex: state.currentIndex,
      totalQuestions: state.questions.length,
      selectedOption: state.selectedOption,
      isRevealed: state.isRevealed,
      isCorrect,
      hintUsed: showHint,
      hintTimeRemaining,
      wrongCount: state.wrongAnswers,
      globalTimeRemaining: state.globalTimeRemaining,
      elapsedSeconds: state.elapsedSeconds,
      livesRemaining: state.livesRemaining,
      perQuestionTimeRemaining: state.perQuestionTimeRemaining,
      streakShieldActive: state.streakShieldActive,
      streakShieldTriggeredThisQuestion: state.streakShieldTriggeredThisQuestion,
      streak: state.streak,
    },
    actions: {
      selectOption,
      submitAnswer: revealAnswer,
      nextQuestion,
      useHint: () => {
        if (initialLockRemaining > 0 || hintUsedThisQuestion) return
        useHint()
        setShowHint(true)
        setHintUsedThisQuestion(true)
      },
      forfeitSession: forfeit,
    },
  }

  const CardComponent =
    config.mode === "practice" ? PracticeQuestionCard :
    config.mode === "survival" ? SurvivalQuestionCard :
    StandardQuestionCard

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <GameHeader onForfeit={forfeit} />

      {/* Survival per-question stress bar */}
      {config.mode === "survival" && state.perQuestionTimeLimit > 0 && (
        <SurvivalStressBar
          timeLimit={state.perQuestionTimeLimit}
          isRevealed={state.isRevealed}
        />
      )}

      <main className={`flex-1 flex flex-col min-h-0 w-full mx-auto px-4 md:px-8 py-2 ${
        hasVisual(currentQuestion)
          ? "max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-4rem)] xl:max-w-[1600px]"
          : "max-w-4xl"
      }`}>
        <CardComponent
          value={cardContextValue}
          accuracyPct={accuracyPct}
          showHint={showHint}
        />
      </main>

      <GameFooter
        onHintRequest={() => {
          if (initialLockRemaining > 0 || hintUsedThisQuestion) return
          useHint()
          setShowHint(true)
          setHintUsedThisQuestion(true)
        }}
        initialLockRemaining={initialLockRemaining}
        hintTimeRemaining={hintTimeRemaining}
        hintUsedThisQuestion={hintUsedThisQuestion}
        showHint={showHint}
      />
    </div>
  )
}

// ─── Composed Screen Card Variants ───────────────────────────────────────────

interface QuestionCardVariantProps {
  value: import("@/lib/question-card-context").QuestionCardContextValue
  accuracyPct: number
  showHint: boolean
}

function PracticeQuestionCard({ value, accuracyPct, showHint }: QuestionCardVariantProps) {
  const hasVisualActive = hasVisual(value.state.currentQuestion)
  return (
    <QuestionCard.Provider value={value}>
      <QuestionCard.Frame>
        <QuestionCard.Header>
          <QuestionCard.Counter />
          <QuestionCard.Telemetry showSkills accuracyPct={accuracyPct} />
        </QuestionCard.Header>

        <div className={cn(
          "flex-1 min-h-0 grid gap-6",
          hasVisualActive ? "grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" : "grid-cols-1"
        )}>
          <div className="flex flex-col flex-1 min-h-0 gap-4 justify-start">
            <QuestionCard.HtmlContent />
            {hasVisualActive && <QuestionCard.MermaidDiagram mode="below" />}
            <QuestionCard.Options cols={hasVisualActive ? "single" : "auto"} />
          </div>

          {hasVisualActive && (
            <div className="flex flex-col min-h-0 h-full">
              <QuestionCard.MermaidDiagram mode="side" />
            </div>
          )}
        </div>

        <QuestionCard.Footer showHint={showHint} />
      </QuestionCard.Frame>
    </QuestionCard.Provider>
  )
}

function SurvivalQuestionCard({ value, showHint }: Omit<QuestionCardVariantProps, "accuracyPct">) {
  const hasVisualActive = hasVisual(value.state.currentQuestion)
  return (
    <QuestionCard.Provider value={value}>
      <QuestionCard.Frame>
        <QuestionCard.Header>
          <QuestionCard.Counter />
        </QuestionCard.Header>

        <div className={cn(
          "flex-1 min-h-0 grid gap-6",
          hasVisualActive ? "grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" : "grid-cols-1"
        )}>
          <div className="flex flex-col flex-1 min-h-0 gap-4 justify-start">
            <QuestionCard.HtmlContent />
            {hasVisualActive && <QuestionCard.MermaidDiagram mode="below" />}
            <QuestionCard.Options cols={hasVisualActive ? "single" : "auto"} />
          </div>

          {hasVisualActive && (
            <div className="flex flex-col min-h-0 h-full">
              <QuestionCard.MermaidDiagram mode="side" />
            </div>
          )}
        </div>

        <QuestionCard.Footer showHint={showHint} />
      </QuestionCard.Frame>
    </QuestionCard.Provider>
  )
}

function StandardQuestionCard({ value, accuracyPct, showHint }: QuestionCardVariantProps) {
  const hasVisualActive = hasVisual(value.state.currentQuestion)
  return (
    <QuestionCard.Provider value={value}>
      <QuestionCard.Frame>
        <QuestionCard.Header>
          <QuestionCard.Counter />
          <QuestionCard.Telemetry accuracyPct={accuracyPct} />
        </QuestionCard.Header>

        <div className={cn(
          "flex-1 min-h-0 grid gap-6",
          hasVisualActive ? "grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" : "grid-cols-1"
        )}>
          <div className="flex flex-col flex-1 min-h-0 gap-4 justify-start">
            <QuestionCard.HtmlContent />
            {hasVisualActive && <QuestionCard.MermaidDiagram mode="below" />}
            <QuestionCard.Options cols={hasVisualActive ? "single" : "auto"} />
          </div>

          {hasVisualActive && (
            <div className="flex flex-col min-h-0 h-full">
              <QuestionCard.MermaidDiagram mode="side" />
            </div>
          )}
        </div>

        <QuestionCard.Footer showHint={showHint} />
      </QuestionCard.Frame>
    </QuestionCard.Provider>
  )
}

// ─── Survival stress bar ──────────────────────────────────────────────────────

function SurvivalStressBar({
  timeLimit,
  isRevealed,
}: {
  timeLimit: number
  isRevealed: boolean
}) {
  return (
    <div className="h-1.5 bg-secondary w-full overflow-hidden">
      <style>{`
        .survival-stress-fill {
          width: 100%;
          ${!isRevealed ? `animation: drain ${timeLimit}s linear forwards;` : ""}
        }
      `}</style>
      <div
        key={`${timeLimit}-${isRevealed}`}
        className="h-full bg-red-400 survival-stress-fill"
      />
      <style>{`@keyframes drain { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  )
}
