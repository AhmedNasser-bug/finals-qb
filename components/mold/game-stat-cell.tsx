import * as React from "react"
import { cn } from "@/lib/utils"

export function StatCell({
  label, value, accent, className,
}: {
  label: string; value: string; accent?: boolean; className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1 p-3 bg-[#201f1f]", className)}>
      <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">{label}</span>
      <span className={cn(
        "font-mono text-xl font-black",
        accent ? "text-[#fecc17]" : "text-[#e5e2e1]"
      )}>
        {value}
      </span>
    </div>
  )
}
