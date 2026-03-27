"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SubjectImporter } from "@/components/mold/subject-importer"
import { toSubjectData } from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"

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
  const [showImporter, setShowImporter] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function handleImport(subject: FullSubjectData) {
    setShowImporter(false)
    onAddSubject(subject)
  }

  function handleDeleteConfirm(id: string) {
    setConfirmDeleteId(null)
    onRemoveSubject(id)
  }

  const existingIds = subjects.map((s) => s.id)

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">

        {/* Header */}
        <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-panel">
          <div className="flex items-center gap-3">
            <ProtocolIcon />
            <div>
              <p className="text-xs font-mono font-semibold tracking-widest text-primary uppercase">
                MOLD V2
              </p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
                MASTERY PROTOCOL
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground border border-border px-2 py-1 rounded">
            {subjects.length} SUBJECT{subjects.length !== 1 ? "S" : ""} LOADED
          </span>
        </header>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Select a Subject
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose a subject to study, or import a new one.
            </p>
          </div>

          {/* Subject grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((full) => {
              const data = toSubjectData(full)
              const isConfirmingDelete = confirmDeleteId === full.id
              const categoryCount = data.categories.length

              return (
                <div
                  key={full.id}
                  className={cn(
                    "group relative flex flex-col rounded border bg-panel transition-colors",
                    isConfirmingDelete
                      ? "border-destructive/40"
                      : "border-border hover:border-border/80"
                  )}
                >
                  {/* Card body — clickable to select */}
                  <button
                    onClick={() => !isConfirmingDelete && onSelect(full)}
                    disabled={isConfirmingDelete}
                    className="flex flex-col gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-t"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground leading-snug text-pretty">
                        {full.name}
                      </p>
                      <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-border text-muted-foreground">
                        v{full.config.version ?? "1.0"}
                      </span>
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
                    <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">
                      {full.id}
                    </span>

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-destructive/80">Delete?</span>
                        <button
                          onClick={() => handleDeleteConfirm(full.id)}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(full.id) }}
                        className="text-[10px] font-mono text-muted-foreground/40 hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded px-1"
                        aria-label={`Remove ${full.name}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Add new subject card */}
            <button
              onClick={() => setShowImporter(true)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[140px]"
            >
              <PlusIcon />
              <span className="text-xs font-mono tracking-wider">Import Subject</span>
            </button>
          </div>
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
    </>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-background text-muted-foreground">
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
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
