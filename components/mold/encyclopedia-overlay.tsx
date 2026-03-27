"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { formatLabel } from "@/lib/mold-types"
import type { FullSubjectData } from "@/lib/mold-types"

interface EncyclopediaOverlayProps {
  subject: FullSubjectData
  onClose: () => void
}

export function EncyclopediaOverlay({ subject, onClose }: EncyclopediaOverlayProps) {
  const { terminology } = subject
  const categories = Object.keys(terminology ?? {})
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] ?? "")
  const [search, setSearch] = useState("")
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Trap focus inside overlay
  useEffect(() => {
    overlayRef.current?.focus()
  }, [])

  const entries = terminology?.[activeCategory] ?? []
  const filtered = search.trim()
    ? entries.filter(
        (e) =>
          e.term.toLowerCase().includes(search.toLowerCase()) ||
          e.definition.toLowerCase().includes(search.toLowerCase())
      )
    : entries

  if (categories.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-label="Encyclopedia"
      >
        <div
          className="bg-panel border border-border rounded p-8 max-w-sm w-full mx-4 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-mono text-sm text-muted-foreground">
            No terminology data found in this subject.
          </p>
          <button
            onClick={onClose}
            className="mt-6 font-mono text-xs px-4 py-2 border border-border rounded hover:border-primary/40 hover:text-primary transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Encyclopedia"
    >
      <div
        ref={overlayRef}
        tabIndex={-1}
        className="bg-panel border border-border rounded w-full max-w-3xl mx-4 flex flex-col max-h-[85vh] outline-none animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
              Encyclopedia
            </span>
            <span className="text-xs font-mono text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded">
              {subject.config.title}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close encyclopedia"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Category sidebar */}
          <nav
            className="w-40 shrink-0 border-r border-border flex flex-col gap-0.5 p-2 overflow-y-auto"
            aria-label="Terminology categories"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearch("") }}
                className={cn(
                  "text-left text-[11px] font-mono px-2.5 py-1.5 rounded transition-colors truncate",
                  activeCategory === cat
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent"
                )}
              >
                {formatLabel(cat)}
              </button>
            ))}
          </nav>

          {/* Term list */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search */}
            <div className="px-4 py-2.5 border-b border-border shrink-0">
              <input
                type="search"
                placeholder={`Search ${formatLabel(activeCategory)}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Entries */}
            <ul className="flex-1 overflow-y-auto divide-y divide-border" role="list">
              {filtered.length === 0 ? (
                <li className="px-5 py-6 text-xs font-mono text-muted-foreground text-center">
                  No terms match &quot;{search}&quot;
                </li>
              ) : (
                filtered.map((entry, i) => (
                  <li key={i} className="px-5 py-3 hover:bg-secondary/30 transition-colors">
                    <p className="text-sm font-mono font-semibold text-foreground leading-tight">
                      {entry.term}
                    </p>
                    <p className="text-xs font-sans text-muted-foreground leading-relaxed mt-1">
                      {entry.definition}
                    </p>
                  </li>
                ))
              )}
            </ul>

            {/* Footer count */}
            <div className="px-5 py-2 border-t border-border shrink-0">
              <span className="text-[10px] font-mono text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "TERM" : "TERMS"}
                {search && ` MATCHING "${search.toUpperCase()}"`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
