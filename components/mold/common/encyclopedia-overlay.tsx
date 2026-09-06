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
    const el = overlayRef.current
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
  }, [])

  const entries = terminology?.[activeCategory] ?? []
  const hasSearch = search.trim()
  const loweredSearch = hasSearch.toLowerCase()
  const filtered = hasSearch
    ? entries.filter(
        (e) =>
          e.term.toLowerCase().includes(loweredSearch) ||
          e.definition.toLowerCase().includes(loweredSearch)
      )
    : entries

  if (categories.length === 0) {
    return (
      <div
        ref={overlayRef}
        tabIndex={-1}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm outline-none"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-label="Encyclopedia"
      >
        <div
          className="bg-panel border border-border rounded p-8 max-w-sm w-full mx-4 text-center"
          onClick={(e) => e.stopPropagation()}
          role="status"
          aria-live="polite"
        >
          <p className="font-mono text-sm text-muted-foreground">
            No terminology data found in this subject.
          </p>
          <button type="button"
            onClick={onClose}
            aria-label="Close encyclopedia overlay"
            title="Close encyclopedia overlay"
            className="mt-6 font-mono text-xs px-4 py-2 border border-border rounded hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            CLOSE
          </button>
        </div>
      </div>
    )
  }

  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search on '/' key
  useEffect(() => {
    function onGlobalKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onGlobalKey)
    return () => window.removeEventListener("keydown", onGlobalKey)
  }, [])

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
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase font-bold">
              Encyclopedia
            </span>
            <span className="text-xs font-mono text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded">
              {subject.config.title}
            </span>
          </div>
          <button type="button"
            onClick={onClose}
            aria-label="Close encyclopedia"
            title="Close encyclopedia (Esc)"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded p-1"
          >
            <CloseIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Category sidebar */}
          <nav
            className="w-44 shrink-0 border-r border-border flex flex-col gap-0.5 p-2 overflow-y-auto"
            aria-label="Terminology categories"
          >
            {categories.map((cat) => {
              const count = terminology?.[cat]?.length ?? 0
              return (
                <button type="button"
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearch("") }}
                  aria-current={activeCategory === cat ? "page" : undefined}
                  title={`${formatLabel(cat)} (${count} terms)`}
                  className={cn(
                    "flex items-center justify-between text-left text-[11px] font-mono px-2.5 py-1.5 rounded transition-colors truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    activeCategory === cat
                      ? "bg-primary/10 text-primary border border-primary/20 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent"
                  )}
                >
                  <span className="truncate">{formatLabel(cat)}</span>
                  <span className="text-[9px] font-mono text-muted-foreground/60 shrink-0 ml-1">
                    {count}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Term list */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search */}
            <div className="px-4 py-2.5 border-b border-border shrink-0 relative">
              <input
                ref={searchInputRef}
                type="search"
                aria-label={`Search ${formatLabel(activeCategory)}`}
                placeholder={`Search ${formatLabel(activeCategory)} (Press '/' to focus)…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-1.5 pr-8 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear term search"
                  title="Clear term search"
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Entries */}
            <ul className="flex-1 overflow-y-auto divide-y divide-border" role="list">
              {filtered.length === 0 ? (
                <li className="px-5 py-6 text-xs font-mono text-muted-foreground text-center">
                  <div role="status" aria-live="polite">
                    No terms match &quot;{search}&quot;
                  </div>
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
            <div className="px-5 py-2 border-t border-border shrink-0 flex justify-between items-center">
              <span className="text-[10px] font-mono text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "TERM" : "TERMS"}
                {search && ` MATCHING "${search.toUpperCase()}"`}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/60 hidden sm:inline">
                Press [/] to search • [ESC] to close
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CloseIcon({ className, 'aria-hidden': ariaHidden }: { className?: string, 'aria-hidden'?: boolean | "true" | "false" }) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
