"use client"

import { useGameEngine } from "@/lib/game-engine"
import { formatTime } from "@/lib/mold-types"
import * as React from "react"
import { cn } from "@/lib/utils"
import { BoltIcon, HeartIcon } from "./game-icons"

export function GameHeader({ onForfeit }: { onForfeit: () => void }) {
  const { state, accuracyPct } = useGameEngine()
  const {
    mode, currentIndex, questions, streak,
    globalTimeRemaining, globalTimeLimit, elapsedSeconds, livesRemaining,
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

    let allAnswered = true
    let anyWrong = false
    let allCorrect = true
    let hasAnyAnswer = false

    if (endIdx <= startIdx) {
      allAnswered = false
      allCorrect = false
    } else {
      for (let i = startIdx; i < endIdx; i++) {
        const a = answers[i]
        if (a === undefined) {
          allAnswered = false
          allCorrect = false
        } else {
          hasAnyAnswer = true
          if (a === false) {
            anyWrong = true
            allCorrect = false
          }
        }
      }
    }

    if (allAnswered && allCorrect) return "correct"
    if (allAnswered && anyWrong) return "wrong"
    if (hasCurrent) return "current"
    if (hasAnyAnswer) return "partial"
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
                seg === "correct" && "bg-[#4ae176]",
                seg === "wrong" && "bg-[#930013]",
                seg === "current" && "bg-[#fecc17]/70",
                seg === "partial" && "bg-[#fecc17]/30",
                seg === "unseen" && "bg-[#353534]",
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
          {/* Quit — recessed, hard to miss-tap. Visible on mobile too. */}
          <button
            onClick={onForfeit}
            aria-label="Quit current game session"
            title="Quit current game session"
            className="md:mt-3 font-mono text-[9px] text-zinc-500 hover:text-[#ffb4ab] uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded px-1"
          >
            QUIT SESSION
          </button>
        </div>
      </div>
    </header>
  )
}
