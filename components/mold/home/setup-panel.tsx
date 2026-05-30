"use client"

import type { SetupConfig, GameModeId, CategoryData } from "@/lib/mold-types"
import { cn } from "@/lib/utils"
import { ConfigControls, CategorySelectorSection } from "@/components/mold/home/setup-panel-blocks"

interface SetupPanelProps {
  config: SetupConfig
  onChange: (patch: Partial<SetupConfig>) => void
  selectedMode: GameModeId
  categories: CategoryData[]
  className?: string
}

export function SetupPanel({
  config,
  onChange,
  selectedMode,
  categories,
  className,
}: SetupPanelProps) {
  const isPractice = selectedMode === "practice"
  const isUntimed = selectedMode === "practice" || selectedMode === "flashcards"
  const isFullRevision = selectedMode === "full-revision"

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <h2 className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
        Configuration
      </h2>

      <ConfigControls
        config={config}
        onChange={onChange}
        isUntimed={isUntimed}
        isFullRevision={isFullRevision}
        isPractice={isPractice}
      />

      {/* Category selector — practice mode only */}
      {isPractice && (
        <CategorySelectorSection
          config={config}
          onChange={onChange}
          categories={categories}
        />
      )}
    </section>
  )
}
