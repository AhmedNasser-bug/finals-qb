"use client"

import { useState, useEffect, useRef } from "react"
import { GameEngineProvider, useGameEngine } from "@/lib/game-engine"
import { useStreak } from "@/lib/game/streak-context"
import { useAchievements } from "@/lib/achievement-engine"
import { useAchievementToast, AchievementToastContainer } from "@/components/mold/achievement/achievement-toast"
import { GameErrorBoundary } from "@/components/mold/game/game-error-boundary"
import type { Achievement, GameConfig, RunRecord, FullSubjectData, Question } from "@/lib/mold-types"
import { calculateGrade, calculateAccuracy, hasVisual } from "@/lib/mold-types"
import { GameHeader } from "@/components/mold/game/game-header"
import { QuestionCard } from "@/components/mold/game/question-card"
import { GameFooter } from "@/components/mold/game/game-footer"
import { ResultsScreen } from "@/components/mold/game/results-screen"
import { FlashcardScreen } from "@/components/mold/flashcard/flashcard-screen"
import { CheatSheetProvider, useCheatSheet } from "@/lib/game/cheat-sheet-context"
import { CheatSheetTerminal } from "@/components/mold/game/cheat-sheet-terminal"
import { uuid } from "@/lib/crypto-utils"
import { cn } from "@/lib/utils"
import {
  playKeyClick,
  playCorrectChime,
  playWrongBuzzer,
  playShieldEarned,
  playShieldAbsorbed,
  playSessionComplete,
  toggleAudioMute,
} from "@/lib/audio/sound-engine"

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
  const [reDrillQuestions, setReDrillQuestions] = useState<Question[] | null>(null)
  const [sessionKey, setSessionKey] = useState(0)

  const activeQuestions = reDrillQuestions ?? subject.questions
  const activeConfig: GameConfig = reDrillQuestions
    ? { ...config, mode: "practice", questionCount: reDrillQuestions.length }
    : config

  const handleInstantRestart = () => {
    setSessionKey((prev) => prev + 1)
  }

  const handleReDrillMistakes = (mistakes: Question[]) => {
    setReDrillQuestions(mistakes)
    setSessionKey((prev) => prev + 1)
  }

  return (
    <ToastLayer>
      {(showUnlocks) => (
        <div className="h-screen bg-background flex flex-col animate-fade-in">
          {/* Error boundary wraps the engine so crashes are recoverable */}
          <GameErrorBoundary onReturnHome={onReturnHome}>
            {activeConfig.mode === "flashcards" ? (
              <FlashcardScreen
                flashcards={subject.flashcards}
                subjectId={subject.id}
                onComplete={onReturnHome}
                onReturnHome={onReturnHome}
              />
            ) : (
              <GameEngineProvider
                key={sessionKey}
                config={activeConfig}
                questions={activeQuestions}
              >
                <CheatSheetProvider subjectId={subject.id}>
                  <GameRunnerInner
                    onReturnHome={onReturnHome}
                    onRunComplete={onRunComplete}
                    onRunSaved={onRunSaved}
                    onInstantRestart={handleInstantRestart}
                    onReDrillMistakes={handleReDrillMistakes}
                    config={activeConfig}
                    runs={runs}
                    showUnlocks={showUnlocks}
                    subject={subject}
                  />
                </CheatSheetProvider>
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
  onInstantRestart?: () => void
  onReDrillMistakes?: (mistakes: Question[]) => void
  config: GameConfig
  /** Real persisted run history for achievement evaluation. */
  runs: RunRecord[]
  showUnlocks: (unlocked: Achievement[]) => void
  subject: FullSubjectData
}

function GameRunnerInner({
  onReturnHome,
  onRunComplete,
  onRunSaved,
  onInstantRestart,
  onReDrillMistakes,
  config,
  runs,
  showUnlocks,
  subject
}: InnerProps) {
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
  const { addEntry, toggleCheatSheet, clearEntries } = useCheatSheet()
  
  const processedQuestionsRef = useRef<Record<number, boolean>>({})
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

  // Clear/reset the review deck (cheat sheet) when starting a new run
  useEffect(() => {
    clearEntries()
  }, [clearEntries])

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

  // Capture wrong or hinted questions into cheat sheet upon answer reveal
  useEffect(() => {
    if (!currentQuestion || !state.isRevealed) return
    if (processedQuestionsRef.current[state.currentIndex]) return

    const isCorrect = state.selectedOption === currentQuestion.answer
    const gotWrong = !isCorrect
    const hintUsed = hintUsedThisQuestion

    if (gotWrong || hintUsed) {
      processedQuestionsRef.current[state.currentIndex] = true
      addEntry(currentQuestion, { gotWrong, hintUsed })
    }
  }, [state.isRevealed, state.currentIndex, state.selectedOption, hintUsedThisQuestion, currentQuestion, addEntry])

  // Reset processed questions when game starts or resets
  useEffect(() => {
    if (state.currentIndex === 0 && !state.isRevealed) {
      processedQuestionsRef.current = {}
    }
  }, [state.currentIndex, state.isRevealed])

  const handleSelectOption = (opt: string) => {
    playKeyClick()
    selectOption(opt)
  }

  const handleRevealAnswer = () => {
    const isCorrect = state.selectedOption === currentQuestion?.answer
    if (isCorrect) {
      playCorrectChime()
    } else {
      playWrongBuzzer()
    }
    revealAnswer()
  }

  // Audio cues for streak shield earned and absorbed
  const prevShieldRef = useRef(state.streakShieldActive)
  useEffect(() => {
    if (state.streakShieldActive && !prevShieldRef.current) {
      playShieldEarned()
    }
    prevShieldRef.current = state.streakShieldActive
  }, [state.streakShieldActive])

  const prevShieldTriggeredRef = useRef(state.streakShieldTriggeredThisQuestion)
  useEffect(() => {
    if (state.streakShieldTriggeredThisQuestion && !prevShieldTriggeredRef.current) {
      playShieldAbsorbed()
    }
    prevShieldTriggeredRef.current = state.streakShieldTriggeredThisQuestion
  }, [state.streakShieldTriggeredThisQuestion])

  // In-Game Keyboard Navigation Engine (1-4, A-D, Enter, Space, H, Escape, R, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return
      }

      // Escape toggles cheat sheet review deck
      if (e.key === "Escape") {
        e.preventDefault()
        toggleCheatSheet()
        return
      }

      // Audio mute toggle shortcut (M / m)
      if (e.key === "m" || e.key === "M") {
        e.preventDefault()
        toggleAudioMute()
        return
      }

      // R key for rage-quit instant restart during active playing or reviewing
      if ((e.key === "r" || e.key === "R") && (state.phase === "playing" || state.phase === "reviewing")) {
        e.preventDefault()
        onInstantRestart?.()
        return
      }

      if (state.phase !== "playing" && state.phase !== "reviewing") return

      // 1. Numerical & Alphabetical Option Selection (1..4 / A..D)
      if (!state.isRevealed && currentQuestion?.options && state.phase === "playing") {
        const num = parseInt(e.key, 10)
        if (!isNaN(num) && num >= 1 && num <= currentQuestion.options.length) {
          e.preventDefault()
          handleSelectOption(currentQuestion.options[num - 1].label)
          return
        }

        const keyUpper = e.key.toUpperCase()
        const optionIndex = currentQuestion.options.findIndex((opt) => opt.label.toUpperCase() === keyUpper)
        if (optionIndex !== -1) {
          e.preventDefault()
          handleSelectOption(currentQuestion.options[optionIndex].label)
          return
        }
      }

      // 2. Submit on playing (Enter/Space) / Advance on reviewing (Enter/Space)
      if (e.key === "Enter" || e.key === " ") {
        if (!state.isRevealed && state.selectedOption !== null && state.phase === "playing") {
          e.preventDefault()
          handleRevealAnswer()
          return
        }
        if (state.isRevealed || state.phase === "reviewing") {
          e.preventDefault()
          nextQuestion()
          return
        }
      }

      // 3. Hint Shortcut (H / h)
      if ((e.key === "h" || e.key === "H") && config.hintsEnabled && !state.isRevealed && state.phase === "playing") {
        if (initialLockRemaining === 0 && !hintUsedThisQuestion && !showHint) {
          e.preventDefault()
          useHint()
          setShowHint(true)
          setHintUsedThisQuestion(true)
          return
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    state.phase,
    state.isRevealed,
    state.selectedOption,
    currentQuestion,
    config.hintsEnabled,
    initialLockRemaining,
    hintUsedThisQuestion,
    showHint,
    onInstantRestart,
    nextQuestion,
    useHint,
    toggleCheatSheet,
  ])

  // Build RunRecord and evaluate achievements exactly once when the game transitions to complete.
  useEffect(() => {
    if (state.phase === "complete" && !completionProcessedRef.current) {
      completionProcessedRef.current = true
      playSessionComplete()

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
        onPlayAgain={onInstantRestart ?? onReturnHome}
        onReDrillMistakes={onReDrillMistakes}
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
      selectOption: handleSelectOption,
      submitAnswer: handleRevealAnswer,
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
    <div className="flex flex-1 overflow-hidden relative w-full h-full">
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
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

      {/* Floating Review Deck toggle button on the right edge */}
      <button
        onClick={toggleCheatSheet}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-[#121212] hover:bg-[#1c1b1b] border-y border-l border-zinc-800 hover:border-[#fecc17]/50 text-[#fecc17] font-mono text-[10px] font-bold py-3 px-2 rounded-l shadow-lg transition-all flex flex-col items-center gap-1.5 focus-ring uppercase tracking-widest cursor-pointer group"
        title="Open Review Deck (Ctrl + `)"
      >
        <span className="text-[12px] group-hover:scale-110 transition-transform">📚</span>
        <span className="[writing-mode:vertical-lr] tracking-widest text-[9px]">REVIEW DECK</span>
      </button>

      {/* Side Terminal Drawer */}
      <CheatSheetTerminal subjectId={subject.id} />
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
