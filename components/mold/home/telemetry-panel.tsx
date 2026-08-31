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
    <section className="bg-panel border border-border p-6 rounded space-y-5 select-none">
      <div className="flex justify-between items-center select-none">
        <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-foreground">
          PERFORMANCE STATS
        </h2>
        <span className="text-primary text-xs font-mono font-bold tracking-widest bg-secondary border border-border px-2 py-0.5 rounded">
          STATS
        </span>
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Accuracy telemetry bar with dynamic milestones */}
          <div className="space-y-2.5">
            <div className="flex justify-between font-mono text-[10px] text-muted-foreground uppercase">
              <span>ACCURACY RATE</span>
              <span className="text-emerald-400 font-bold tabular-nums">{roundedAccuracy}%</span>
            </div>
            
            <div className="h-3 bg-secondary/60 border border-border flex gap-0.5 p-0.5 rounded-sm overflow-hidden" aria-label={`Average accuracy is ${roundedAccuracy}%`}>
              {Array.from({ length: 10 }).map((_, i) => {
                const isFilled = i < Math.ceil(accuracyPct / 10)
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "h-full flex-1 transition-all duration-300", 
                      isFilled ? "bg-emerald-500" : "bg-secondary"
                    )} 
                  />
                )
              })}
            </div>

            {/* Dynamic Milestones under Accuracy Bar */}
            <div className="flex justify-between font-mono text-[8px] text-muted-foreground/60 px-0.5 pt-0.5 select-none relative">
              <span className={cn(
                "flex items-center gap-1 transition-colors duration-200", 
                accuracyPct >= 60 ? "text-primary font-bold" : "text-muted-foreground/60"
              )}>
                <span className={cn("w-1 h-1 rounded-full", accuracyPct >= 60 ? "bg-primary" : "bg-secondary")} />
                60% PASS
              </span>
              
              <span className={cn(
                "flex items-center gap-1 transition-colors duration-200", 
                accuracyPct >= 80 ? "text-primary font-bold" : "text-muted-foreground/60"
              )}>
                <span className={cn("w-1 h-1 rounded-full", accuracyPct >= 80 ? "bg-primary" : "bg-secondary")} />
                80% EXPERT
              </span>

              <span className={cn(
                "flex items-center gap-1 transition-colors duration-200", 
                accuracyPct >= 90 ? "text-emerald-400 font-bold" : "text-muted-foreground/60"
              )}>
                <span className={cn("w-1 h-1 rounded-full", accuracyPct >= 90 ? "bg-emerald-400" : "bg-secondary")} />
                90% MASTER
              </span>

              <span className={cn(
                "flex items-center gap-1 transition-colors duration-200", 
                accuracyPct >= 97 ? "text-primary font-bold" : "text-muted-foreground/60"
              )}>
                <span className={cn("w-1 h-1 rounded-full shrink-0", accuracyPct >= 97 ? "bg-primary animate-pulse" : "bg-secondary")} />
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
            
            <div className="h-3 bg-secondary border border-border flex gap-0.5 p-0.5 rounded-sm overflow-hidden" aria-label={`Average response time is ${averageResponseTimeMs} milliseconds`}>
              {Array.from({ length: 10 }).map((_, i) => {
                const isFilled = averageResponseTimeMs > 0 ? (i < speedSegments) : false
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "h-full flex-1 transition-all duration-300", 
                      isFilled ? "bg-primary" : "bg-secondary"
                    )} 
                  />
                )
              })}
            </div>

            {/* Custom speed calibration legend */}
            <div className="flex justify-between font-mono text-[8px] text-muted-foreground px-0.5 pt-0.5 select-none">
              <span>SLOWER (&gt;5s)</span>
              <span>AVERAGE (2.5s)</span>
              <span>FAST (&lt;1s)</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
