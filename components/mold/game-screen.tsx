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

  // Segmented progress bar — each segment maps to one question.
  // When there are more than 60 questions the bar would produce hairline-thin
  // blocks, so we bucket them: up to 60 segments, each covering ⌈total/60⌉
  // questions. A bucket is green if all answered correctly, red if any wrong,
  // amber if it contains the current unanswered question, dark if untouched.
  const MAX_SEGMENTS = 60
  const answers = state.answers ?? []
  const segmentCount = Math.min(total, MAX_SEGMENTS)
  const bucketSize   = total / segmentCount  // may be fractional

  const segments = Array.from({ length: segmentCount }, (_, s) => {
    const startIdx = Math.round(s * bucketSize)
    const endIdx   = Math.round((s + 1) * bucketSize)
    const slice    = answers.slice(startIdx, endIdx)
    const hasCurrent = currentIndex >= startIdx && currentIndex < endIdx

    const allAnswered  = slice.length > 0 && slice.every((a) => a !== undefined)
    const anyWrong     = slice.some((a) => a === false)
    const allCorrect   = slice.every((a) => a === true)

    if (allAnswered && allCorrect)  return "correct"
    if (allAnswered && anyWrong)    return "wrong"
    if (hasCurrent)                 return "current"
    if (slice.some((a) => a !== undefined)) return "partial"
    return "unseen"
  })

  return (
    <header className="bg-[#131313] flex flex-col">
      {/* ── Segmented progress bar ── */}
      <div className="px-6 md:px-10 pt-4 pb-0 space-y-1">
        <div className="flex justify-between items-end">
          <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            SYSTEM_PROGRESS [{currentIndex}/{total}]{total > MAX_SEGMENTS ? ` — ${segmentCount} SEGMENTS` : ""}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#4ae176] uppercase">
            SYNC_STATUS: {accuracyPct >= 80 ? "OPTIMAL" : accuracyPct >= 50 ? "DEGRADED" : "CRITICAL"}
          </span>
        </div>
        <div className="flex w-full gap-[2px]">
          {segments.map((seg, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1",
                seg === "correct"  && "bg-[#4ae176]",
                seg === "wrong"    && "bg-[#930013]",
                seg === "current"  && "bg-[#fecc17]/70",
                seg === "partial"  && "bg-[#fecc17]/30",
                seg === "unseen"   && "bg-[#353534]",
              )}
            />
          ))}
        </div>
      </div>

      {/* ── 3-column HUD ── */}
      <div className="grid grid-cols-3 gap-4 px-6 md:px-10 py-5 items-center">
        {/* Left — streak badge + accuracy + lives */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            {/* Streak badge */}
            <div className={cn(
              "bg-[#201f1f] px-4 py-2 flex items-center gap-3 border-l-2",
              streak >= 10
                ? "border-[#930013] shadow-[0px_0px_20px_rgba(147,0,10,0.3)]"
                : streak >= 5
                ? "border-orange-500 shadow-[0px_0px_15px_rgba(251,146,60,0.2)]"
                : "border-[#fecc17] shadow-[0px_0px_15px_rgba(254,204,23,0.15)]"
            )}>
              <BoltIcon className={cn(
                "w-4 h-4 shrink-0",
                streak >= 10 ? "text-[#930013]" : streak >= 5 ? "text-orange-400" : "text-[#fecc17]"
              )} />
              <div>
                <p className="font-mono text-[9px] text-zinc-500 leading-none mb-1 tracking-widest uppercase">STREAK_MAGNITUDE</p>
                <p className={cn(
                  "font-mono text-xl font-black leading-none",
                  streak >= 10 ? "text-[#930013]" : streak >= 5 ? "text-orange-400" : "text-[#fecc17]"
                )}>{streak}</p>
              </div>
            </div>
            {/* Accuracy — sibling, not inside badge */}
            <div className="hidden md:flex flex-col">
              <p className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mb-1">ACCURACY</p>
              <p className="font-mono text-sm text-[#4ae176]">{accuracyPct}%</p>
            </div>
          </div>
          {/* Lives — always shown, empty hearts when not survival */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-zinc-500 uppercase mr-1">VITAL_SIGNS:</span>
            {Array.from({ length: 3 }).map((_, i) => {
              const alive = isSurvival ? i < livesRemaining : i < 3
              return (
                <HeartIcon
                  key={i}
                  filled={alive}
                  className={cn("w-4 h-4", alive ? "text-[#930013]" : "text-zinc-800")}
                />
              )
            })}
          </div>
        </div>

        {/* Center — timer */}
        <div className="flex flex-col items-center justify-center">
          {isTimedGlobal ? (
            <div className="relative group">
              {/* Pulsing bg glow — only visible in critical state */}
              <div className={cn(
                "absolute inset-0 blur-xl animate-pulse transition-opacity duration-500",
                isCritical ? "bg-[#930013]/20 opacity-100" : "opacity-0"
              )} />
              <div className={cn(
                "relative bg-[#0e0e0e] border-x-4 px-10 py-5 text-center",
                isCritical ? "border-[#930013]" : "border-[#930013]/30"
              )}>
                <p className={cn(
                  "font-mono text-[10px] tracking-[0.4em] uppercase mb-2",
                  isCritical ? "text-[#930013]" : "text-zinc-600"
                )}>TIME_REMAINING</p>
                <p className={cn(
                  "font-mono text-5xl font-black tabular-nums leading-none",
                  isCritical ? "text-[#ffb4ab]" : "text-[#ffb4ab]/70",
                  isUrgent && "motion-safe:animate-pulse"
                )}>
                  {formatTime(globalTimeRemaining)}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div className="relative bg-[#0e0e0e] border-x-4 border-[#930013]/20 px-10 py-5 text-center">
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-2 text-zinc-600">ELAPSED</p>
                <p className="font-mono text-5xl font-black tabular-nums leading-none text-[#fecc17]">
                  {formatTime(elapsedSeconds)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right — session metadata + dots */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            SESSION_ID: {mode.toUpperCase()}-MOLD
          </p>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            DIFFICULTY: {state.config?.difficulty?.toUpperCase() ?? "STANDARD"}
          </p>
          {/* Live indicator dots */}
          <div className="mt-4 flex gap-2">
            <div className="w-2 h-2 bg-[#4ae176] animate-pulse" />
            <div className="w-2 h-2 bg-[#4ae176]/40" />
            <div className="w-2 h-2 bg-[#4ae176]/40" />
          </div>
          {/* Quit — recessed, hard to miss-tap */}
          <button
            onClick={onForfeit}
            className="mt-3 font-mono text-[9px] text-zinc-700 hover:text-[#ffb4ab] uppercase tracking-widest transition-colors"
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
  const { state, selectOption, accuracyPct } = useGameEngine()
  const { selectedOption, isRevealed, currentIndex, questions } = state

  const grade = calculateGrade(accuracyPct)
  const gradeColor =
    grade === "S+" || grade === "S" ? "#fecc17" :
    grade === "A+" || grade === "A" ? "#4ae176" :
    grade === "B"                   ? "#67d7f0" :
    grade === "C"                   ? "#fb8c00" : "#ffb4ab"

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-slide-up">
      {/* ── Main card — surface-container-low with scanlines ── */}
      <div className="relative flex-1 bg-[#1c1b1b] flex flex-col min-h-0">
        {/* Scanline texture */}
        <div className="scanlines absolute inset-0 opacity-20 pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col flex-1 min-h-0 p-6 md:p-8 gap-6">
          {/* Top metadata row */}
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
              CHALLENGE_ID: {formatLabel(question.category)}_{String(currentIndex + 1).padStart(2, "0")}
            </span>
            <div className="text-right">
              <span
                className="font-mono text-4xl font-black tracking-tighter leading-none block"
                style={{ color: gradeColor }}
              >
                {grade}
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#4ae176]">
                CURRENT_PERFORMANCE
              </span>
            </div>
          </div>

          {/* Question headline + subtext */}
          <div className="space-y-3">
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#e5e2e1] leading-tight tracking-tight text-pretty uppercase">
              {question.question}
            </h2>
            {/* Difficulty / type subtext */}
            <p className="font-sans text-sm text-zinc-400">
              {question.difficulty} &mdash; {question.type === "TrueFalse" ? "True / False" : "Multiple Choice"}
            </p>
          </div>

          {/* Options grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            role="radiogroup"
            aria-label="Answer options"
          >
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.label
              const isCorrect  = opt.label === question.answer
              const isWrong    = isRevealed && isSelected && !isCorrect
              const isDimmed   = isRevealed && !isCorrect && !isSelected

              return (
                <button
                  key={opt.label}
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isRevealed}
                  onClick={() => selectOption(opt.label)}
                  className={cn(
                    "relative flex items-start justify-between p-5 text-left transition-all duration-100 btn-depress group",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17]",
                    // Base + selected
                    !isRevealed && !isSelected && "bg-[#2a2a2a] hover:bg-[#353534] border-l-4 border-transparent hover:border-[#4e4632]",
                    !isRevealed && isSelected  && "bg-[#2a2a2a] border-l-4 border-[#fecc17] glow-primary",
                    // Revealed states
                    isRevealed && isCorrect    && "bg-[#4ae176]/10 border-l-4 border-[#4ae176]",
                    isRevealed && isWrong      && "bg-[#930013]/10 border-l-4 border-[#930013]",
                    isDimmed                   && "bg-[#1c1b1b] border-l-4 border-transparent opacity-40",
                  )}
                >
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <span className={cn(
                      "font-mono text-[10px] tracking-widest uppercase",
                      !isRevealed && isSelected  ? "text-[#fecc17]" :
                      isRevealed  && isCorrect   ? "text-[#4ae176]" :
                      isRevealed  && isWrong     ? "text-[#ffb4ab]" :
                                                   "text-zinc-500"
                    )}>
                      OPTION_{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className={cn(
                      "font-mono text-base font-bold leading-snug",
                      !isRevealed && isSelected  ? "text-[#fecc17]" :
                      isRevealed  && isCorrect   ? "text-[#4ae176]" :
                      isRevealed  && isWrong     ? "text-[#ffb4ab]" :
                      isDimmed                   ? "text-zinc-600"  :
                                                   "text-[#e5e2e1]"
                    )}>
                      {opt.text}
                    </span>
                  </div>
                  {/* State icon */}
                  <div className="ml-3 mt-0.5 shrink-0">
                    {isRevealed && isCorrect && (
                      <CheckCircleIcon className="w-5 h-5 text-[#fecc17]" />
                    )}
                    {isRevealed && isWrong && (
                      <XIcon className="w-5 h-5 text-[#ffb4ab]" />
                    )}
                    {!isRevealed && isSelected && (
                      <CheckCircleIcon className="w-5 h-5 text-[#fecc17]" />
                    )}
                    {!isRevealed && !isSelected && (
                      <RadioIcon className="w-5 h-5 text-zinc-700" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Hint / explanation panel — surface-container-lowest ── */}
      {(showHint && question.hint) || (isRevealed && question.explanation) ? (
        <div className="bg-[#0e0e0e] px-6 py-4 flex items-start gap-4 animate-fade-in border-t border-[#2a2a2a]">
          <LightbulbIcon className="w-4 h-4 text-[#fecc17] mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              {isRevealed ? "SYSTEM_EXPLANATION" : "SYSTEM_HINT"}
            </span>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed italic">
              &quot;{isRevealed ? question.explanation : question.hint}&quot;
            </p>
          </div>
        </div>
      ) : null}
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
    <footer className="bg-[#1a1d21] border-t border-[#fecc17]/10 px-4 h-24 flex items-center gap-4">
      {/* HINT — stacked icon + label */}
      {config.hintsEnabled && (
        <button
          onClick={handleHint}
          disabled={!canHint}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-4 w-16 shrink-0 btn-depress transition-all",
            canHint
              ? "text-[#fecc17] hover:text-[#ffedc2]"
              : "text-zinc-700 cursor-not-allowed"
          )}
        >
          <div className={cn(
            "w-8 h-8 flex items-center justify-center border font-mono text-sm font-black",
            canHint ? "border-[#fecc17]/40 bg-[#fecc17]/10 text-[#fecc17]" : "border-[#2a2a2a] bg-[#1c1b1b] text-zinc-700"
          )}>?</div>
          <span className="font-mono text-[9px] tracking-widest uppercase font-bold">HINT</span>
        </button>
      )}

      {/* Primary CTA — full amber width */}
      <div className="flex-1">
        {!isRevealed ? (
          <button
            onClick={revealAnswer}
            disabled={!canSubmit}
            className={cn(
              "w-full h-12 font-mono text-sm font-black tracking-[0.2em] uppercase transition-all btn-depress",
              canSubmit
                ? "cta-gradient"
                : "bg-[#2a2a2a] text-zinc-600 cursor-not-allowed"
            )}
          >
            SUBMIT_SEQUENCE
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="w-full h-12 cta-gradient font-mono text-sm font-black tracking-[0.2em] uppercase btn-depress animate-slide-up"
          >
            {isLast ? "VIEW_RESULTS" : "CONTINUE_SESSION"}
          </button>
        )}
      </div>

      {/* STATUS + SKIP */}
      <div className="flex items-center gap-4 shrink-0">
        {!isRevealed && (
          <div className="hidden md:flex flex-col items-end">
            <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">STATUS</span>
            <span className="font-mono text-xs text-zinc-500 font-bold uppercase">
              {canSubmit ? "READY_TO_SUBMIT" : "WAITING_FOR_INPUT"}
            </span>
          </div>
        )}
        {isRevealed && (
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 h-12 px-4 border border-[#2a2a2a] text-zinc-500 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#fecc17] hover:border-[#fecc17]/40 transition-all"
          >
            <SkipIcon className="w-4 h-4" />
            SKIP
          </button>
        )}
      </div>
    </footer>
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.58L18 8.5l-8 8z"/>
    </svg>
  )
}

function RadioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

function SkipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
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
