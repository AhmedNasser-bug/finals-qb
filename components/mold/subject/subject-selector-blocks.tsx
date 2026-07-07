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
            "flex flex-col items-center justify-center gap-3 p-6 border border-dashed border-border text-muted-foreground bg-panel transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:bg-[#121318]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[140px]",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

export function SystemNeuralCore() {
  return (
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
  )
}
