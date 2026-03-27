"use client"

import { useGameEngine } from "@/lib/game-engine"
import type { Question } from "@/lib/mold-types"
import { formatTime, gradeBgColor, calculateGrade, modeLabel, formatLabel } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

// ─── Game Header Bar ──────────────────────────────────────────────────────────

export function GameHeader({ onForfeit }: { onForfeit: () => void }) {
  const { state, accuracyPct } = useGameEngine()
  const {
    mode, currentIndex, questions, score, streak,
    globalTimeRemaining, globalTimeLimit, elapsedSeconds, livesRemaining,
  } = state

  const total = questions.length
  const progress = total > 0 ? (currentIndex / total) * 100 : 0
  const isTimedGlobal = globalTimeLimit > 0
  const isSurvival = mode === "survival"

  return (
    <header className="border-b border-border bg-panel px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
            {modeLabel(mode)}
          </span>
          <span className="text-border select-none">|</span>
          <span className="text-xs font-mono text-foreground">
            <span className="text-primary">{score}</span>
            <span className="text-muted-foreground">/{Math.max(currentIndex, 1)}</span>
          </span>
          {streak > 1 && (
            <span className="text-xs font-mono px-1.5 py-0.5 rounded border border-amber-400/30 bg-amber-400/10 text-amber-400">
              x{streak}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isTimedGlobal ? (
            <span className={cn(
              "text-sm font-mono font-bold tabular-nums",
              globalTimeRemaining <= 30 ? "text-red-400 animate-pulse" : "text-foreground"
            )}>
              {formatTime(globalTimeRemaining)}
            </span>
          ) : (
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
          )}
          {isSurvival && (
            <div className="flex items-center gap-1" aria-label={`${livesRemaining} lives remaining`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={cn("w-2 h-2 rounded-full", i < livesRemaining ? "bg-red-400" : "bg-border")}
                />
              ))}
            </div>
          )}
          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
            {accuracyPct}% ACC
          </span>
          <button
            onClick={onForfeit}
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-transparent hover:border-border"
          >
            QUIT
          </button>
        </div>
      </div>

      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          Q {Math.min(currentIndex + 1, total)} / {total}
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          STREAK {streak}
        </span>
      </div>
    </header>
  )
}

// ─── Question Card ────────────────────────────────────────────────────────────

export function QuestionCard({
  question,
  showHint,
}: {
  question: Question
  showHint: boolean
}) {
  const { state, selectOption } = useGameEngine()
  const { selectedOption, isRevealed } = state

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-muted-foreground uppercase tracking-wider">
          {formatLabel(question.category)}
        </span>
        <span className={cn(
          "text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider",
          question.difficulty === "Hard"   ? "border-red-400/30 text-red-400" :
          question.difficulty === "Medium" ? "border-amber-400/30 text-amber-400" :
                                             "border-emerald-400/30 text-emerald-400"
        )}>
          {question.difficulty}
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-muted-foreground uppercase">
          {question.type === "TrueFalse" ? "True / False" : "MCQ"}
        </span>
      </div>

      <p className="text-lg font-medium text-foreground leading-relaxed text-pretty">
        {question.question}
      </p>

      {showHint && question.hint && (
        <div className="px-3 py-2 rounded border border-amber-400/20 bg-amber-400/5 text-sm text-amber-300 animate-fade-in">
          <span className="font-mono text-xs text-amber-400 mr-2">HINT</span>
          {question.hint}
        </div>
      )}

      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Answer options">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.label
          const isCorrect  = opt.label === question.answer
          const isWrong    = isRevealed && isSelected && !isCorrect

          let optClass = "border-border bg-panel text-foreground/80 hover:border-border/80 hover:text-foreground hover:bg-secondary/50"
          if (!isRevealed && isSelected) {
            optClass = "border-primary bg-primary/10 text-foreground"
          } else if (isRevealed && isCorrect) {
            optClass = "border-emerald-400/60 bg-emerald-400/10 text-foreground"
          } else if (isWrong) {
            optClass = "border-red-400/60 bg-red-400/10 text-foreground opacity-70"
          } else if (isRevealed) {
            optClass = "border-border bg-panel text-foreground/50"
          }

          return (
            <button
              key={opt.label}
              role="radio"
              aria-checked={isSelected}
              disabled={isRevealed}
              onClick={() => selectOption(opt.label)}
              className={cn(
                "flex items-center gap-3 p-3 rounded border text-left transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                optClass
              )}
            >
              <span className={cn(
                "shrink-0 w-6 h-6 rounded border flex items-center justify-center text-xs font-mono font-bold",
                !isRevealed && isSelected ? "border-primary bg-primary/20 text-primary" :
                isRevealed && isCorrect   ? "border-emerald-400 bg-emerald-400/20 text-emerald-400" :
                isWrong                   ? "border-red-400 bg-red-400/20 text-red-400" :
                                            "border-border text-muted-foreground"
              )}>
                {opt.label}
              </span>
              <span className="text-sm leading-snug">{opt.text}</span>
              {isRevealed && isCorrect && <CheckIcon className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />}
              {isWrong && <XIcon className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
            </button>
          )
        })}
      </div>

      {isRevealed && question.explanation && (
        <div className="px-3 py-3 rounded border border-border bg-secondary/40 text-sm text-muted-foreground leading-relaxed animate-fade-in">
          <span className="font-mono text-xs text-foreground/60 mr-2">EXPLANATION</span>
          {question.explanation}
        </div>
      )}
    </div>
  )
}

