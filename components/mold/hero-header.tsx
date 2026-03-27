"use client"

import type { SubjectData, Achievement } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface HeroHeaderProps {
  subject: SubjectData
  achievements: Achievement[]
  className?: string
}

export function HeroHeader({ subject, achievements, className }: HeroHeaderProps) {
  const unlocked = achievements.filter((a) => a.unlockedAt !== null).length
  const total = achievements.length

  return (
    <header className={cn("border-b border-border bg-panel", className)}>
      {/* Protocol status bar */}
      <div className="flex items-center gap-3 px-6 py-2 border-b border-border/50 bg-background/60">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          MASTERY PROTOCOL V2
        </span>
        <span className="text-border select-none">|</span>
        <span className="text-xs font-mono text-muted-foreground">SYS READY</span>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs font-mono text-muted-foreground">
            {subject.totalQuestions} QUESTIONS
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            {subject.categories.length} SECTORS
          </span>
        </div>
      </div>

      {/* Main hero */}
      <div className="px-6 py-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-mono tracking-widest text-primary uppercase">
            SUBJECT LOADED
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance leading-tight">
            {subject.name}
          </h1>
          <p className="text-sm text-muted-foreground text-pretty max-w-xl leading-relaxed">
            {subject.description}
          </p>
        </div>

        {/* Trophy counter */}
        <div className="flex items-center gap-3 mt-4 sm:mt-0 shrink-0">
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-xs font-mono text-muted-foreground tracking-wider">ACHIEVEMENTS</p>
            <p className="text-2xl font-mono font-bold text-primary">
              {unlocked}
              <span className="text-muted-foreground text-base font-normal">/{total}</span>
            </p>
          </div>
          <div
            className={cn(
              "w-12 h-12 rounded border flex items-center justify-center text-xl",
              unlocked === total
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-secondary text-muted-foreground"
            )}
            title={`${unlocked} of ${total} achievements unlocked`}
          >
            <TrophyIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
