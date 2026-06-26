"use client"

import type { GameModeId } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface ActionHubProps {
  onInitialize: () => void
  selectedMode: GameModeId
  disabled?: boolean
  className?: string
}

export function ActionHub({
  onInitialize,
  selectedMode,
  disabled = false,
  className,
}: ActionHubProps) {
  const modeLabels: Record<GameModeId, string> = {
    speedrun:       "START SPEEDRUN QUIZ",
    blitz:          "START BLITZ QUIZ",
    hardcore:       "START HARDCORE QUIZ",
    survival:       "START SURVIVAL QUIZ",
    practice:       "START PRACTICE QUIZ",
    flashcards:     "START FLASHCARDS",
    "full-revision": "START FULL REVIEW",
  }

  const modeDescriptions: Record<GameModeId, string> = {
    speedrun:       "Answer questions against a ticking clock to test your speed.",
    blitz:          "Quick, rapid-fire daily review with random questions.",
    hardcore:       "High-difficulty questions only to test your skills.",
    survival:       "Outlast the shrinking timer that gets faster every few questions.",
    practice:       "Relaxed and untimed study. Select a topic to focus on.",
    flashcards:     "Flip cards to memorize key definitions and terms.",
    "full-revision": "Go through all questions in their original order, like a real exam.",
  }

  return (
    <div className={cn("w-full flex flex-col gap-2.5", className)}>
      <button
        onClick={onInitialize}
        disabled={disabled}
        aria-disabled={disabled}
        title={disabled ? "Action not available" : `Launch ${selectedMode} session`}
        aria-label={disabled ? "Action not available" : `Launch ${selectedMode} session`}
        className={cn(
          "relative w-full flex flex-col sm:flex-row items-center justify-between p-5 rounded border transition-all duration-200 focus-ring group min-h-[72px] text-left",
          disabled
            ? "border-border bg-panel/40 opacity-40 cursor-not-allowed"
            : "border-primary/80 bg-primary/10 text-foreground hover:bg-primary hover:text-background active:translate-y-0.5"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Play/Launch Icon */}
          <div className={cn(
            "w-10 h-10 rounded border flex items-center justify-center shrink-0 transition-colors",
            disabled ? "border-border text-zinc-500" : "border-primary/30 bg-primary/15 text-primary group-hover:border-background/30 group-hover:bg-background/15 group-hover:text-background"
          )}>
            <PlayIcon className="w-4 h-4 fill-current" />
          </div>

          <div className="flex flex-col">
            <span className="font-display text-base font-black tracking-tight uppercase leading-tight">
              {modeLabels[selectedMode]}
            </span>
            <span className={cn(
              "text-xs font-sans mt-0.5 leading-snug",
              disabled ? "text-zinc-500" : "text-zinc-400 group-hover:text-background/85"
            )}>
              {modeDescriptions[selectedMode]}
            </span>
          </div>
        </div>

        {/* Action cue label */}
        <span className={cn(
          "hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-widest uppercase border px-3 py-1 rounded shrink-0 transition-all",
          disabled
            ? "border-border text-zinc-500"
            : "border-primary/20 text-primary group-hover:border-background/30 group-hover:text-background"
        )}>
          START QUIZ →
        </span>
      </button>
    </div>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}
