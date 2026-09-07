"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { ShareModal } from "@/components/mold/common/share-modal"
import { Footer } from "@/components/mold/common/footer"
import { toSubjectData } from "@/lib/subject-persistence"

const SubjectImporter = dynamic(
  () => import("@/components/mold/subject/subject-importer").then((mod) => mod.SubjectImporter),
  { ssr: false }
)
import type { FullSubjectData } from "@/lib/mold-types"
import { PlusIcon } from "@/components/mold/subject/subject-selector-components"
import { WelcomeBanner, YourSubjectsSection, ExampleModulesSection } from "@/components/mold/subject/subject-selector-blocks"
import { TopNavBar } from "@/components/mold/home/top-nav-bar"
import { NeuralCorePanel } from "@/components/mold/subject/neural-core-panel"

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
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Example manifest — fetched once, just metadata (fast)
  const [examples, setExamples] = useState<ExampleManifestEntry[]>([])
  const [examplesLoading, setExamplesLoading] = useState(true)
  const [exampleError, setExampleError] = useState<string | null>(null)
  const [loadingExampleId, setLoadingExampleId] = useState<string | null>(null)

  // Global '/' shortcut to focus search input
  useEffect(() => {
    const handleGlobalSearchKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        const target = e.target as HTMLElement | null
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
          return
        }
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleGlobalSearchKey)
    return () => window.removeEventListener("keydown", handleGlobalSearchKey)
  }, [])

  useEffect(() => {
    getExamplesManifest()
      .then((data) => setExamples(data))
      .catch((err) => {
        setExamples([])
        setExampleError(err?.message || "Failed to load examples")
      })
      .finally(() => setExamplesLoading(false))
  }, [])

  // Filtered lists based on search query
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects
    const q = searchQuery.toLowerCase().trim()
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.config?.description?.toLowerCase().includes(q)
    )
  }, [subjects, searchQuery])

  const filteredExamples = useMemo(() => {
    if (!searchQuery.trim()) return examples
    const q = searchQuery.toLowerCase().trim()
    return examples.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    )
  }, [examples, searchQuery])

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
      <div className="min-h-screen bg-background flex flex-col animate-fade-in pt-16">

        {/* ── Unified Navbar ── */}
        <TopNavBar
          loadedSubjectsCount={subjects.length}
          onImportNew={() => setShowImporter(true)}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Subject Selection Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Search filter input with hotkey pill */}
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (filteredSubjects.length === 1) {
                      e.preventDefault()
                      onSelect(filteredSubjects[0])
                    } else if (filteredSubjects.length === 0 && filteredExamples.length === 1) {
                      e.preventDefault()
                      handleExampleSelect(filteredExamples[0])
                    }
                  }
                }}
                placeholder="Search your subjects & example modules (Press Enter to open)..."
                aria-label="Search subjects and examples (press slash to focus)"
                className="w-full bg-panel border border-border px-4 py-2.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded pr-14 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="pointer-events-auto text-[10px] font-mono text-muted-foreground hover:text-foreground mr-1"
                    title="Clear search"
                  >
                    ESC
                  </button>
                ) : null}
                <span className="text-[10px] font-mono font-bold text-muted-foreground bg-secondary/80 border border-border/80 px-1.5 py-0.5 rounded select-none">
                  [/]
                </span>
              </div>
            </div>

            {/* ── Welcome banner — only when no user subjects ── */}
            {!hasUserSubjects && <WelcomeBanner />}

            {/* ── Your subjects ── */}
            {hasUserSubjects && (
              <YourSubjectsSection
                subjects={filteredSubjects}
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
              examples={filteredExamples}
              examplesLoading={examplesLoading}
              exampleError={exampleError}
              loadingExampleId={loadingExampleId}
              onExampleLoad={handleExampleLoad}
              onExampleShare={handleExampleShare}
            />

            {/* Import button — shown even without user subjects */}
            {!hasUserSubjects && (
              <div className="flex justify-center pt-2">
                <button type="button"
                  onClick={() => setShowImporter(true)}
                  title="Import a subject via JSON"
                  className="flex items-center gap-3 px-6 py-3 border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-xs font-mono tracking-wider"
                >
                  <PlusIcon aria-hidden="true" />
                  Import Your Own Subject
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Decorative System Neural Core / Telemetry (4 cols) */}
          <NeuralCorePanel />

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
