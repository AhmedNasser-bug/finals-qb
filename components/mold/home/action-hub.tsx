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

  const modeTags: Record<GameModeId, string> = {
    speedrun:       "TIMED // 5 MIN",
    blitz:          "RAPID // 2 MIN",
    hardcore:       "HIGH DIFFICULTY",
    survival:       "PROGRESSIVE PACE",
    practice:       "UNTIMED STUDY",
    flashcards:     "TERMINOLOGY",
    "full-revision": "100% COVERAGE",
  }

  return (
    <div className={cn("w-full flex flex-col gap-2.5", className)}>
      <button
        onClick={onInitialize}
        disabled={disabled}
        aria-disabled={disabled}
        title={disabled ? "Action not available" : `Launch ${selectedMode} session (Press Enter)`}
        aria-label={disabled ? "Action not available" : `Launch ${selectedMode} session`}
        className={cn(
          "relative w-full flex flex-col sm:flex-row items-center justify-between p-5 rounded border transition-all duration-200 focus-ring group min-h-[72px] text-left active:scale-[0.99] active:translate-y-0.5",
          disabled
            ? "border-border bg-panel/40 opacity-40 cursor-not-allowed"
            : "border-primary/80 bg-primary/10 text-foreground hover:bg-primary hover:text-background"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Play/Launch Icon */}
          <div className={cn(
            "w-10 h-10 rounded border flex items-center justify-center shrink-0 transition-all duration-300",
            disabled ? "border-border text-muted-foreground" : "border-primary/30 bg-primary/15 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.2)] group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] group-hover:border-background/30 group-hover:bg-background/15 group-hover:text-background"
          )}>
            <PlayIcon className="w-4 h-4 fill-current" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-base font-black tracking-tight uppercase leading-tight">
                {modeLabels[selectedMode]}
              </span>
              <span className={cn(
                "font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wider uppercase",
                disabled
                  ? "border-border text-muted-foreground/50"
                  : "border-primary/30 bg-primary/10 text-primary group-hover:border-background/40 group-hover:bg-background/20 group-hover:text-background"
              )}>
                {modeTags[selectedMode]}
              </span>
            </div>
            <span className={cn(
              "text-xs font-sans leading-snug",
              disabled ? "text-muted-foreground/60" : "text-muted-foreground group-hover:text-background/85"
            )}>
              {modeDescriptions[selectedMode]}
            </span>
          </div>
        </div>

        {/* Action cue + keyboard shortcut badge */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <kbd className={cn(
            "font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border tracking-widest transition-colors",
            disabled
              ? "border-border text-muted-foreground/40 bg-panel/30"
              : "border-border/80 bg-panel text-muted-foreground group-hover:border-background/40 group-hover:bg-background/20 group-hover:text-background"
          )}>
            ↵ ENTER
          </kbd>
          <span className={cn(
            "inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-widest uppercase border px-3 py-1 rounded transition-all",
            disabled
              ? "border-border text-muted-foreground/40"
              : "border-primary/20 text-primary group-hover:border-background/30 group-hover:text-background"
          )}>
            START QUIZ →
          </span>
        </div>
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
