import React from "react"
import DOMPurify from "isomorphic-dompurify"
import { cn } from "@/lib/utils"
import { type CheatSheetEntry } from "@/lib/game/cheat-sheet-context"


export interface CheatSheetEntryCardProps {
  entry: CheatSheetEntry
  statusStr: string
  formatLabel: (val: string) => string
  renderMath: (val: string) => string
}

export function CheatSheetEntryCard({ entry, statusStr, formatLabel, renderMath }: CheatSheetEntryCardProps) {
  return (
    <div
      className={cn(
        "bg-[#121212] border p-4 md:p-5 rounded shadow-sm space-y-4 transition-all",
        entry.gotWrong
          ? "border-red-500/20 bg-gradient-to-br from-[#121212] to-red-950/[0.02]"
          : "border-amber-500/20 bg-gradient-to-br from-[#121212] to-amber-950/[0.02]"
      )}
    >
      {/* Card Meta Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className={cn(
            "text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border uppercase leading-none",
            entry.gotWrong
              ? "bg-red-950/30 text-red-400 border-red-500/30"
              : "bg-amber-950/30 text-amber-400 border-amber-500/30"
          )}>
            {statusStr}
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-900 rounded text-zinc-400 uppercase leading-none">
            {entry.difficulty}
          </span>
        </div>
        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-none">
          {formatLabel(entry.category)}
        </span>
      </div>

      {/* Question Prompt */}
      <div className="space-y-1">
        <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
          Question:
        </span>
        <p
          className="font-sans text-sm font-semibold leading-relaxed text-[#e5e2e1] text-pretty"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(renderMath(entry.question))
          }}
        />
      </div>

      {/* Options List */}
      {entry.options && entry.options.length > 0 && (
        <div className="space-y-1.5">
          <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
            Options:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {entry.options.map((opt: any) => {
              const isCorrect = opt.label === entry.answer
              return (
                <div
                  key={opt.label}
                  className={cn(
                    "p-2 border rounded font-mono flex items-start gap-2",
                    isCorrect
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                      : "bg-zinc-900/40 border-zinc-800/80 text-zinc-500"
                  )}
                >
                  <span className="font-black shrink-0">{opt.label}:</span>
                  <span
                    className="font-sans shrink-0 max-w-[90%]"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(renderMath(opt.text))
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Explanation Block */}
      <div className="space-y-2 border-t border-zinc-800/80 pt-3">
        <span className="block font-mono text-[9px] text-[#4ae176] uppercase tracking-wider">
          Explanation:
        </span>
        <div className="border-l-2 border-[#4ae176]/40 bg-emerald-950/[0.04] p-3 rounded-r">
          <p
            className="font-sans text-xs leading-relaxed text-zinc-300 italic text-pretty"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(renderMath(entry.explanation))
            }}
          />
        </div>
      </div>
    </div>
  )
}
