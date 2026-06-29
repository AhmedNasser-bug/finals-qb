"use client"

import { useGameEngine } from "@/lib/game-engine"
import { formatTime } from "@/lib/mold-types"
import * as React from "react"
import { cn } from "@/lib/utils"
import { BoltIcon, HeartIcon } from "@/components/mold/game/game-icons"
import { useCheatSheet } from "@/lib/game/cheat-sheet-context"

export function GameHeader({ onForfeit }: { onForfeit: () => void }) {
  const { state, accuracyPct } = useGameEngine()
  const { toggleCheatSheet } = useCheatSheet()
  const {
    mode, currentIndex, questions, streak,
    globalTimeRemaining, globalTimeLimit, elapsedSeconds, livesRemaining,
    streakShieldActive, streakShieldTriggeredThisQuestion,
  } = state

  const total = questions.length
  const isTimedGlobal = globalTimeLimit > 0
  const isSurvival = mode === "survival"
  const isCritical = isTimedGlobal && globalTimeRemaining <= 30
  const isUrgent = isTimedGlobal && globalTimeRemaining <= 10

  // Segmented progress bar — each segment maps to one question.
  // When there are more than 60 questions the bar would produce hairline-thin
  // blocks, so we bucket them: up to 60 segments, each covering ⌈total/60⌉
  // questions. A bucket is green if all answered correctly, red if any wrong,
  // amber if it contains the current unanswered question, dark if untouched.
  const MAX_SEGMENTS = 60
  const answers = state.answers ?? []
  const segmentCount = Math.min(total, MAX_SEGMENTS)
  const bucketSize = total / segmentCount  // may be fractional

  const segments = Array.from({ length: segmentCount }, (_, s) => {
    const startIdx = Math.round(s * bucketSize)
    const endIdx = Math.round((s + 1) * bucketSize)
    const hasCurrent = currentIndex >= startIdx && currentIndex < endIdx

    let allAnswered = startIdx < endIdx
    let anyWrong = false
    let anyAnswered = false
    let allCorrect = startIdx < endIdx

    for (let j = startIdx; j < endIdx; j++) {
      const a = answers[j]
      if (a === undefined) {
        allAnswered = false
        allCorrect = false
      } else {
        anyAnswered = true
        if (a === false) {
          anyWrong = true
          allCorrect = false
        }
      }
    }

    if (allAnswered && allCorrect) return "correct"
    if (allAnswered && anyWrong) return "wrong"
    if (hasCurrent) return "current"
    if (anyAnswered) return "partial"
    return "unseen"
  })

  return (
    <header className="bg-[#131313] flex flex-col">
      {/* ── Segmented progress bar ── */}
      <div className="px-6 md:px-10 pt-2.5 pb-0 space-y-0.5">
        <div className="flex justify-between items-end">
          <div className="flex items-center">
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              PROGRESS [{currentIndex}/{total}]{total > MAX_SEGMENTS ? ` — ${segmentCount} SEGMENTS` : ""}
            </span>
            {streak > 0 && (
              <span className={cn(
                "ml-3 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-300",
                streak >= 12 
                  ? "bg-grade-a/20 text-grade-a border border-grade-a/40 shadow-[0_0_15px_rgba(74,225,118,0.4)] animate-pulse"
                  : streak >= 8
                    ? "bg-destructive/20 text-destructive border border-destructive/40 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-bounce"
                    : streak >= 5
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                      : streak >= 3
                        ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_8px_rgba(254,204,23,0.2)]"
                        : "bg-[#201f1f] text-zinc-400 border border-zinc-800"
              )}>
                <span className="text-[10px] animate-pulse">🔥</span>
                <span>STREAK ×{streak}</span>
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#4ae176] uppercase">
            ACCURACY RATING: {accuracyPct >= 80 ? "EXCELLENT" : accuracyPct >= 50 ? "AVERAGE" : "LOW"}
          </span>
        </div>
        <div className="flex w-full gap-[2px]">
          {segments.map((seg, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1",
                seg === "correct" && "bg-[#4ae176]",
                seg === "wrong" && "bg-[#930013]",
                seg === "current" && "bg-[var(--tw-hex-fecc17)]/70",
                seg === "partial" && "bg-[var(--tw-hex-fecc17)]/30",
                seg === "unseen" && "bg-[#353534]",
              )}
            />
          ))}
        </div>
      </div>

      {/* ── RESPONSIVE HUD PANEL ── */}
      
      {/* ── Mobile Layout (under md) ── */}
      <div className="flex md:hidden items-center justify-between gap-3 px-4 py-3 bg-[#131313] border-b border-zinc-800/80 select-none">
        
        {/* Left: Streak & Lives */}
        <div className="flex items-center gap-2">
          {/* Compact Streak */}
          <div className={cn(
            "px-2 py-1 flex items-center gap-1 border-l-2 bg-[#201f1f]",
            streak >= 10 ? "border-[#930013]" : streak >= 5 ? "border-orange-500" : "border-[#fecc17]"
          )}>
            <BoltIcon aria-hidden="true" className={cn(
              "w-3.5 h-3.5 shrink-0",
              streak >= 10 ? "text-[#930013]" : streak >= 5 ? "text-orange-400" : "text-[#fecc17]"
            )} />
            <span className={cn(
              "font-mono text-sm font-black leading-none",
              streak >= 10 ? "text-[#930013]" : streak >= 5 ? "text-orange-400" : "text-[#fecc17]"
            )}>{streak}</span>
          </div>

          {/* Compact Hearts */}
          <div className="flex items-center gap-0.5 ml-1">
            {Array.from({ length: 3 }).map((_, i) => {
              const alive = isSurvival ? i < livesRemaining : i < 3
              return (
                <HeartIcon aria-hidden="true" key={i}
                  filled={alive}
                  className={cn("w-3.5 h-3.5", alive ? "text-[#930013]" : "text-zinc-800")}
                />
              )
            })}
          </div>

          {/* Streak Shield (Mobile) */}
          {streakShieldActive && (
            <span className="text-[12px] animate-pulse ml-1 text-cyan-400 select-none" title="Streak Shield Active">🛡️</span>
          )}
          {streakShieldTriggeredThisQuestion && (
            <span className="text-[12px] animate-bounce ml-1 text-red-500 select-none animate-pulse" title="Shield Shattered!">💥</span>
          )}
        </div>

        {/* Center: Compact Timer */}
        <div className="flex items-center justify-center">
          <div className={cn(
            "bg-[#0e0e0e] border-x-2 px-3 py-1 text-center flex items-center gap-1.5",
            isCritical ? "border-[#930013]" : "border-[var(--tw-hex-930013)]/30"
          )}>
            <span className={cn(
              "font-mono text-[8px] tracking-wider uppercase",
              isCritical ? "text-[#930013] font-bold animate-pulse" : "text-muted-foreground/60"
            )}>
              {isTimedGlobal ? "TIME" : "TIME"}
            </span>
            <span className={cn(
              "font-mono text-sm font-black tabular-nums leading-none",
              isCritical ? "text-[#ffb4ab]" : "text-[#fecc17]",
              isUrgent && "motion-safe:animate-pulse"
            )}>
              {formatTime(isTimedGlobal ? globalTimeRemaining : elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Right: Quit & Review Deck Buttons (Compact for Mobile) */}
        <div className="flex gap-2">
          <button
            onClick={toggleCheatSheet}
            aria-label="Open Review Deck"
            title="Open Review Deck"
            className="px-2 border border-zinc-800 bg-[#1b1b1f] text-[#fecc17] font-mono text-[9px] font-black tracking-widest uppercase rounded hover:border-[#fecc17]/40 hover:bg-[#fecc17]/10 min-h-[32px] cursor-pointer transition-all active:scale-95"
          >
            [DECK]
          </button>
          <button
            onClick={onForfeit}
            aria-label="Quit session"
            title="Quit session"
            className="px-2.5 py-1.5 border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-[9px] font-black tracking-widest uppercase rounded hover:border-red-500 hover:bg-red-500/10 min-h-[32px] cursor-pointer transition-all active:scale-95"
          >
            QUIT
          </button>
        </div>
      </div>

      {/* ── Desktop Layout (md and above) ── */}
      <div className="hidden md:grid grid-cols-3 gap-4 px-6 md:px-10 py-2.5 items-center">
        {/* Left — streak badge + accuracy + lives */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-4">
            {/* Streak badge */}
            <div className={cn(
              "bg-[#201f1f] px-2.5 py-1 flex items-center gap-2 border-l-2",
              streak >= 10
                ? "border-[#930013] shadow-[0px_0px_20px_rgba(147,0,10,0.3)]"
                : streak >= 5
                  ? "border-orange-500 shadow-[0px_0px_15px_rgba(251,146,60,0.2)]"
                  : "border-[#fecc17] shadow-[0px_0px_15px_rgba(254,204,23,0.15)]"
            )}>
              <BoltIcon aria-hidden="true" className={cn(
                "w-3.5 h-3.5 shrink-0",
                streak >= 10 ? "text-[#930013]" : streak >= 5 ? "text-orange-400" : "text-[#fecc17]"
              )} />
              <div>
                <p className="font-mono text-[8px] text-muted-foreground leading-none mb-0.5 tracking-widest uppercase">CURRENT STREAK</p>
                <p className={cn(
                  "font-mono text-base font-black leading-none",
                  streak >= 10 ? "text-[#930013]" : streak >= 5 ? "text-orange-400" : "text-[#fecc17]"
                )}>{streak}</p>
              </div>
            </div>
            {/* Accuracy — sibling, not inside badge */}
            <div className="hidden md:flex flex-col">
              <p className="font-mono text-[8px] text-muted-foreground tracking-widest uppercase mb-0.5">ACCURACY</p>
              <p className="font-mono text-xs text-[#4ae176]">{accuracyPct}%</p>
            </div>
          </div>
          {/* Lives — always shown, empty hearts when not survival */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] text-muted-foreground uppercase mr-1">LIVES REMAINING:</span>
            {Array.from({ length: 3 }).map((_, i) => {
              const alive = isSurvival ? i < livesRemaining : i < 3
              return (
                <HeartIcon aria-hidden="true" key={i}
                  filled={alive}
                  className={cn("w-3.5 h-3.5", alive ? "text-[#930013]" : "text-zinc-800")}
                />
              )
            })}
          </div>

          {/* Streak Shield Indicator (Desktop) */}
          {(streakShieldActive || streakShieldTriggeredThisQuestion) && (
            <div className="flex items-center gap-2 mt-1 select-none">
              {streakShieldActive && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 font-mono text-[9px] font-black tracking-widest uppercase rounded shadow-[0_0_12px_rgba(34,211,238,0.3)] animate-pulse">
                  <span className="text-[10px]">🛡️</span>
                  <span>STREAK SHIELD ACTIVE</span>
                </div>
              )}
              {streakShieldTriggeredThisQuestion && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 border border-red-500 bg-red-950/50 text-red-400 font-mono text-[9px] font-bold tracking-widest uppercase rounded shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-bounce">
                  <span className="text-[10px]">💥</span>
                  <span>SHIELD SHATTERED / BRACED</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center — timer */}
        <div className="flex flex-col items-center justify-center">
          {isTimedGlobal ? (
            <div className="relative group">
              {/* Pulsing bg glow — only visible in critical state */}
              <div className={cn(
                "absolute inset-0 blur-xl animate-pulse transition-opacity duration-500",
                isCritical ? "bg-[var(--tw-hex-930013)]/20 opacity-100" : "opacity-0"
              )} />
              <div className={cn(
                "relative bg-[#0e0e0e] border-x-4 px-3 py-1 sm:px-5 sm:py-2 text-center",
                isCritical ? "border-[#930013]" : "border-[var(--tw-hex-930013)]/30"
              )}>
                <p className={cn(
                  "font-mono text-[8px] tracking-[0.4em] uppercase mb-0.5 sm:mb-1",
                  isCritical ? "text-[#930013]" : "text-muted-foreground/80"
                )}>TIME REMAINING</p>
                <p className={cn(
                  "font-mono text-xl sm:text-2xl md:text-3xl font-black tabular-nums leading-none",
                  isCritical ? "text-[#ffb4ab]" : "text-[var(--tw-hex-ffb4ab)]/70",
                  isUrgent && "motion-safe:animate-pulse"
                )}>
                  {formatTime(globalTimeRemaining)}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div className="relative bg-[#0e0e0e] border-x-4 border-[var(--tw-hex-930013)]/20 px-3 py-1 sm:px-5 sm:py-2 text-center">
                <p className="font-mono text-[8px] tracking-[0.4em] uppercase mb-0.5 sm:mb-1 text-muted-foreground/80">ELAPSED</p>
                <p className="font-mono text-xl sm:text-2xl md:text-3xl font-black tabular-nums leading-none text-[#fecc17]">
                  {formatTime(elapsedSeconds)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right — session metadata + dots */}
        <div className="hidden md:flex flex-col items-end gap-0.5">
          <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
            QUIZ MODE: {mode.toUpperCase()}
          </p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
            DIFFICULTY: {state.config?.difficulty?.toUpperCase() ?? "STANDARD"}
          </p>
          {/* Live indicator dots */}
          <div className="mt-1.5 flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#4ae176] animate-pulse" />
            <div className="w-1.5 h-1.5 bg-[var(--tw-hex-4ae176)]/40" />
            <div className="w-1.5 h-1.5 bg-[var(--tw-hex-4ae176)]/40" />
          </div>
          {/* Review Deck & Quit Buttons */}
          <div className="md:mt-1.5 flex gap-2">
            <button
              onClick={toggleCheatSheet}
              className="font-mono text-[10px] font-bold px-3 py-1.5 border border-zinc-800 bg-[#1b1b1f] text-[#fecc17] hover:border-[#fecc17]/50 hover:bg-[#fecc17]/10 uppercase tracking-widest transition-all duration-150 focus-ring min-h-[32px] shrink-0 cursor-pointer"
              title="Open Review Deck (Ctrl + `)"
            >
              [REVIEW DECK]
            </button>
            <button
              onClick={onForfeit}
              aria-label="Quit current game session"
              title="Quit current game session"
              className="font-mono text-[10px] font-bold px-3 py-1.5 border border-zinc-800 bg-[#1b1b1f] text-muted-foreground hover:border-[#930013] hover:bg-[var(--tw-hex-930013)]/10 hover:text-[#ffb4ab] uppercase tracking-widest transition-all duration-150 focus-ring min-h-[32px] shrink-0 cursor-pointer"
            >
              QUIT SESSION
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
