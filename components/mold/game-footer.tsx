"use client"

import { useGameEngine } from "@/lib/game-engine"
import * as React from "react"
import { cn } from "@/lib/utils"
import { SkipIcon } from "./game-icons"

export function GameFooter({ onHintRequest }: { onHintRequest: () => void }) {
  const { state, revealAnswer, nextQuestion, useHint } = useGameEngine()
  const { isRevealed, selectedOption, config, currentIndex, questions } = state

  const isLast = currentIndex >= questions.length - 1
  const canSubmit = selectedOption !== null && !isRevealed
  const canHint = config.hintsEnabled && !isRevealed

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
          aria-label="Request hint"
          title={!canHint ? "Hint not available" : "Request hint"}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-4 w-16 shrink-0 btn-depress transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17] rounded-sm",
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
            aria-disabled={!canSubmit}
            title={!canSubmit ? "Select an option first" : undefined}
            className={cn(
              "w-full h-12 font-mono text-sm font-black tracking-[0.2em] uppercase transition-all btn-depress focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17] rounded-sm",
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
            className="w-full h-12 cta-gradient font-mono text-sm font-black tracking-[0.2em] uppercase btn-depress animate-slide-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17] rounded-sm"
          >
            {isLast ? "VIEW_RESULTS" : "CONTINUE_SESSION"}
          </button>
        )}
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
            className="flex items-center gap-2 h-12 px-4 border border-[#2a2a2a] text-zinc-500 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#fecc17] hover:border-[#fecc17]/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17] rounded-sm"
          >
            <SkipIcon className="w-4 h-4" aria-hidden="true" />
            SKIP
          </button>
        )}
      </div>
    </footer>
  )
}
