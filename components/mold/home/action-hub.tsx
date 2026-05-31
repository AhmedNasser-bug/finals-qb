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
    speedrun:       "LAUNCH SPEEDRUN PROTOCOL",
    blitz:          "LAUNCH BLITZ INITIATIVE",
    hardcore:       "LAUNCH HARDCORE TRIAL",
    survival:       "LAUNCH SURVIVAL SECTOR",
    practice:       "LAUNCH PRACTICE DRILL",
    flashcards:     "LAUNCH FLASHCARD DRILL",
    "full-revision": "LAUNCH FULL REVISION",
  }

  const modeDescriptions: Record<GameModeId, string> = {
    speedrun:       "Complete all questions under strict countdown limits.",
    blitz:          "Quick, daily rapid-fire question subsets.",
    hardcore:       "Ultra-high difficulty parameters. Mastery level only.",
    survival:       "Progressively narrowing countdowns per question.",
    practice:       "Untimed category drilling with unlimited hints.",
    flashcards:     "Direct recall training and term memorization.",
    "full-revision": "Structured sequential exam emulation protocol.",
  }

  return (
    <div className={cn("w-full flex flex-col gap-2.5", className)}>
      <button
        onClick={onInitialize}
        disabled={disabled}
        title={disabled ? "Action not available" : undefined}
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
          INITIALIZE_SESSION →
        </span>
      </button>
    </div>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}
