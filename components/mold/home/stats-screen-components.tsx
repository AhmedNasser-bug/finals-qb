import { useState } from "react"
import { CheckCircle2, Trophy, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatLabel } from "@/lib/mold-types"
import type { CategoryStat, CramVerdict, Mission, Milestone } from "./stats-screen-types"

// --- COMPONENTS ---

export function CramReadinessPanel({ cramVerdict, cramScore, avgRetrievability }: { cramVerdict: CramVerdict, cramScore: number, avgRetrievability: number }) {
  return (
    <div className="border border-border bg-panel p-6 rounded-md relative overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
              DIAGNOSTIC TELEMETRY // 24-HOUR FORECAST
            </span>
            <span className={cn("font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border", cramVerdict.badgeColor)}>
              {cramVerdict.badge}
            </span>
          </div>
          <h2 className="text-lg font-display font-black text-foreground tracking-tight flex items-center gap-2">
            <span>EXAM CRAM READINESS:</span>
            <span className="text-primary font-mono text-xl tabular-nums">{cramScore}%</span>
          </h2>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            {cramVerdict.text}
          </p>
        </div>

        <div className="flex flex-col items-end shrink-0 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-6">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
            ESTIMATED DECAY
          </span>
          <span className="font-mono text-2xl font-black text-foreground tabular-nums mt-0.5">
            {avgRetrievability}%
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/80 mt-0.5">
            AVERAGE RETRIEVABILITY (DSR)
          </span>
        </div>
      </div>
    </div>
  )
}

export function CategoryRecallPanel({ categoryStats }: { categoryStats: CategoryStat[] }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-2 flex items-center justify-between">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
          02 // TOPIC RETENTION RANKING (SM-2 DSR)
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground uppercase">
          LOWEST FIRST
        </span>
      </div>

      {categoryStats.length === 0 ? (
        <div className="p-4 border border-dashed border-border/60 rounded text-center text-xs font-mono text-muted-foreground">
          No active subject telemetry recorded yet.
        </div>
      ) : (
        <div className="border border-border bg-panel rounded divide-y divide-border overflow-hidden shadow-sm">
          {categoryStats.map((item, idx) => {
            const isCritical = item.retrievabilityPct < 60
            const isDueSoon = item.retrievabilityPct >= 60 && item.retrievabilityPct < 85
            return (
              <div key={item.category} className="p-3.5 flex items-center justify-between gap-3 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[10px] text-muted-foreground/60 w-4 tabular-nums">
                    {idx + 1}.
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-foreground truncate">
                      {formatLabel(item.category)}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground">
                      {item.totalQuestions} questions in pool
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "font-mono text-[10px] font-bold px-2 py-0.5 rounded border",
                    isCritical
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : isDueSoon
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  )}>
                    {item.retrievabilityPct}% RETENTION
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function DailyMissionsPanel({ missions }: { missions: Mission[] }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-2">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
          02 // DAILY STUDY GOALS
        </h2>
      </div>

      <div className="border border-border bg-panel rounded p-6 divide-y divide-border shadow-sm">
        {missions.map((mission) => (
          <div key={mission.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
            <div className={cn(
              "w-5 h-5 rounded flex items-center justify-center shrink-0 border mt-0.5",
              mission.completed
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground"
            )}>
              {mission.completed && <CheckCircle2 className="w-4 h-4 fill-current text-primary shrink-0" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={cn(
                  "font-mono text-xs font-bold uppercase tracking-wider",
                  mission.completed ? "text-primary" : "text-foreground"
                )}>
                  {mission.title}
                </p>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {mission.current} / {mission.target}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{mission.description}</p>

              {/* Progress slider */}
              <div className="mt-2.5 w-full h-1 bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(mission.current / mission.target) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LongTermMilestonesPanel({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-2">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
          03 // LONG-TERM MILESTONES
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={cn(
              "p-4 border rounded bg-panel relative overflow-hidden transition-all duration-300 shadow-sm",
              milestone.completed
                ? "border-primary/40 shadow-[0_0_15px_rgba(254,204,23,0.05)]"
                : "border-border hover:border-primary/30"
            )}
          >
            {/* Subtle completed background check icon */}
            {milestone.completed && (
              <div className="absolute -bottom-2 -right-2 text-primary/5">
                <Trophy className="w-16 h-16" />
              </div>
            )}

            <div className="flex items-start justify-between gap-2 relative z-10">
              <div className="min-w-0">
                <p className={cn(
                  "font-mono text-xs font-bold uppercase tracking-widest",
                  milestone.completed ? "text-primary" : "text-foreground"
                )}>
                  {milestone.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{milestone.description}</p>
              </div>

              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold",
                milestone.completed
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-muted text-muted-foreground border border-border"
              )}>
                {milestone.completed ? "★" : `${Math.round((milestone.current / milestone.target) * 100)}%`}
              </div>
            </div>

            <div className="mt-4 w-full h-1 bg-muted rounded overflow-hidden relative z-10">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  milestone.completed ? "bg-primary" : "bg-muted-foreground/40"
                )}
                style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DataSettingsPanel({ handleReset, showConfirmReset, setShowConfirmReset }: { handleReset: () => void, showConfirmReset: boolean, setShowConfirmReset: (val: boolean) => void }) {
  return (
    <div className="space-y-4 pt-4">
      <div className="border-b border-border pb-2">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-destructive">
          04 // DATA SETTINGS
        </h2>
      </div>

      <div className="border border-destructive/20 bg-destructive/5 rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span>RESET ALL STUDY DATA</span>
          </p>
          <p className="text-[10px] text-muted-foreground max-w-md">
            This action deletes all your completed quizzes, study streaks, best streak records, and progress stats. This cannot be undone.
          </p>
        </div>

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            aria-label="Wipe all local telemetry and run data"
            className="bg-transparent hover:bg-destructive/10 text-destructive border border-destructive/30 px-4 py-2 rounded text-xs font-mono tracking-wider cursor-pointer transition-all shrink-0 uppercase font-bold"
          >
             RESET_DATA
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              aria-label="Confirm wipe all data"
              className="bg-destructive text-white hover:bg-red-600 px-3.5 py-2 rounded text-xs font-mono font-bold cursor-pointer transition-all uppercase"
            >
              CONFIRM
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              aria-label="Cancel wipe all data"
              className="bg-secondary hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded text-xs font-mono font-bold cursor-pointer transition-all uppercase"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
