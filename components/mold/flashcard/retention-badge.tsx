import React from "react"
import { CardRetentionState } from "@/lib/telemetry/telemetry-types"

interface RetentionBadgeProps {
  urgency: CardRetentionState["urgencyLevel"]
  retrievability?: number
  className?: string
}

export function RetentionBadge({
  urgency,
  retrievability,
  className = "",
}: RetentionBadgeProps) {
  let badgeStyles = "border-border text-muted-foreground bg-panel"
  let label = "NEW"

  switch (urgency) {
    case "MASTERED":
      badgeStyles = "border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
      label = retrievability !== undefined ? `${Math.round(retrievability * 100)}% RETENTION` : "MASTERED"
      break
    case "APPROACHING_DECAY":
      badgeStyles = "border-amber-500/40 text-amber-400 bg-amber-950/20"
      label = retrievability !== undefined ? `${Math.round(retrievability * 100)}% DECAYING` : "EXPIRING SOON"
      break
    case "DUE":
      badgeStyles = "border-orange-500/40 text-orange-400 bg-orange-950/20"
      label = "REVIEW DUE"
      break
    case "CRITICAL_LAPSED":
      badgeStyles = "border-destructive/40 text-destructive bg-destructive/10"
      label = "CRITICAL / LAPSED"
      break
    case "NEW":
    default:
      badgeStyles = "border-border/60 text-muted-foreground bg-panel"
      label = "NEW ITEM"
      break
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${badgeStyles} ${className}`}
    >
      {label}
    </span>
  )
}
