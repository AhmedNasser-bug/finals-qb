import * as React from "react"
import { cn } from "@/lib/utils"

export function StatCell({
  label, value, accent, className,
}: {
  label: string; value: string; accent?: boolean; className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1 p-3 bg-panel border border-border/40 rounded", className)}>
      <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">{label}</span>
      <span className={cn(
        "font-mono text-xl font-black tabular-nums",
        accent ? "text-primary" : "text-foreground"
      )}>
        {value}
      </span>
    </div>
  )
}
