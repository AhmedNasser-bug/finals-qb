"use client"

import React, { useEffect, useRef } from "react"
import { useCheatSheet } from "@/lib/game/cheat-sheet-context"
import { formatLabel, gradeColor, hasVisual } from "@/lib/mold-types"
import DOMPurify from "isomorphic-dompurify"
import { renderMath } from "@/lib/utils/math-renderer"
import { cn } from "@/lib/utils"

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

  const panelRef = useRef<HTMLDivElement>(null)

  // Trap focus inside side panel
  useEffect(() => {
    if (!isOpen) return

    const el = panelRef.current
    if (el) el.focus()

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !el) return

      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleTab)
    return () => document.removeEventListener("keydown", handleTab)
  }, [isOpen])

  // Reverse entries so the most recently flagged questions appear at the top
  const reversedEntries = [...entries].reverse()

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Side Panel Drawer */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheat-sheet-title"
        onKeyDown={(e) => e.stopPropagation()} // Stop keyboard propagation to game card
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-full max-w-md md:max-w-2xl bg-[#0d0d0d] border-l border-zinc-800 shadow-2xl flex flex-col transition-all duration-300 transform select-text outline-none",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="scanlines absolute inset-0 opacity-[0.03] pointer-events-none z-0" />

        {/* Panel Header */}
        <div className="relative z-10 bg-[#121212] border-b border-zinc-800/80 px-4 py-4 shrink-0 flex justify-between items-start font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span id="cheat-sheet-title" className="text-xs uppercase tracking-wider text-zinc-300 font-bold">
                STUDY DECK // REVIEW PANEL
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#fecc17]/10 text-[#fecc17] border border-[#fecc17]/20 rounded">
                {entries.length} ITEMS
              </span>
            </div>
            <p className="font-sans text-[11px] text-zinc-500 max-w-md leading-normal">
              Review full explanations for questions where you requested hints or provided incorrect responses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button
                onClick={clearEntries}
                aria-label="Clear Deck"
                className="text-zinc-400 hover:text-red-400 font-mono text-[10px] uppercase border border-zinc-800 hover:border-red-500/20 bg-zinc-950 px-2.5 py-1 rounded transition-all cursor-pointer"
              >
                Clear Deck
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close panel"
              className="text-zinc-400 hover:text-[#fecc17] font-mono text-[10px] uppercase border border-zinc-800 hover:border-[#fecc17]/20 bg-zinc-950 px-2 py-1 rounded transition-all cursor-pointer"
              title="Close panel (Ctrl + `)"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Panel Content (Scrollable Deck of Cards) */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {reversedEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="text-4xl">📚</div>
              <div className="space-y-1">
                <p className="font-sans font-bold text-sm text-zinc-300">Your review deck is currently empty</p>
                <p className="font-sans text-xs text-zinc-500 max-w-xs leading-normal">
                  Questions you answer incorrectly or request hints for during a session will appear here automatically.
                </p>
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
                          __html: DOMPurify.sanitize(renderMath(entry.explanation))
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
