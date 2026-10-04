"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Clock } from "lucide-react"
import { useStats } from "@/lib/game/stats-context"

export function SessionStatsPanel() {
  const { dayStreak, stats } = useStats()
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCopy = useCallback(() => {
    const summaryText = [
      `MOLD V2 // HISTORICAL SESSION STATS`,
      `Total Sessions: ${stats.totalRuns}`,
      `Day Streak: ${dayStreak} DAYS`,
      `Avg Accuracy: ${stats.averageScore ? Math.round(stats.averageScore) : 0}%`,
    ].join("\n")

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopied(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})
    }
  }, [stats.totalRuns, stats.averageScore, dayStreak])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return
      }
      if ((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        handleCopy()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleCopy])

  return (
    <div className="bg-panel border border-border p-6 rounded space-y-4 select-none">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-foreground flex items-center gap-2">
          <span>HISTORICAL_SESSION_STATS</span>
          {copied && (
            <span role="status" aria-live="polite" className="text-primary animate-pulse">
              [COPIED]
            </span>
          )}
        </h2>
      </div>
      
      <div className="flex flex-col gap-3 font-mono text-[10px]" title="Press 'C' to copy stats to clipboard">
        <div className="flex justify-between border-b border-border/60 pb-2" title="Total number of quiz sessions completed">
          <span className="text-muted-foreground uppercase">TOTAL_SESSIONS</span>
          <span className="font-bold text-foreground tabular-nums">{stats.totalRuns}</span>
        </div>
        <div className="flex justify-between border-b border-border/60 pb-2" title="Current consecutive days studied">
          <span className="text-muted-foreground uppercase">DAY_STREAK</span>
          <span className="font-bold text-primary tabular-nums">{dayStreak} DAYS</span>
        </div>
        <div className="flex justify-between border-b border-border/60 pb-2" title="Average accuracy across all completed sessions">
          <span className="text-muted-foreground uppercase">AVG_ACCURACY</span>
          <span className="font-bold text-emerald-400 tabular-nums">
            {stats.averageScore ? `${Math.round(stats.averageScore)}%` : "—"}
          </span>
        </div>
      </div>
    </div>
  )
}
