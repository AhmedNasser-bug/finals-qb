"use client"

import React, { useEffect } from "react"
import { useCheatSheet } from "@/lib/game/cheat-sheet-context"
import { formatLabel, gradeColor, hasVisual } from "@/lib/mold-types"
import DOMPurify from "isomorphic-dompurify"
import { renderMath } from "@/lib/utils/math-renderer"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export function CheatSheetTerminal({ subjectId }: { subjectId: string }) {
  const { isOpen, setIsOpen, toggleCheatSheet, entries, clearEntries } = useCheatSheet()

  // Ctrl + ` (Backtick) global keyboard toggle (only when active in GameRunner)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "`" || e.key === "~")) {
        e.preventDefault()
        toggleCheatSheet()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleCheatSheet])

  // Reverse entries so the most recently flagged questions appear at the top
  const reversedEntries = [...entries].reverse()

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Side Panel Drawer */}
      <div
        onKeyDown={(e) => e.stopPropagation()} // Stop keyboard propagation to game card
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-full max-w-md md:max-w-2xl bg-card border-l border-border shadow-2xl flex flex-col transition-all duration-300 transform select-text",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none z-0" />

        {/* Panel Header */}
        <div className="relative z-10 bg-panel border-b border-border px-4 py-4 shrink-0 flex justify-between items-start font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-foreground font-bold font-mono">
                STUDY DECK // REVIEW PANEL
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-primary/10 text-primary border border-primary/20 rounded">
                {entries.length} ITEMS
              </span>
            </div>
            <p className="font-sans text-[11px] text-muted-foreground max-w-md leading-normal">
              Review full explanations for questions where you requested hints or provided incorrect responses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button
                onClick={clearEntries}
                aria-label="Clear Deck"
                className="text-muted-foreground hover:text-destructive font-mono text-[10px] uppercase border border-border hover:border-destructive/30 bg-secondary px-2.5 py-1 rounded transition-all cursor-pointer focus-ring"
              >
                Clear Deck
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close study deck review drawer"
              className="text-muted-foreground hover:text-foreground p-1 border border-border hover:border-primary/50 transition-colors cursor-pointer rounded"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Panel Body / Scrollable Cards */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {entries.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border/80 rounded p-6 text-center space-y-2">
              <span className="font-mono text-xl text-muted-foreground">0_ENTRIES</span>
              <div className="font-sans text-xs text-muted-foreground max-w-xs leading-relaxed">
                No mistakes or hint requests recorded yet. Questions you struggle with or use hints on will automatically accumulate in this deck for instant review.
              </div>
            </div>
          ) : (
            reversedEntries.map((entry) => {
              const statusStr = [
                entry.gotWrong ? "INCORRECT" : null,
                entry.hintUsed ? "HINTED" : null
              ].filter(Boolean).join(" & ")

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "bg-panel border border-border p-4 md:p-5 rounded shadow-sm space-y-4 transition-all",
                    entry.gotWrong 
                      ? "border-destructive/30" 
                      : "border-primary/30"
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
                        {entry.options.map((opt) => {
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
                          __html: DOMPurify.sanitize(renderMath(entry.explanation || ""))
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
