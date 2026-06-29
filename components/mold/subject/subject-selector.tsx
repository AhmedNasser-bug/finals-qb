"use client"

import { useState, useEffect } from "react"
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
      <div className="min-h-screen bg-background flex flex-col animate-fade-in pt-16">

        {/* ── Unified Navbar ── */}
        <TopNavBar
          loadedSubjectsCount={subjects.length}
          onImportNew={() => setShowImporter(true)}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Subject Selection Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
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
                  className="flex items-center gap-3 px-6 py-3 border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors focus-ring text-xs font-mono tracking-wider"
                >
                  <PlusIcon aria-hidden="true" />
                  Import Your Own Subject
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Decorative System Neural Core / Telemetry (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 select-none lg:sticky lg:top-6 h-fit">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">
                SYSTEM_NEURAL_CORE
              </span>
            </div>

            {/* Decorative Brain/Cortex Image Card */}
            <div className="aspect-square bg-zinc-950 border border-zinc-800 p-2.5 relative overflow-hidden group rounded-md select-none border-glow shadow-[0_0_15px_rgba(254,204,23,0.05)] hover:shadow-[0_0_25px_rgba(254,204,23,0.12)] transition-all duration-500">
              <img 
                alt="Digital telemetry brain cortical visualization" 
                className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-85 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhXfd0BDWa6914O52t-6kHaB-iWXeSbkhlPio2Rtnl0JuAXsT60dN-YcowvASlkY8LY-uix1yLSB1kHqi1cUoxaHZloZMJF4vieq1bHrMfVySIWJaziKL_eo6q-iCdfqQJ-KTZVAgvDOmENMEeh-45IvE95U-YvUj0j6AUiLfIXieCQkdS3VSWQv4G75KySxVy8vpJWxoIe3BMbV16qwJMa1Zts8Rb_QdZoNeXrrzWAA7A1JMxVXIZ3_6uFokFise-DQ8c6V82m6Fl"
              />
              <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />
              
              {/* TOP RIGHT: SYS_FEED label */}
              <div className="absolute top-4 right-4 bg-black/85 px-2 py-0.5 font-mono text-[8px] text-primary border border-primary/20 tracking-wider">
                SYS_FEED
              </div>

              {/* BOTTOM LEFT: Cortex identifier */}
              <div className="absolute bottom-4 left-4 bg-black/85 px-3 py-1 font-mono text-[9px] text-primary border border-primary/20 uppercase tracking-widest font-bold">
                REF_ID: حلتيتة
              </div>
            </div>

            {/* Neural Uptime and Stats Telemetry Panel */}
            <div className="bg-[#101115] border border-border p-5 rounded-md space-y-4 font-mono text-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2 border-b border-border pb-2.5">
                <span className="text-[9px] text-[var(--tw-hex-fecc17)]/80 tracking-widest font-bold uppercase">
                  INTELLIGENCE_LAYER_TELEMETRY
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-muted-foreground uppercase">NODE_STATUS</span>
                  <span className="font-bold text-emerald-400">ONLINE</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-muted-foreground uppercase">SYNAPSE_LINKS</span>
                  <span className="font-bold text-white">4,096 ACTIVE</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-muted-foreground uppercase">COGNITIVE_EFFICIENCY</span>
                  <span className="font-bold text-primary">99.8%</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground uppercase">PROCESSING_CYCLE</span>
                  <span className="font-bold text-primary">0.12ms / TICK</span>
                </div>
              </div>
            </div>
          </div>

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
