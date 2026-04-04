"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { SubjectImporter } from "@/components/mold/subject-importer"
import { ShareModal } from "@/components/mold/share-modal"
import { toSubjectData } from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"

// ─── Example subject manifest (only metadata, no questions yet) ───────────────

interface ExampleManifestEntry {
  id: string
  name: string
  description: string
  questionCount: number
  categoryCount: number
  tags: string[]
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SubjectSelectorProps {
  subjects: FullSubjectData[]
  onSelect: (subject: FullSubjectData) => void
  onAddSubject: (subject: FullSubjectData) => void
  onRemoveSubject: (id: string) => void
}

export function SubjectSelector({
  subjects,
  onSelect,
  onAddSubject,
  onRemoveSubject,
}: SubjectSelectorProps) {
  const [showImporter, setShowImporter]       = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [sharingSubject, setSharingSubject]   = useState<FullSubjectData | null>(null)

  // Example manifest — fetched once, just metadata (fast)
  const [examples, setExamples]             = useState<ExampleManifestEntry[]>([])
  const [examplesLoading, setExamplesLoading] = useState(true)

  // Per-example loading state (full JSON fetch on click)
  const [loadingExampleId, setLoadingExampleId] = useState<string | null>(null)
  // Per-example error state
  const [exampleError, setExampleError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/examples/index.json")
      .then((r) => r.json())
      .then((data: ExampleManifestEntry[]) => setExamples(data))
      .catch(() => setExamples([]))
      .finally(() => setExamplesLoading(false))
  }, [])

  function handleImport(subject: FullSubjectData) {
    setShowImporter(false)
    onAddSubject(subject)
  }

  function handleDeleteConfirm(id: string) {
    setConfirmDeleteId(null)
    onRemoveSubject(id)
  }