// ─── Game Footer Controls ─────────────────────────────────────────────────────

export function GameFooter({ onHintRequest }: { onHintRequest: () => void }) {
  const { state, revealAnswer, nextQuestion, useHint } = useGameEngine()
  const { isRevealed, selectedOption, hintsUsedTotal, config, currentIndex, questions } = state

  const isLast    = currentIndex >= questions.length - 1
  const canSubmit = selectedOption !== null && !isRevealed
  const canHint   = config.hintsEnabled && !isRevealed

  function handleHint() {
    useHint()
    onHintRequest()
  }

  return (
    <div className="border-t border-border bg-panel px-4 py-3 flex items-center gap-3">
      {config.hintsEnabled && (
        <button
          onClick={handleHint}
          disabled={!canHint}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded border text-xs font-mono transition-colors",
            canHint
              ? "border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
              : "border-border text-muted-foreground opacity-40 cursor-not-allowed"
          )}
        >
          <LightbulbIcon className="w-3.5 h-3.5" />
          HINT
        </button>
      )}
      <div className="flex-1 flex justify-end">
        {!isRevealed ? (
          <button
            onClick={revealAnswer}
            disabled={!canSubmit}
            className={cn(
              "px-6 py-2.5 rounded border text-sm font-mono font-bold tracking-wide transition-colors",
              canSubmit
                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-border bg-secondary text-muted-foreground opacity-50 cursor-not-allowed"
            )}
          >
            SUBMIT
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-6 py-2.5 rounded border border-primary bg-primary text-primary-foreground text-sm font-mono font-bold tracking-wide hover:bg-primary/90 transition-colors"
          >
            {isLast ? "FINISH" : "NEXT"}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

interface ResultsScreenProps {
  onReturnHome: () => void
  onPlayAgain: () => void
}

export function ResultsScreen({ onReturnHome, onPlayAgain }: ResultsScreenProps) {
  const { state } = useGameEngine()
  const { score, questions, bestStreak, elapsedSeconds, mode, config, hintsUsedTotal } = state

  const total = questions.length
  const accuracyPct = total > 0 ? Math.round((score / total) * 100) : 0
  const grade = calculateGrade(accuracyPct)
  const gradeCls = gradeBgColor(grade)

  const timedOut = state.globalTimeLimit > 0 && state.globalTimeRemaining <= 0
  const eliminated = mode === "survival" && state.livesRemaining <= 0

  const statusMsg = timedOut ? "TIME EXPIRED" : eliminated ? "ELIMINATED" : "PROTOCOL COMPLETE"

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 px-4 py-8 animate-fade-in">
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-mono tracking-widest text-muted-foreground">{statusMsg}</p>
        <div className={cn(
          "w-24 h-24 rounded border-2 flex items-center justify-center text-4xl font-mono font-bold",
          gradeCls
        )}>
          {grade}
        </div>
        <p className="text-sm font-mono text-muted-foreground">{modeLabel(mode)}</p>
      </div>

      <div className="w-full max-w-sm grid grid-cols-2 gap-3">
        <StatCell label="SCORE" value={`${score} / ${total}`} />
        <StatCell label="ACCURACY" value={`${accuracyPct}%`} accent={accuracyPct >= 80} />
        <StatCell label="BEST STREAK" value={String(bestStreak)} />
        <StatCell label="TIME" value={formatTime(elapsedSeconds)} />
        {config.hintsEnabled && (
          <StatCell label="HINTS USED" value={String(hintsUsedTotal)} />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={onReturnHome}
          className="flex-1 py-2.5 px-4 rounded border border-border bg-panel text-sm font-mono text-foreground/80 hover:text-foreground hover:border-border/80 transition-colors"
        >
          HOME
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-1 py-2.5 px-4 rounded border border-primary bg-primary text-primary-foreground text-sm font-mono font-bold hover:bg-primary/90 transition-colors"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  )
}

// ─── Shared stat cell ─────────────────────────────────────────────────────────

function StatCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded border border-border bg-panel">
      <span className="text-[10px] font-mono text-muted-foreground tracking-wider">{label}</span>
      <span className={cn("text-xl font-mono font-bold", accent ? "text-primary" : "text-foreground")}>
        {value}
      </span>
    </div>
  )
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" /><path d="M10 22h4" />
    </svg>
  )
}
