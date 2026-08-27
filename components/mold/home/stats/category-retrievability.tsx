import { cn } from "@/lib/utils"
import { formatLabel } from "@/lib/mold-types"

interface CategoryStat {
  category: string
  retrievabilityPct: number
  totalQuestions: number
}

interface CategoryRetrievabilityProps {
  categoryStats: CategoryStat[]
}

export function CategoryRetrievability({ categoryStats }: CategoryRetrievabilityProps) {
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
        <div className="border border-border bg-[#101115] rounded divide-y divide-zinc-800/60 overflow-hidden">
          {categoryStats.map((item, idx) => {
            const isCritical = item.retrievabilityPct < 60
            const isDueSoon = item.retrievabilityPct >= 60 && item.retrievabilityPct < 85
            return (
              <div key={item.category} className="p-3.5 flex items-center justify-between gap-3 hover:bg-secondary/20 transition-colors">
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
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : isDueSoon
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
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
