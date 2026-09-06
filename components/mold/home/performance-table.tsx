"use client"

import { useState, useMemo } from "react"
import type { RunRecord, AggregateStats, GameModeId } from "@/lib/mold-types"
import { gradeBgColor, formatTime, formatDate, modeLabel, GAME_MODES } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface PerformanceTableProps {
  runs: RunRecord[]
  stats: AggregateStats
  className?: string
}

export function PerformanceTable({ runs, stats, className }: PerformanceTableProps) {
  const [selectedFilterMode, setSelectedFilterMode] = useState<GameModeId | "all">("all")
  const [showAllRuns, setShowAllRuns] = useState(false)

  // Filter runs by mode if selected
  const filteredRuns = useMemo(() => {
    if (selectedFilterMode === "all") return runs
    return runs.filter((r) => r.mode === selectedFilterMode)
  }, [runs, selectedFilterMode])

  // Slice by density (5 vs All)
  const displayedRuns = useMemo(() => {
    if (showAllRuns) return filteredRuns
    return filteredRuns.slice(0, 5)
  }, [filteredRuns, showAllRuns])

  // Pre-compute mode counts to avoid O(M*N) rendering complexity
  const modeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of runs) {
      counts[r.mode] = (counts[r.mode] || 0) + 1
    }
    return counts
  }, [runs])

  return (
    <section className={cn("flex flex-col gap-4", className)} aria-label="Performance Telemetry">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xs font-mono tracking-widest text-cyan-400/80 uppercase font-bold">
          Quiz History
        </h2>
        {/* Mode Filter Pills */}
        {runs.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter runs by game mode">
            <button
              onClick={() => setSelectedFilterMode("all")}
              aria-pressed={selectedFilterMode === "all"}
              title="Show all quiz runs"
              className={cn(
                "px-2 py-0.5 text-[10px] font-mono rounded border transition-colors focus-ring",
                selectedFilterMode === "all"
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border text-muted-foreground hover:text-foreground bg-panel"
              )}
            >
              ALL ({runs.length})
            </button>
            {GAME_MODES.map((m) => {
              const count = modeCounts[m.id] || 0
              if (count === 0) return null
              const isSelected = selectedFilterMode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedFilterMode(m.id)}
                  aria-pressed={isSelected}
                  title={`Filter history to ${m.label} (${count} runs)`}
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-mono rounded border transition-colors focus-ring uppercase",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border text-muted-foreground hover:text-foreground bg-panel"
                  )}
                >
                  {m.id} ({count})
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Aggregate stats strip — matches screenshot layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded overflow-hidden border border-border">
        <StatCell label="Quizzes Taken"  value={String(stats.totalRuns)}         />
        <StatCell label="Best Score"  value={`${stats.bestScore}%`}   accent  />
        <StatCell label="Best Streak" value={`×${stats.bestStreak}`}  accent  />
        <StatCell label="Avg. Score"  value={`${stats.averageScore}%`}        />
      </div>

      {/* Runs table or empty state */}
      {runs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 rounded border border-dashed border-border/60 text-muted-foreground" role="status" aria-live="polite">
          <p className="text-sm font-mono tracking-widest">NO QUIZZES RECORDED</p>
          <p className="text-xs text-muted-foreground/60">Complete your first session to begin tracking.</p>
        </div>
      ) : filteredRuns.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 rounded border border-dashed border-border/60 text-muted-foreground" role="status" aria-live="polite">
          <p className="text-xs font-mono tracking-widest">NO RUNS FOR SELECTED FILTER</p>
          <button
            onClick={() => setSelectedFilterMode("all")}
            className="text-xs font-mono text-primary hover:underline"
          >
            Clear mode filter
          </button>
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
                {displayedRuns.map((run, i) => (
                  <RunRow key={run.id} run={run} isEven={i % 2 === 0} />
                ))}
              </tbody>
            </table>
          </div>
          {filteredRuns.length > 5 && (
            <div className="p-2 border-t border-border bg-secondary/20 flex justify-center">
              <button
                onClick={() => setShowAllRuns(!showAllRuns)}
                className="text-xs font-mono text-primary hover:underline focus-ring px-2 py-1 rounded"
              >
                {showAllRuns ? `SHOW RECENT (5)` : `VIEW ALL (${filteredRuns.length} RUNS)`}
              </button>
            </div>
          )}
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
