import React from "react"
import { cn } from "@/lib/utils"
import { SectionLabel, PlusIcon } from "@/components/mold/subject/subject-selector-components"
import { UserSubjectCard } from "@/components/mold/subject/user-subject-card"
import { ExampleModuleCard } from "@/components/mold/subject/example-module-card"
import { toSubjectData } from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"
import type { ExampleManifestEntry } from "@/app/actions"

export function WelcomeBanner() {
  return (
    <div className="border border-primary/20 bg-primary/5 px-5 py-4 flex flex-col gap-1">
      <p className="text-sm font-semibold text-primary tracking-tight">Welcome to Finalist</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Load one of the example modules below to get started immediately, or import your own subject file.
      </p>
    </div>
  )
}

interface YourSubjectsSectionProps {
  subjects: FullSubjectData[]
  confirmDeleteId: string | null
  onSelect: (subject: FullSubjectData) => void
  onShare: (subject: FullSubjectData) => void
  onDeleteConfirm: (id: string) => void
  onDeleteCancel: () => void
  onRemoveClick: (id: string) => void
  onShowImporter: () => void
}

export function YourSubjectsSection({
  subjects,
  confirmDeleteId,
  onSelect,
  onShare,
  onDeleteConfirm,
  onDeleteCancel,
  onRemoveClick,
  onShowImporter,
}: YourSubjectsSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <SectionLabel label="YOUR_SUBJECTS" count={subjects.length} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {subjects.map((full) => {
          const data = toSubjectData(full)
          const isConfirming = confirmDeleteId === full.id
          const categoryCount = data.categories.length

          return (
            <UserSubjectCard
              key={full.id}
              full={full}
              isConfirming={isConfirming}
              categoryCount={categoryCount}
              onSelect={onSelect}
              onShare={onShare}
              onDeleteConfirm={onDeleteConfirm}
              onDeleteCancel={onDeleteCancel}
              onRemoveClick={onRemoveClick}
            />
          )
        })}

        {/* Import card — dynamically spans 2 columns if user subjects count is even to balance grid layout */}
        <button
          onClick={onShowImporter}
          title="Import a subject via JSON"
          className={cn(
            "flex flex-col items-center justify-center gap-3 p-6 border border-dashed border-border text-muted-foreground bg-panel transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:bg-[#121318]/50 focus-ring min-h-[140px]",
            subjects.length % 2 === 0 && "sm:col-span-2"
          )}
        >
          <PlusIcon aria-hidden="true" />
          <span className="text-xs font-mono tracking-wider">Import Subject</span>
        </button>
      </div>
    </section>
  )
}

interface ExampleModulesSectionProps {
  examples: ExampleManifestEntry[]
  examplesLoading: boolean
  exampleError: string | null
  loadingExampleId: string | null
  onExampleLoad: (entry: ExampleManifestEntry) => void
  onExampleShare: (e: React.MouseEvent, entry: ExampleManifestEntry) => void
}

export function ExampleModulesSection({
  examples,
  examplesLoading,
  exampleError,
  loadingExampleId,
  onExampleLoad,
  onExampleShare,
}: ExampleModulesSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <SectionLabel label="EXAMPLE_MODULES" count={examples.length} badge="SERVER" />

      {exampleError && (
        <p className="text-xs font-mono text-destructive border border-destructive/30 bg-destructive/5 px-4 py-2">
          {exampleError}
        </p>
      )}

      {examplesLoading ? (
        <div aria-busy={true} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-panel border border-border h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {examples.map((entry, idx) => {
            const isLoading = loadingExampleId === entry.id
            const isLastAndOdd = idx === examples.length - 1 && examples.length % 2 !== 0
            return (
              <div key={entry.id} className={cn(isLastAndOdd && "sm:col-span-2")}>
                <ExampleModuleCard
                  entry={entry}
                  isLoading={isLoading}
                  onLoad={onExampleLoad}
                  onShare={onExampleShare}
                />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
