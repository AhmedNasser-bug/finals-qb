"use client"

import type { RunRecord, AggregateStats } from "@/lib/mold-types"
import { gradeBgColor, formatTime, formatDate, modeLabel } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface PerformanceTableProps {
  runs: RunRecord[]
  stats: AggregateStats
  className?: string
}

export function PerformanceTable({ runs, stats, className }: PerformanceTableProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <h2 className="text-xs font-mono tracking-widest text-cyan-400/80 uppercase">
        Operation Logs
      </h2>

      {/* Aggregate stats strip — matches screenshot layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded overflow-hidden border border-border">
        <StatCell label="Total Runs"  value={String(stats.totalRuns)}         />
        <StatCell label="Best Score"  value={`${stats.bestScore}%`}   accent  />
        <StatCell label="Best Streak" value={`×${stats.bestStreak}`}  accent  />
        <StatCell label="Avg. Score"  value={`${stats.averageScore}%`}        />
      </div>

      {/* Runs table or empty state */}
      {runs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 rounded border border-dashed border-border/60 text-muted-foreground">
          <p className="text-sm font-mono tracking-widest">NO RUNS RECORDED</p>
          <p className="text-xs text-muted-foreground/60">Complete your first session to begin tracking.</p>
        </div>
      ) : (
        <div className="rounded border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Recent runs">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left px-4 py-2.5 text-xs font-mono text-muted-foreground tracking-wider">DATE</th>
                  <th className="text-left px-4 py-2.5 text-xs font-mono text-muted-foreground tracking-wider">MODE</th>
                  <th className="text-right px-4 py-2.5 text-xs font-mono text-muted-foreground tracking-wider">SCORE</th>
                  <th className="text-right px-4 py-2.5 text-xs font-mono text-muted-foreground tracking-wider hidden sm:table-cell">ANSWERS</th>
                  <th className="text-right px-4 py-2.5 text-xs font-mono text-muted-foreground tracking-wider hidden sm:table-cell">TIME</th>
                  <th className="text-right px-4 py-2.5 text-xs font-mono text-muted-foreground tracking-wider hidden md:table-cell">STREAK</th>
                  <th className="text-center px-4 py-2.5 text-xs font-mono text-muted-foreground tracking-wider">GRADE</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run, i) => (
                  <RunRow key={run.id} run={run} isEven={i % 2 === 0} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

function StatCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 bg-panel">
      <span className="text-xs font-mono text-muted-foreground tracking-wider">{label}</span>
      <span className={cn(
        "text-xl font-mono font-bold",
        accent ? "text-primary" : "text-foreground"
      )}>
        {value}
      </span>
    </div>
  )
}

function RunRow({ run, isEven }: { run: RunRecord; isEven: boolean }) {
  return (
    <tr className={cn(
      "border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30",
      isEven ? "bg-panel" : "bg-background"
    )}>
      <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
        {formatDate(run.date)}
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium text-foreground">
          {modeLabel(run.mode)}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-foreground">
        {run.score}%
      </td>
      <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground hidden sm:table-cell">
        {run.correctAnswers}/{run.totalQuestions}
      </td>
      <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground hidden sm:table-cell">
        {formatTime(run.timeTaken)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground hidden md:table-cell">
        ×{run.streak}
      </td>
      <td className="px-4 py-3 text-center">
        <span className={cn(
          "inline-block px-2 py-0.5 text-xs font-mono font-bold rounded-sm border",
          gradeBgColor(run.grade)
        )}>
          {run.grade}
        </span>
      </td>
    </tr>
  )
}
