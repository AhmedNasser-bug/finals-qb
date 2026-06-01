"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { useStats } from "@/lib/game/stats-context"

export function TelemetryPanel() {
  const { stats } = useStats()
  const accuracyPct = stats.averageScore || 0
  const averageResponseTimeMs = stats.averageResponseTimeMs || 0
  
  const roundedAccuracy = Math.round(accuracyPct)

  // 10 segments filled if under 1000ms. 1 segment if over 5000ms. Linear interpolation.
  const speedSegments = useMemo(() => {
    if (averageResponseTimeMs === 0) return 0
    if (averageResponseTimeMs <= 1000) return 10
    if (averageResponseTimeMs >= 5000) return 1
    return Math.max(1, Math.min(10, Math.round(10 - ((averageResponseTimeMs - 1000) / 444))))
  }, [averageResponseTimeMs])

  return (
    <section className="bg-[#101115] border border-border p-6 rounded-md space-y-5 select-none">
      <div className="flex justify-between items-center select-none">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/80">
          PERFORMANCE_TELEMETRY
        </h2>
        <span className="text-primary text-xs font-mono font-bold tracking-widest bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
          SYS_FEED
        </span>
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Accuracy telemetry bar with dynamic milestones */}
          <div className="space-y-2.5">
            <div className="flex justify-between font-mono text-[10px] text-muted-foreground uppercase">
              <span>ACCURACY RATE</span>
              <span className="text-[#4ae176] font-bold">{roundedAccuracy}%</span>
            </div>
            
            <div className="h-3 bg-zinc-900 border border-zinc-800 flex gap-0.5 p-0.5 rounded-sm overflow-hidden" aria-label={`Average accuracy is ${roundedAccuracy}%`}>
              {Array.from({ length: 10 }).map((_, i) => {
                const isFilled = i < Math.ceil(accuracyPct / 10)
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "h-full flex-1 transition-all duration-300", 
                      isFilled ? "bg-[#4ae176]" : "bg-zinc-800"
                    )} 
                  />
                )
              })}
            </div>

            {/* Dynamic Milestones under Accuracy Bar */}
            <div className="flex justify-between font-mono text-[8px] text-zinc-600 px-0.5 pt-0.5 select-none relative">
              <span className={cn(
                "flex items-center gap-1 transition-colors duration-200", 
                accuracyPct >= 60 ? "text-[#fecc17] font-bold" : "text-zinc-600"
              )}>
                <span className={cn("w-1 h-1 rounded-full", accuracyPct >= 60 ? "bg-[#fecc17]" : "bg-zinc-800")} />
                60% PASS
              </span>
              
              <span className={cn(
                "flex items-center gap-1 transition-colors duration-200", 
                accuracyPct >= 80 ? "text-[#fecc17] font-bold" : "text-zinc-600"
              )}>
                <span className={cn("w-1 h-1 rounded-full", accuracyPct >= 80 ? "bg-[#fecc17]" : "bg-zinc-800")} />
                80% EXPERT
              </span>

              <span className={cn(
                "flex items-center gap-1 transition-colors duration-200", 
                accuracyPct >= 90 ? "text-[#4ae176] font-bold" : "text-zinc-600"
              )}>
                <span className={cn("w-1 h-1 rounded-full", accuracyPct >= 90 ? "bg-[#4ae176]" : "bg-zinc-800")} />
                90% MASTER
              </span>

              <span className={cn(
                "flex items-center gap-1 transition-colors duration-200", 
                accuracyPct >= 97 ? "text-primary font-bold" : "text-zinc-600"
              )}>
                <span className={cn("w-1 h-1 rounded-full shrink-0", accuracyPct >= 97 ? "bg-primary animate-pulse" : "bg-zinc-800")} />
                97% S+
              </span>
            </div>
          </div>

          {/* Average response time speed telemetry bar */}
          <div className="space-y-2.5">
            <div className="flex justify-between font-mono text-[10px] text-muted-foreground uppercase">
              <span>AVG RESPONSE TIME</span>
              <span className="text-primary font-bold">
                {averageResponseTimeMs > 0 ? `${averageResponseTimeMs.toLocaleString()} MS` : "—"}
              </span>
            </div>
            
            <div className="h-3 bg-zinc-900 border border-zinc-800 flex gap-0.5 p-0.5 rounded-sm overflow-hidden" aria-label={`Average response time is ${averageResponseTimeMs} milliseconds`}>
              {Array.from({ length: 10 }).map((_, i) => {
                const isFilled = averageResponseTimeMs > 0 ? (i < speedSegments) : false
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "h-full flex-1 transition-all duration-300", 
                      isFilled ? "bg-primary" : "bg-zinc-800"
                    )} 
                  />
                )
              })}
            </div>

            {/* Custom speed calibration legend */}
            <div className="flex justify-between font-mono text-[8px] text-zinc-600 px-0.5 pt-0.5 select-none">
              <span>SLOWER (&gt;5s)</span>
              <span>NOMINAL (2.5s)</span>
              <span>RAPID (&lt;1s)</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
