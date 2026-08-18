"use client"

import React, { useState } from "react"
import type { SetupConfig, GameModeId, CategoryData } from "@/lib/mold-types"
import { cn } from "@/lib/utils"
import { ConfigControls, CategorySelectorSection } from "@/components/mold/home/setup-panel-blocks"
import { Settings2, ChevronDown, ChevronUp } from "lucide-react"

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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const isPractice = selectedMode === "practice"
  const isUntimed = selectedMode === "practice" || selectedMode === "flashcards"
  const isFullRevision = selectedMode === "full-revision"

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono tracking-widest text-muted-foreground uppercase font-semibold">
          Configuration
        </h2>
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          aria-expanded={isAdvancedOpen}
          className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring px-2 py-1 rounded bg-secondary/50"
        >
          <Settings2 className="w-3 h-3" aria-hidden="true" />
          <span>{isAdvancedOpen ? "HIDE ADVANCED" : "SHOW ADVANCED"}</span>
          {isAdvancedOpen ? <ChevronUp className="w-3 h-3" aria-hidden="true" /> : <ChevronDown className="w-3 h-3" aria-hidden="true" />}
        </button>
      </div>

      <ConfigControls config={config} onChange={onChange}>
        <div className={cn("flex-col gap-3", isAdvancedOpen ? "flex" : "hidden")}>
          {!isUntimed && !isFullRevision && <ConfigControls.TimeLimit />}
          <ConfigControls.HintSystem />
          {!isFullRevision && !isPractice && <ConfigControls.QuestionCount />}
          {isFullRevision && <ConfigControls.RevisionNote />}
        </div>
      </ConfigControls>

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
