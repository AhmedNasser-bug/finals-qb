"use client"

import { useGameEngine } from "@/lib/game-engine"
import * as React from "react"
import { cn } from "@/lib/utils"
import { SkipIcon } from "@/components/mold/game/game-icons"

interface GameFooterProps {
  onHintRequest: () => void
  initialLockRemaining: number
  hintTimeRemaining: number
  hintUsedThisQuestion: boolean
  showHint: boolean
}

export function GameFooter({
  onHintRequest,
  initialLockRemaining,
  hintTimeRemaining,
  hintUsedThisQuestion,
  showHint,
}: GameFooterProps) {
  const { state, revealAnswer, nextQuestion } = useGameEngine()
  const { isRevealed, selectedOption, config, currentIndex, questions } = state

  const isLast = currentIndex >= questions.length - 1
  const canSubmit = selectedOption !== null && !isRevealed
  const canHint = config.hintsEnabled && !isRevealed && initialLockRemaining === 0 && !hintUsedThisQuestion && !showHint

  // ── Socratic Timer Symbols and Labels ──────────────────────────────────────
  let blockSymbol = "?"
  let subLabel = "HINT"
  let buttonTitle = "Request hint"

  if (initialLockRemaining > 0) {
    blockSymbol = `${initialLockRemaining}s`
    subLabel = "LOCK"
    buttonTitle = `Hint locked for ${initialLockRemaining} seconds`
  } else if (showHint) {
    blockSymbol = `${hintTimeRemaining}s`
    subLabel = "SHOW"
    buttonTitle = `Hint active: ${hintTimeRemaining} seconds remaining`
  } else if (hintUsedThisQuestion) {
    blockSymbol = "Ø"
    subLabel = "USED"
    buttonTitle = "Hint already used for this question"
  }

  return (
    <footer className="bg-[#1a1d21] border-t border-[var(--tw-hex-fecc17)]/10 px-4 h-24 flex items-center gap-4">
      {/* Primary CTA and Hint row — full width */}
      <div className="flex-1 flex items-center gap-3 h-12">
        {config.hintsEnabled && (
          <button
            onClick={onHintRequest}
            disabled={!canHint}
            aria-label={buttonTitle}
            title={buttonTitle}
            className={cn(
              "h-full px-4 font-mono text-xs font-black tracking-[0.15em] uppercase transition-all btn-depress focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1d21] rounded flex items-center justify-center gap-2 shrink-0 w-28 sm:w-36 transition-all duration-150",
              canHint
                ? "border-[#fecc17] bg-[var(--tw-hex-fecc17)]/10 text-[#fecc17] hover:bg-[var(--tw-hex-fecc17)]/20 border-glow"
                : initialLockRemaining > 0
                ? "border-zinc-800 bg-zinc-900/60 text-zinc-500 cursor-not-allowed animate-pulse"
                : showHint
                ? "border-[#fecc17] bg-[var(--tw-hex-fecc17)]/25 text-[#fecc17] border-glow animate-pulse"
                : "border-[#2a2a2a] bg-[#1c1b1b] text-zinc-700 cursor-not-allowed"
            )}
          >
            <span className="font-mono text-sm leading-none">{blockSymbol}</span>
            <span className="leading-none">{subLabel}</span>
          </button>
        )}

        <div className="flex-1 h-full">
          {!isRevealed ? (
            <button
              onClick={revealAnswer}
              disabled={!canSubmit}
              aria-label="Submit sequence"
              title={!canSubmit ? "Select an option first" : "Submit sequence"}
              className={cn(
                "w-full h-full font-mono text-sm font-black tracking-[0.2em] uppercase transition-all btn-depress focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1d21] rounded",
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
              aria-label={isLast ? "View results" : "Continue session"}
              title={isLast ? "View results" : "Continue session"}
              className="w-full h-full cta-gradient font-mono text-sm font-black tracking-[0.2em] uppercase btn-depress animate-slide-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1d21] rounded"
            >
              {isLast ? "VIEW_RESULTS" : "CONTINUE_SESSION"}
            </button>
          )}
        </div>
      </div>

      {/* STATUS + SKIP */}
      <div className="flex items-center gap-4 shrink-0">
        {!isRevealed && (
          <div className="hidden md:flex flex-col items-end" aria-live="polite" aria-atomic="true">
            <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">STATUS</span>
            <span className="font-mono text-xs text-zinc-500 font-bold uppercase">
              {canSubmit ? "READY_TO_SUBMIT" : "WAITING_FOR_INPUT"}
            </span>
          </div>
        )}
        {isRevealed && (
          <button
            onClick={nextQuestion}
            aria-label="Skip question"
            title="Skip this question"
            className="flex items-center gap-2 h-12 px-4 border border-[#2a2a2a] text-zinc-500 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#fecc17] hover:border-[var(--tw-hex-fecc17)]/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <SkipIcon className="w-4 h-4" aria-hidden="true" />
            SKIP
          </button>
        )}
      </div>
    </footer>
  )
}
