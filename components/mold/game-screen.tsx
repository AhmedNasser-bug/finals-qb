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

  const total          = questions.length
  const isTimedGlobal  = globalTimeLimit > 0
  const isSurvival     = mode === "survival"
  const isCritical     = isTimedGlobal && globalTimeRemaining <= 30
  const isUrgent       = isTimedGlobal && globalTimeRemaining <= 10

  // Per-question result history for segmented bar
  const answers = state.answers ?? []

  return (
    <header className="bg-[#131313] flex flex-col">
      {/* ── Segmented progress bar ── */}
      <div className="px-6 pt-4 pb-0 space-y-1">
        <div className="flex justify-between items-end">
          <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            SYSTEM_PROGRESS [{currentIndex}/{total}]
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#4ae176] uppercase">
            {modeLabel(mode).toUpperCase()}
          </span>
        </div>
        <div className="flex w-full gap-[2px]">
          {Array.from({ length: total }).map((_, i) => {
            const ans = answers[i]
            let bg = "bg-[#2a2a2a]"
            if (ans === true)  bg = "bg-[#4ae176]"
            if (ans === false) bg = "bg-[#930013]"
            if (i === currentIndex && !answers[i]) bg = "bg-[#fecc17]/60"
            return <div key={i} className={cn("h-2 flex-1", bg)} />
          })}
        </div>
      </div>

      {/* ── 3-column HUD ── */}
      <div className="grid grid-cols-3 gap-4 px-6 py-4 items-center">
        {/* Left — streak + accuracy + lives */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "bg-[#201f1f] px-3 py-2 flex items-center gap-2 border-l-2",
              streak >= 10 ? "border-[#930013]" : streak >= 5 ? "border-orange-500" : "border-[#fecc17]"
            )}>
              <BoltIcon className={cn(
                "w-4 h-4",
                streak >= 10 ? "text-[#930013]" : streak >= 5 ? "text-orange-400" : "text-[#fecc17]"
              )} />
              <div>
                <p className="font-mono text-[9px] text-zinc-500 leading-none mb-0.5 tracking-widest">STREAK_MAGNITUDE</p>
                <p className={cn(
                  "font-mono text-lg font-black leading-none",
                  streak >= 10 ? "text-[#930013]" : streak >= 5 ? "text-orange-400" : "text-[#fecc17]"
                )}>{streak}</p>
              </div>
            </div>
            <div className="hidden md:flex flex-col">
              <p className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mb-0.5">ACCURACY</p>
              <p className="font-mono text-sm text-[#4ae176]">{accuracyPct}%</p>
            </div>
          </div>
          {isSurvival && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-zinc-500 uppercase mr-1">VITAL_SIGNS:</span>
              {Array.from({ length: 3 }).map((_, i) => (
                <HeartIcon
                  key={i}
                  filled={i < livesRemaining}
                  className={cn("w-4 h-4", i < livesRemaining ? "text-[#930013]" : "text-zinc-800")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Center — timer */}
        <div className="flex flex-col items-center justify-center">
          {isTimedGlobal ? (
            <div className="relative">
              {isCritical && (
                <div className="absolute inset-0 bg-[#930013]/20 blur-xl animate-pulse" />
              )}
              <div className={cn(
                "relative px-8 py-4 text-center border-x-4",
                isCritical ? "border-[#930013] bg-[#0e0e0e]" : "border-[#fecc17]/30 bg-[#0e0e0e]"
              )}>
                <p className={cn(
                  "font-mono text-[10px] tracking-[0.4em] uppercase mb-1",
                  isCritical ? "text-[#930013]" : "text-zinc-500"
                )}>TIME_REMAINING</p>
                <p className={cn(
                  "font-mono text-5xl font-black tabular-nums leading-none",
                  isCritical ? "text-[#ffb4ab]" : "text-[#fecc17]",
                  isUrgent && "motion-safe:animate-pulse"
                )}>
                  {formatTime(globalTimeRemaining)}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#0e0e0e] px-8 py-4 text-center">
              <p className="font-mono text-[10px] text-zinc-500 tracking-[0.4em] uppercase mb-1">ELAPSED</p>
              <p className="font-mono text-4xl font-black tabular-nums text-[#fecc17] leading-none">
                {formatTime(elapsedSeconds)}
              </p>
            </div>
          )}
        </div>

        {/* Right — session metadata */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Q {Math.min(currentIndex + 1, total)} / {total}
          </p>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            SCORE: {score}
          </p>
          <button
            onClick={onForfeit}
            className="mt-3 font-mono text-[9px] text-zinc-600 hover:text-[#ffb4ab] uppercase tracking-widest transition-colors"
          >
            QUIT SESSION
          </button>
        </div>
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
    <div className="flex flex-col gap-0 animate-slide-up h-full">
      {/* Module badge bar */}
      <div className="flex justify-between items-center px-6 pt-4 pb-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#2a2a2a] px-3 py-1 font-mono text-[10px] text-[#fecc17] tracking-widest uppercase">
            {formatLabel(question.category)}
          </span>
          <span className={cn(
            "px-3 py-1 font-mono text-[10px] tracking-widest uppercase",
            question.difficulty === "Hard"   ? "bg-[#930013]/20 text-[#ffb4ab]" :
            question.difficulty === "Medium" ? "bg-[#fecc17]/10 text-[#fecc17]" :
                                               "bg-[#4ae176]/10 text-[#4ae176]"
          )}>
            {question.difficulty.toUpperCase()}
          </span>
          <span className="px-3 py-1 font-mono text-[10px] text-zinc-500 tracking-widest uppercase bg-[#201f1f]">
            {question.type === "TrueFalse" ? "TRUE/FALSE" : "MCQ"}
          </span>
        </div>
        <span className="text-zinc-600 font-mono text-[10px]">
          {question.type}
        </span>
      </div>

      {/* Amber accent strip */}
      <div className="mx-6 mt-3 h-[3px] w-12 bg-[#fecc17]" />

      {/* Question headline */}
      <div className="px-6 pt-4 pb-2 flex-1">
        <h2 className="font-sans text-2xl md:text-4xl font-black text-[#e5e2e1] leading-tight text-pretty uppercase tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Hint */}
      {showHint && question.hint && (
        <div className="mx-6 mb-2 px-4 py-3 border-l-2 border-[#fecc17]/40 bg-[#201f1f] animate-fade-in">
          <span className="font-mono text-[10px] text-[#fecc17] tracking-widest mr-2">HINT</span>
          <span className="font-mono text-xs text-zinc-300">{question.hint}</span>
        </div>
      )}

      {/* Explanation after reveal */}
      {isRevealed && question.explanation && (
        <div className="mx-6 mb-2 px-4 py-3 border-l-2 border-[#4ae176]/40 bg-[#201f1f] animate-fade-in">
          <span className="font-mono text-[10px] text-[#4ae176] tracking-widest mr-2">EXPLANATION</span>
          <span className="font-mono text-xs text-zinc-300">{question.explanation}</span>
        </div>
      )}

      {/* Options */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-[2px] mx-0 mt-2 bg-[#0e0e0e]"
        role="radiogroup"
        aria-label="Answer options"
      >
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.label
          const isCorrect  = opt.label === question.answer
          const isWrong    = isRevealed && isSelected && !isCorrect

          let bg = "bg-[#2a2a2a] hover:bg-[#fecc17] hover:text-black"
          let textColor = "text-[#e5e2e1]"
          if (!isRevealed && isSelected) {
            bg = "bg-[#fecc17] text-black"
            textColor = "text-black"
          } else if (isRevealed && isCorrect) {
            bg = "bg-[#4ae176]/20 border-l-4 border-[#4ae176]"
            textColor = "text-[#4ae176]"
          } else if (isWrong) {
            bg = "bg-[#930013]/20 border-l-4 border-[#930013]"
            textColor = "text-[#ffb4ab]"
          } else if (isRevealed) {
            bg = "bg-[#201f1f]"
            textColor = "text-zinc-600"
          }

          return (
            <button
              key={opt.label}
              role="radio"
              aria-checked={isSelected}
              disabled={isRevealed}
              onClick={() => selectOption(opt.label)}
              className={cn(
                "flex items-center justify-between px-6 py-5 text-left transition-all duration-100 group btn-depress",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17]",
                bg
              )}
            >
              <span className={cn("font-mono text-xs tracking-widest uppercase", textColor)}>
                {opt.label}: {opt.text}
              </span>
              <div className="flex items-center gap-2">
                {isRevealed && isCorrect && <CheckIcon className="w-4 h-4 text-[#4ae176]" />}
                {isWrong && <XIcon className="w-4 h-4 text-[#ffb4ab]" />}
                {!isRevealed && (
                  <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-black" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Game Footer Controls ─────────────────────────────────────────────────────

export function GameFooter({ onHintRequest }: { onHintRequest: () => void }) {
  const { state, revealAnswer, nextQuestion, useHint } = useGameEngine()
  const { isRevealed, selectedOption, config, currentIndex, questions } = state

  const isLast    = currentIndex >= questions.length - 1
  const canSubmit = selectedOption !== null && !isRevealed
  const canHint   = config.hintsEnabled && !isRevealed

  function handleHint() {
    useHint()
    onHintRequest()
  }

  return (
    <div className="bg-[#131313] px-4 py-3 flex items-center gap-3">
      {config.hintsEnabled && (
        <button
          onClick={handleHint}
          disabled={!canHint}
          className={cn(
            "flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-widest uppercase transition-colors border",
            canHint
              ? "border-[#fecc17]/40 text-[#fecc17] hover:bg-[#fecc17]/10 btn-depress"
              : "border-[#2a2a2a] text-zinc-700 cursor-not-allowed"
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
              "px-8 py-3 font-mono text-xs font-black tracking-widest uppercase transition-all btn-depress",
              canSubmit
                ? "cta-gradient"
                : "bg-[#2a2a2a] text-zinc-600 cursor-not-allowed"
            )}
          >
            SUBMIT_ANSWER
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-8 py-3 cta-gradient font-mono text-xs font-black tracking-widest uppercase btn-depress animate-slide-up"
          >
            {isLast ? "VIEW_RESULTS" : "NEXT_QUERY"}
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

  const total       = questions.length
  const accuracyPct = total > 0 ? Math.round((score / total) * 100) : 0
  const grade       = calculateGrade(accuracyPct)

  const timedOut    = state.globalTimeLimit > 0 && state.globalTimeRemaining <= 0
  const eliminated  = mode === "survival" && state.livesRemaining <= 0
  const statusMsg   = timedOut ? "TIME_EXPIRED" : eliminated ? "ELIMINATED" : "PROTOCOL_COMPLETE"

  // Grade color mapping
  const gradeColor =
    grade === "S+" || grade === "S" ? "#fecc17" :
    grade === "A+" || grade === "A" ? "#4ae176" :
    grade === "B"                   ? "#67d7f0" :
    grade === "C"                   ? "#fb8c00" : "#ffb4ab"

  // Per-question result strip
  const answers = state.answers ?? []

  return (
    <div className="flex flex-col flex-1 bg-[#131313] animate-fade-in overflow-y-auto">
      {/* Top status bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#1c1b1b]">
        <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
          SESSION_RESULT
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: gradeColor }}>
          {statusMsg}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left panel — grade + stats */}
        <div className="flex flex-col items-center justify-center gap-6 px-8 py-10 lg:w-80 bg-[#1c1b1b]">
          {/* Grade display */}
          <div className="flex flex-col items-center gap-2">
            <p className="font-mono text-[10px] text-zinc-500 tracking-[0.3em] uppercase">FINAL_GRADE</p>
            <div
              className="w-32 h-32 flex items-center justify-center scanlines relative"
              style={{ border: `3px solid ${gradeColor}`, boxShadow: `0 0 30px ${gradeColor}30` }}
            >
              <span
                className="font-mono text-6xl font-black leading-none z-10"
                style={{ color: gradeColor }}
              >
                {grade}
              </span>
            </div>
            <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
              {modeLabel(mode).toUpperCase()}
            </p>
          </div>

          {/* Stats grid */}
          <div className="w-full grid grid-cols-2 gap-[2px] bg-[#0e0e0e]">
            <StatCell label="SCORE"       value={`${score}/${total}`}       />
            <StatCell label="ACCURACY"    value={`${accuracyPct}%`}  accent />
            <StatCell label="BEST_STREAK" value={`×${bestStreak}`}          />
            <StatCell label="TIME"        value={formatTime(elapsedSeconds)} />
            {config.hintsEnabled && (
              <StatCell label="HINTS_USED" value={String(hintsUsedTotal)} className="col-span-2" />
            )}
          </div>
        </div>

        {/* Right panel — result strip + accuracy bar */}
        <div className="flex-1 flex flex-col gap-6 p-6 md:p-10">
          {/* Per-question result grid */}
          <div className="space-y-3">
            <p className="font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase">
              QUERY_LOG [{total} ENTRIES]
            </p>
            <div
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${Math.min(total, 20)}, 1fr)` }}
            >
              {Array.from({ length: total }).map((_, i) => {
                const ans = answers[i]
                return (
                  <div
                    key={i}
                    title={`Q${i + 1}: ${ans === true ? "Correct" : ans === false ? "Wrong" : "Skipped"}`}
                    className={cn(
                      "h-6",
                      ans === true  ? "bg-[#4ae176]" :
                      ans === false ? "bg-[#930013]" :
                                      "bg-[#2a2a2a]"
                    )}
                  />
                )
              })}
            </div>
          </div>

          {/* Accuracy bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">ACCURACY_RATING</span>
              <span className="font-mono text-sm font-black" style={{ color: gradeColor }}>{accuracyPct}%</span>
            </div>
            <div className="w-full h-4 bg-[#0e0e0e]">
              <div
                className="h-full transition-all duration-700 ease-out"
                style={{ width: `${accuracyPct}%`, backgroundColor: gradeColor }}
              />
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-[2px] mt-auto pt-4">
            <button
              onClick={onReturnHome}
              className="flex-1 py-4 px-6 bg-[#2a2a2a] hover:bg-[#353534] text-[#e5e2e1] font-mono text-xs font-black tracking-widest uppercase transition-colors btn-depress"
            >
              RETURN_HOME
            </button>
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 px-6 cta-gradient font-mono text-xs font-black tracking-widest uppercase btn-depress"
            >
              REINITIALIZE_SESSION
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Shared stat cell ─────────────────────────────────────────────────────────

function StatCell({
  label, value, accent, className,
}: {
  label: string; value: string; accent?: boolean; className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1 p-3 bg-[#201f1f]", className)}>
      <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">{label}</span>
      <span className={cn(
        "font-mono text-xl font-black",
        accent ? "text-[#fecc17]" : "text-[#e5e2e1]"
      )}>
        {value}
      </span>
    </div>
  )
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.09 12.97H11L10 22L19.91 11.03H13L13 2Z" />
    </svg>
  )
}

function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

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

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
