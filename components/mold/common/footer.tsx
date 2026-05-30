"use client"

import { cn } from "@/lib/utils"

interface FooterProps {
  rightText?: string
  className?: string
}

export function Footer({ rightText = "OFFLINE FIRST", className }: FooterProps) {
  return (
    <footer role="contentinfo" className={cn("border-t border-border px-6 py-3 flex items-center justify-between bg-panel", className)}>
      <span className="text-xs font-mono text-muted-foreground">MOLD V2 — MASTERY PROTOCOL</span>
      <span className="text-xs font-mono text-muted-foreground">{rightText}</span>
    </footer>
  )
}
