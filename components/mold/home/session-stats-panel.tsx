"use client"

import React from "react"
import { Clock, Activity, Target, Zap } from "lucide-react"
import { useStats } from "@/lib/game/stats-context"

export function SessionStatsPanel() {
  const { dayStreak, stats } = useStats()

  return (
    <div className="bg-panel border border-border p-6 rounded space-y-4 select-none">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-foreground">
          HISTORICAL_SESSION_STATS
        </h2>
      </div>
      
      <div className="flex flex-col gap-3 font-mono text-[10px]">
        <div className="flex justify-between border-b border-border/60 pb-2">
          <span className="text-muted-foreground uppercase flex items-center gap-1.5"><Activity className="w-3 h-3" aria-hidden="true" /> TOTAL_SESSIONS</span>
          <span className="font-bold text-foreground tabular-nums">{stats.totalRuns}</span>
        </div>
        <div className="flex justify-between border-b border-border/60 pb-2">
          <span className="text-muted-foreground uppercase flex items-center gap-1.5"><Zap className="w-3 h-3" aria-hidden="true" /> DAY_STREAK</span>
          <span className="font-bold text-primary tabular-nums">{dayStreak} DAYS</span>
        </div>
        <div className="flex justify-between border-b border-border/60 pb-2">
          <span className="text-muted-foreground uppercase flex items-center gap-1.5"><Target className="w-3 h-3" aria-hidden="true" /> AVG_ACCURACY</span>
          <span className="font-bold text-emerald-400 tabular-nums">
            {stats.averageScore ? `${Math.round(stats.averageScore)}%` : "—"}
          </span>
        </div>
      </div>
    </div>
  )
}
