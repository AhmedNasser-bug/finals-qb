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
    <footer className="bg-panel border-t border-border px-4 h-24 flex items-center gap-4 shadow-sm">
      {/* Primary CTA and Hint row — full width */}
      <div className="flex-1 flex items-center gap-3 h-12">
        {config.hintsEnabled && (
          <button
            onClick={onHintRequest}
            disabled={!canHint}
            aria-label={buttonTitle}
            title={buttonTitle}
            className={cn(
              "h-full px-4 font-mono text-xs font-black tracking-[0.15em] uppercase transition-all btn-depress focus-ring rounded flex items-center justify-center gap-2 shrink-0 w-28 sm:w-36 transition-all duration-150 shadow-sm",
              canHint
                ? "border border-primary bg-primary/10 text-primary hover:bg-primary/20 border-glow"
                : initialLockRemaining > 0
                ? "border border-border bg-secondary text-muted-foreground cursor-not-allowed animate-pulse"
                : showHint
                ? "border border-primary bg-primary/25 text-primary border-glow animate-pulse"
                : "border border-border bg-secondary/50 text-muted-foreground/40 cursor-not-allowed"
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
              title={!canSubmit ? "Select an option first (1..4 or click)" : "Submit sequence (Enter or Space)"}
              className={cn(
                "w-full h-full font-mono text-sm font-black tracking-[0.2em] uppercase transition-all btn-depress focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded flex items-center justify-center gap-2 shadow-sm",
                canSubmit
                  ? "cta-gradient"
                  : "bg-secondary text-muted-foreground/50 border border-border cursor-not-allowed"
              )}
            >
              <span>SUBMIT_SEQUENCE</span>
              {canSubmit && (
                <span className="text-xs px-1.5 py-0.5 bg-black/30 border border-black/40 rounded font-mono font-bold select-none" aria-hidden="true">
                  ↵
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              aria-label={isLast ? "View results" : "Continue session"}
              title={isLast ? "View results (Enter or Space)" : "Continue session (Enter or Space)"}
              className="w-full h-full cta-gradient font-mono text-sm font-black tracking-[0.2em] uppercase btn-depress animate-slide-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isLast ? "VIEW_RESULTS" : "CONTINUE_SESSION"}</span>
              <span className="text-xs px-1.5 py-0.5 bg-black/30 border border-black/40 rounded font-mono font-bold select-none" aria-hidden="true">
                ↵
              </span>
            </button>
          )}
        </div>
      </div>

      {/* STATUS + SKIP + DESKTOP SHORTCUT HINT */}
      <div className="flex items-center gap-4 shrink-0">
        {!isRevealed && (
          <div className="hidden lg:flex flex-col items-end" aria-live="polite" aria-atomic="true">
            <span className="font-mono text-[8px] text-muted-foreground tracking-widest uppercase font-bold">SHORTCUTS</span>
            <span className="font-mono text-[10px] text-foreground font-bold uppercase">
              [1-4] SELECT • [H] HINT
            </span>
          </div>
        )}
        {!isRevealed && (
          <div className="hidden md:flex flex-col items-end" aria-live="polite" aria-atomic="true">
            <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase font-bold">STATUS</span>
            <span className="font-mono text-xs text-foreground font-bold uppercase">
              {canSubmit ? "READY_TO_SUBMIT" : "WAITING_FOR_INPUT"}
            </span>
          </div>
        )}
        {isRevealed && (
          <button
            onClick={nextQuestion}
            aria-label="Skip question"
            className="flex items-center gap-2 h-12 px-4 border border-border text-muted-foreground font-mono text-xs font-bold tracking-widest uppercase hover:text-primary hover:border-primary/40 bg-secondary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded shadow-sm"
          >
            <SkipIcon className="w-4 h-4" aria-hidden="true" />
            SKIP
          </button>
        )}
      </div>
    </footer>
  )
}