  /**
   * Load a full example subject on demand — only triggered by user click.
   * The full JSON is never loaded at page mount.
   */
  async function handleExampleLoad(entry: ExampleManifestEntry) {
    setLoadingExampleId(entry.id)
    setExampleError(null)
    try {
      const res = await fetch(`/examples/${entry.id}.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const full: FullSubjectData = await res.json()
      onSelect(full)
    } catch {
      setExampleError(`Failed to load "${entry.name}". Please try again.`)
    } finally {
      setLoadingExampleId(null)
    }
  }

  /**
   * Share an example: must fetch full JSON first (share payload needs questions).
   */
  async function handleExampleShare(e: React.MouseEvent, entry: ExampleManifestEntry) {
    e.stopPropagation()
    setLoadingExampleId(entry.id)
    setExampleError(null)
    try {
      const res = await fetch(`/examples/${entry.id}.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const full: FullSubjectData = await res.json()
      setSharingSubject(full)
    } catch {
      setExampleError(`Could not load "${entry.name}" for sharing.`)
    } finally {
      setLoadingExampleId(null)
    }
  }

  const existingIds    = subjects.map((s) => s.id)
  const hasUserSubjects = subjects.length > 0

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">

        {/* ── Header ── */}
        <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-panel">
          <div className="flex items-center gap-3">
            <ProtocolIcon />
            <div>
              <p className="text-xs font-mono font-semibold tracking-widest text-primary uppercase">MOLD V2</p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider">MASTERY PROTOCOL</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground border border-border px-2 py-1">
            {subjects.length} SUBJECT{subjects.length !== 1 ? "S" : ""} LOADED
          </span>
        </header>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">

          {/* ── Welcome banner — only when no user subjects ── */}
          {!hasUserSubjects && (
            <div className="border border-primary/20 bg-primary/5 px-5 py-4 flex flex-col gap-1">
              <p className="text-sm font-semibold text-primary tracking-tight">Welcome to MOLD V2</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Load one of the example modules below to get started immediately, or import your own subject file.
              </p>
            </div>
          )}

          {/* ── Your subjects ── */}
          {hasUserSubjects && (
            <section className="flex flex-col gap-4">
              <SectionLabel label="YOUR_SUBJECTS" count={subjects.length} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((full) => {
                  const data             = toSubjectData(full)
                  const isConfirming     = confirmDeleteId === full.id
                  const categoryCount    = data.categories.length

                  return (
                    <div
                      key={full.id}
                      className={cn(
                        "group relative flex flex-col bg-panel border transition-colors",
                        isConfirming ? "border-destructive/40" : "border-border hover:border-border/80"
                      )}
                    >
                      {/* Clickable card body */}
                      <button
                        onClick={() => !isConfirming && onSelect(full)}
                        disabled={isConfirming}
                        className="flex flex-col gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-1"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground leading-snug text-pretty">{full.name}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSharingSubject(full) }}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              aria-label={`Share ${full.name}`}
                              title="Share subject"
                            >
                              <ShareIcon />
                            </button>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 border border-border text-muted-foreground">
                              v{full.config.version ?? "1.0"}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {full.config.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <StatPill label="Q" value={data.totalQuestions} />
                          <StatPill label="FC" value={full.flashcards?.length ?? 0} />
                          <StatPill label="Cat" value={categoryCount} />
                        </div>
                      </button>

                      {/* Card footer */}
                      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
                        <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">{full.id}</span>
                        {isConfirming ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-destructive/80">Delete?</span>
                            <button
                              onClick={() => handleDeleteConfirm(full.id)}
                              className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
                            >Yes</button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground hover:text-foreground transition-colors"
                            >No</button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(full.id) }}
                            className="text-[10px] font-mono text-muted-foreground/40 hover:text-destructive transition-colors px-1"
                            aria-label={`Remove ${full.name}`}
                          >Remove</button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Import card */}
                <button
                  onClick={() => setShowImporter(true)}
                  className="flex flex-col items-center justify-center gap-3 p-6 border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[140px]"
                >
                  <PlusIcon />
                  <span className="text-xs font-mono tracking-wider">Import Subject</span>
                </button>
              </div>
            </section>
          )}

          {/* ── Example modules ── */}
          <section className="flex flex-col gap-4">
            <SectionLabel label="EXAMPLE_MODULES" count={examples.length} badge="SERVER" />

            {exampleError && (
              <p className="text-xs font-mono text-destructive border border-destructive/30 bg-destructive/5 px-4 py-2">
                {exampleError}
              </p>
            )}

            {examplesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-panel border border-border h-40 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {examples.map((entry) => {
                  const isLoading = loadingExampleId === entry.id
                  return (
                    <div
                      key={entry.id}
                      className="group relative flex flex-col bg-panel border border-border hover:border-border/80 transition-colors"
                    >
                      {/* Clickable card body */}
                      <button
                        onClick={() => !isLoading && handleExampleLoad(entry)}
                        disabled={isLoading}
                        className="flex flex-col gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-1"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground leading-snug text-pretty">{entry.name}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Share — fetches full JSON first */}
                            <button
                              onClick={(e) => !isLoading && handleExampleShare(e, entry)}
                              disabled={isLoading}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              aria-label={`Share ${entry.name}`}
                              title="Share subject"
                            >
                              <ShareIcon />
                            </button>
                            {/* Example badge */}
                            <span className="text-[10px] font-mono px-1.5 py-0.5 border border-primary/30 text-primary/70 bg-primary/5">
                              EXAMPLE
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {entry.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <StatPill label="Q" value={entry.questionCount} />
                          <StatPill label="Cat" value={entry.categoryCount} />
                          {entry.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 border border-border bg-background text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>

                      {/* Footer — load button or spinner */}
                      <div className="border-t border-border px-4 py-2.5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-muted-foreground">{entry.id}</span>
                        {isLoading ? (
                          <div className="flex items-center gap-2 text-[10px] font-mono text-primary">
                            <SpinnerIcon />
                            LOADING...
                          </div>
                        ) : (
                          <button
                            onClick={() => handleExampleLoad(entry)}
                            className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            LOAD_MODULE →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Import button — shown even without user subjects */}
          {!hasUserSubjects && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowImporter(true)}
                className="flex items-center gap-3 px-6 py-3 border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-xs font-mono tracking-wider"
              >
                <PlusIcon />
                Import Your Own Subject
              </button>
            </div>
          )}

        </main>

        <footer className="border-t border-border px-6 py-3 flex items-center justify-between bg-panel">
          <span className="text-xs font-mono text-muted-foreground">MOLD V2 — MASTERY PROTOCOL</span>
          <span className="text-xs font-mono text-muted-foreground">OFFLINE FIRST</span>
        </footer>
      </div>

      {showImporter && (
        <SubjectImporter
          onImport={handleImport}
          onCancel={() => setShowImporter(false)}
          existingIds={existingIds}
        />
      )}

      {sharingSubject && (
        <ShareModal
          subject={sharingSubject}
          onClose={() => setSharingSubject(null)}
        />
      )}
    </>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ label, count, badge }: { label: string; count: number; badge?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
      <span className="text-[10px] font-mono px-1.5 py-0.5 border border-border text-muted-foreground bg-background">{count}</span>
      {badge && (
        <span className="text-[10px] font-mono px-1.5 py-0.5 border border-primary/30 text-primary/70 bg-primary/5">{badge}</span>
      )}
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[10px] font-mono px-2 py-0.5 border border-border bg-background text-muted-foreground">
      {label}: <span className="text-foreground">{value}</span>
    </span>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ProtocolIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  )
}
