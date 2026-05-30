"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { SubjectImporter } from "@/components/mold/subject/subject-importer"
import { ShareModal } from "@/components/mold/common/share-modal"
import { Footer } from "@/components/mold/common/footer"
import { toSubjectData } from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"
import { ProtocolIcon, PlusIcon } from "@/components/mold/subject/subject-selector-components"
import { WelcomeBanner, YourSubjectsSection, ExampleModulesSection } from "@/components/mold/subject/subject-selector-blocks"

// ─── Example subject manifest (only metadata, no questions yet) ───────────────

import { getExamplesManifest, type ExampleManifestEntry } from "@/app/actions"
import { validateSubjectData } from "@/lib/subject-persistence"

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
  const [showImporter, setShowImporter] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [sharingSubject, setSharingSubject] = useState<FullSubjectData | null>(null)

  // Example manifest — fetched once, just metadata (fast)
  const [examples, setExamples] = useState<ExampleManifestEntry[]>([])
  const [examplesLoading, setExamplesLoading] = useState(true)

  // Per-example loading state (full JSON fetch on click)
  const [loadingExampleId, setLoadingExampleId] = useState<string | null>(null)
  // Per-example error state
  const [exampleError, setExampleError] = useState<string | null>(null)

  useEffect(() => {
    getExamplesManifest()
      .then((data) => setExamples(data))
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
      const res = await fetch(`/examples/${entry.filename}.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      const result = validateSubjectData(raw)
      if (!result.valid || !result.subject) {
        throw new Error(result.errors[0] || "Validation failed")
      }
      onSelect(result.subject)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      setExampleError(`Failed to load "${entry.name}". ${msg}`)
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
      const res = await fetch(`/examples/${entry.filename}.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      const result = validateSubjectData(raw)
      if (!result.valid || !result.subject) {
        throw new Error(result.errors[0] || "Validation failed")
      }
      setSharingSubject(result.subject)
    } catch {
      setExampleError(`Could not load "${entry.name}" for sharing.`)
    } finally {
      setLoadingExampleId(null)
    }
  }

  const existingIds = subjects.map((s) => s.id)
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
          {!hasUserSubjects && <WelcomeBanner />}

          {/* ── Your subjects ── */}
          {hasUserSubjects && (
            <YourSubjectsSection
              subjects={subjects}
              confirmDeleteId={confirmDeleteId}
              onSelect={onSelect}
              onShare={(f) => setSharingSubject(f)}
              onDeleteConfirm={handleDeleteConfirm}
              onDeleteCancel={() => setConfirmDeleteId(null)}
              onRemoveClick={(id) => setConfirmDeleteId(id)}
              onShowImporter={() => setShowImporter(true)}
            />
          )}

          {/* ── Example modules ── */}
          <ExampleModulesSection
            examples={examples}
            examplesLoading={examplesLoading}
            exampleError={exampleError}
            loadingExampleId={loadingExampleId}
            onExampleLoad={handleExampleLoad}
            onExampleShare={handleExampleShare}
          />

          {/* Import button — shown even without user subjects */}
          {!hasUserSubjects && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowImporter(true)}
                title="Import a subject via JSON"
                className="flex items-center gap-3 px-6 py-3 border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-xs font-mono tracking-wider"
              >
                <PlusIcon aria-hidden="true" />
                Import Your Own Subject
              </button>
            </div>
          )}

        </main>

        <Footer />
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
