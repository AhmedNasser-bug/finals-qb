"use client"

import { useState, useEffect, useRef } from "react"
import { GameEngineProvider, useGameEngine } from "@/lib/game-engine"
import { useAchievements } from "@/lib/achievement-engine"
import { useAchievementToast, AchievementToastContainer } from "@/components/mold/achievement-toast"
import { GameErrorBoundary } from "@/components/mold/game-error-boundary"
import type { Achievement, GameConfig, RunRecord, FullSubjectData } from "@/lib/mold-types"
import { calculateGrade } from "@/lib/mold-types"
import { GameHeader, QuestionCard, GameFooter, ResultsScreen } from "@/components/mold/game-screen"
import { FlashcardScreen } from "@/components/mold/flashcard-screen"
import { calculateAccuracy } from "@/lib/mold-types"
import { uuid } from "@/lib/crypto-utils"

// ─── Public interface ─────────────────────────────────────────────────────────

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
  const { state, forfeit, currentQuestion } = useGameEngine()
  const { onGameComplete } = useAchievements()
  const [showHint, setShowHint] = useState(false)
  const completionProcessedRef = useRef(false)

  // Reset hint visibility when question advances
  const [lastIndex, setLastIndex] = useState(state.currentIndex)
  if (state.currentIndex !== lastIndex) {
    setLastIndex(state.currentIndex)
    setShowHint(false)
  }

  // Build RunRecord and evaluate achievements exactly once when the game transitions to complete.
  useEffect(() => {
    if (state.phase === "complete" && !completionProcessedRef.current) {
      completionProcessedRef.current = true

      const accuracyPct = calculateAccuracy(state.score, state.wrongAnswers)
      const totalQuestions = state.questions.length
      const run: RunRecord = {
        id: uuid(),
        date: new Date().toISOString(),
        mode: state.mode,
        score: accuracyPct,
        correctAnswers: state.score,
        totalQuestions,
        timeTaken: state.elapsedSeconds,
        streak: state.bestStreak,
        grade: calculateGrade(accuracyPct),
      }

      onRunSaved?.(run)

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

      <main className={`flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full mx-auto ${
        currentQuestion?.diagram
          ? "max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-4rem)] xl:max-w-[1600px]"
          : "max-w-4xl"
      }`}>
        <QuestionCard question={currentQuestion} showHint={showHint} />
      </main>

      <GameFooter onHintRequest={() => setShowHint(true)} />
    </div>
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
      <div
        key={`${timeLimit}-${isRevealed}`}
        className="h-full bg-red-400"
        style={
          isRevealed
            ? { width: "100%" }
            : { width: "100%", animation: `drain ${timeLimit}s linear forwards` }
        }
      />
      <style>{`@keyframes drain { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  )
}
