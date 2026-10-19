"use client"

import type { SetupConfig, GameModeId, CategoryData, Question } from "@/lib/mold-types"
import { cn } from "@/lib/utils"
import { RotateCcw } from "lucide-react"
import { ConfigControls, CategorySelectorSection } from "@/components/mold/home/setup-panel-blocks"

interface SetupPanelProps {
  config: SetupConfig
  onChange: (patch: Partial<SetupConfig>) => void
  onReset?: () => void
  selectedMode: GameModeId
  categories: CategoryData[]
  questions?: Question[]
  subjectId?: string
  className?: string
}

export function SetupPanel({
  config,
  onChange,
  onReset,
  selectedMode,
  categories,
  questions,
  subjectId,
  className,
}: SetupPanelProps) {
  const isPractice = selectedMode === "practice"
  const isUntimed = selectedMode === "practice" || selectedMode === "flashcards"
  const isFullRevision = selectedMode === "full-revision"

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono tracking-widest text-muted-foreground uppercase font-semibold">
          Configuration
        </h2>
        {onReset && (
          <button type="button"
            onClick={onReset}
            title="Reset configuration to defaults"
            aria-label="Reset configuration to defaults"
            className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground hover:text-primary transition-colors focus-ring rounded px-1.5 py-0.5 uppercase tracking-wider font-bold"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <ConfigControls config={config} onChange={onChange}>
        {!isUntimed && !isFullRevision && <ConfigControls.TimeLimit />}
        <ConfigControls.HintSystem />
        {!isFullRevision && !isPractice && <ConfigControls.QuestionCount />}
        {isFullRevision && <ConfigControls.RevisionNote />}
      </ConfigControls>

      {/* Category selector — practice mode only */}
      {isPractice && (
        <CategorySelectorSection
          config={config}
          onChange={onChange}
          categories={categories}
          questions={questions}
          subjectId={subjectId}
        />
      )}
    </section>
  )
}
