"use client"

import type { GameModeId } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface ActionHubProps {
  onInitialize: () => void
  onEncyclopedia: () => void
  selectedMode: GameModeId
  disabled?: boolean
  className?: string
}

export function ActionHub({
  onInitialize,
  onEncyclopedia,
  selectedMode,
  disabled = false,
  className,
}: ActionHubProps) {
  const modeLabels: Record<GameModeId, string> = {
    speedrun:       "INITIALIZE SPEEDRUN",
    blitz:          "INITIALIZE BLITZ",
    hardcore:       "INITIALIZE HARDCORE",
    survival:       "INITIALIZE SURVIVAL",
    practice:       "BEGIN PRACTICE",
    flashcards:     "OPEN FLASHCARDS",
    "full-revision": "BEGIN FULL REVISION",
  }

  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      {/* Encyclopedia */}
      <button
        onClick={onEncyclopedia}
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2.5 rounded border text-sm font-mono",
          "border-border bg-panel text-foreground/80",
          "hover:border-border/80 hover:text-foreground hover:bg-secondary/60",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <BookIcon className="w-4 h-4 shrink-0" />
        ENCYCLOPEDIA
      </button>

      {/* Initialize / Launch */}
      <button
        onClick={onInitialize}
        disabled={disabled}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded border",
          "text-sm font-mono font-bold tracking-wide",
          "border-primary bg-primary text-primary-foreground",
          "hover:bg-primary/90 hover:border-primary/80",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <PlayIcon className="w-4 h-4 shrink-0" />
        {modeLabels[selectedMode]}
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

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
