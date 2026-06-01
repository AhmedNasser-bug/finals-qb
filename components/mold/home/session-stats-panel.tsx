"use client"

import React from "react"
import { Clock } from "lucide-react"
import { useStats } from "@/lib/game/stats-context"

export function SessionStatsPanel() {
  const { dayStreak, stats } = useStats()

  return (
    <div className="bg-[#101115] border border-border p-6 rounded-md space-y-4 select-none">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/80">
          HISTORICAL_SESSION_STATS
        </h2>
      </div>
      
      <div className="flex flex-col gap-3 font-mono text-[10px]">
        <div className="flex justify-between border-b border-zinc-800/80 pb-2">
          <span className="text-muted-foreground uppercase">TOTAL_SESSIONS</span>
          <span className="font-bold text-white">{stats.totalRuns}</span>
        </div>
        <div className="flex justify-between border-b border-zinc-800/80 pb-2">
          <span className="text-muted-foreground uppercase">DAY_STREAK</span>
          <span className="font-bold text-[#fecc17]">{dayStreak} DAYS</span>
        </div>
        <div className="flex justify-between border-b border-zinc-800/80 pb-2">
          <span className="text-muted-foreground uppercase">AVG_ACCURACY</span>
          <span className="font-bold text-[#4ae176]">
            {stats.averageScore ? `${Math.round(stats.averageScore)}%` : "—"}
          </span>
        </div>
      </div>
    </div>
  )
}
