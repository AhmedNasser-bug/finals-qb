"use client"

import { useState, useEffect, useRef } from "react"
import { GameEngineProvider, useGameEngine } from "@/lib/game-engine"
import { useAchievements } from "@/lib/achievement-engine"
import { useAchievementToast, AchievementToastContainer } from "@/components/mold/achievement-toast"
import type { Achievement, GameConfig } from "@/lib/mold-types"
import { DEMO_RUNS } from "@/lib/mold-types"
import { DEMO_FULL_SUBJECT } from "@/lib/subject-store"
import { GameHeader, QuestionCard, GameFooter, ResultsScreen } from "@/components/mold/game-screen"
import { FlashcardScreen } from "@/components/mold/flashcard-screen"

interface GameRunnerProps {
  config: GameConfig
  onReturnHome: () => void
  onRunComplete?: () => void
}

/**
 * GameRunner wraps the GameEngineProvider and decides which screen to render
 * based on the current game phase and mode.
 * Flashcard mode is handled separately (no MCQ engine needed).
 */
export function GameRunner({ config, onReturnHome, onRunComplete }: GameRunnerProps) {
  const { toasts, showUnlocks, dismiss } = useAchievementToast()

  if (config.mode === "flashcards") {
    return (
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">
        <FlashcardScreen
          flashcards={DEMO_FULL_SUBJECT.flashcards}
          onComplete={onReturnHome}
          onReturnHome={onReturnHome}
        />
        <AchievementToastContainer toasts={toasts} onDismiss={dismiss} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <GameEngineProvider config={config} questions={DEMO_FULL_SUBJECT.questions}>
        <GameRunnerInner
          onReturnHome={onReturnHome}
          onRunComplete={onRunComplete}
          config={config}
          showUnlocks={showUnlocks}
        />
      </GameEngineProvider>
      <AchievementToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// ─── Inner component (has access to useGameEngine) ────────────────────────────

interface InnerProps {
  onReturnHome: () => void
  onRunComplete?: () => void
  config: GameConfig
  showUnlocks: (unlocked: Achievement[]) => void
}

function GameRunnerInner({ onReturnHome, onRunComplete, config, showUnlocks }: InnerProps) {
  const { state, forfeit, currentQuestion } = useGameEngine()
  const { onGameComplete } = useAchievements()
  const [showHint, setShowHint] = useState(false)
  const achievementsFiredRef = useRef(false)

  // Reset hint visibility when question changes
  const [lastIndex, setLastIndex] = useState(state.currentIndex)
  if (state.currentIndex !== lastIndex) {
    setLastIndex(state.currentIndex)
    setShowHint(false)
  }

  // Fire achievement evaluation once when the game transitions to complete
  useEffect(() => {
    if (state.phase === "complete" && !achievementsFiredRef.current) {
      achievementsFiredRef.current = true
      onGameComplete(state, DEMO_RUNS).then((unlocked) => {
        if (unlocked.length > 0) showUnlocks(unlocked)
        onRunComplete?.()
      })
    }
  }, [state.phase, state, onGameComplete, showUnlocks, onRunComplete])

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
    <div className="flex flex-col flex-1">
      <GameHeader onForfeit={forfeit} />

      {/* Survival per-question stress bar */}
      {config.mode === "survival" && state.perQuestionTimeLimit > 0 && (
        <SurvivalStressBar
          timeLimit={state.perQuestionTimeLimit}
          isRevealed={state.isRevealed}
        />
      )}

      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl w-full mx-auto">
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
