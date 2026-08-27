import { cn } from "@/lib/utils"

interface CramVerdict {
  title: string
  badge: string
  badgeColor: string
  text: string
}

interface CramReadinessProps {
  cramVerdict: CramVerdict
  cramScore: number
  avgRetrievability: number
}

export function CramReadiness({ cramVerdict, cramScore, avgRetrievability }: CramReadinessProps) {
  return (
    <div className="border border-border bg-gradient-to-r from-panel via-[#101115] to-panel p-6 rounded-md relative overflow-hidden">
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
