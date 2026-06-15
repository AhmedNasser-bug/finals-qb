import React from "react"

export function QuizHistoryHeader() {
  return (
    <div className="flex items-center gap-4 py-8 select-none">
      <div className="flex-1 h-px bg-zinc-800" />
      <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase font-bold">
        QUIZ HISTORY
      </span>
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  )
}
