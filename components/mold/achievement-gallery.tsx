"use client"

import { useAchievements } from "@/lib/achievement-engine"
import type { Achievement } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

export function AchievementGallery({ onClose }: { onClose: () => void }) {
  const { achievements, reset } = useAchievements()
  const unlocked = achievements.filter((a) => a.unlockedAt !== null)
  const locked = achievements.filter((a) => a.unlockedAt === null)

  return (
    <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-panel border border-border rounded flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-mono font-bold text-foreground tracking-wider uppercase">
              Achievement Log
            </h2>
            <p className="text-xs font-mono text-muted-foreground">
              {unlocked.length} / {achievements.length} unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Close achievement gallery"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${achievements.length > 0 ? (unlocked.length / achievements.length) * 100 : 0}%` }}
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {unlocked.length > 0 && (
            <Section label="Unlocked" count={unlocked.length}>
              {unlocked.map((a) => (
                <AchievementRow key={a.id} achievement={a} />
              ))}
            </Section>
          )}
          {locked.length > 0 && (
            <Section label="Locked" count={locked.length}>
              {locked.map((a) => (
                <AchievementRow key={a.id} achievement={a} locked />
              ))}
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex justify-end">
          <button
            onClick={reset}
            className="text-xs font-mono text-muted-foreground hover:text-destructive transition-colors"
          >
            RESET ALL
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({
  label,
  count,
  children,
}: {
  label: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
        {label} ({count})
      </p>
      {children}
    </div>
  )
}

function AchievementRow({
  achievement,
  locked = false,
}: {
  achievement: Achievement
  locked?: boolean
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded border transition-colors",
      locked
        ? "border-border bg-secondary/30 opacity-50"
        : "border-primary/20 bg-primary/5"
    )}>
      <div className={cn(
        "shrink-0 w-8 h-8 rounded border flex items-center justify-center",
        locked ? "border-border bg-secondary" : "border-primary/30 bg-primary/10"
      )}>
        {locked
          ? <LockIcon className="w-4 h-4 text-muted-foreground" />
          : <TrophyIcon className="w-4 h-4 text-primary" />
        }
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className={cn(
          "text-sm font-semibold truncate",
          locked ? "text-muted-foreground" : "text-foreground"
        )}>
          {achievement.title}
        </p>
        <p className="text-xs text-muted-foreground leading-snug line-clamp-1">
          {achievement.description}
        </p>
      </div>
      {!locked && achievement.unlockedAt && (
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
          {new Date(achievement.unlockedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      )}
    </div>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
