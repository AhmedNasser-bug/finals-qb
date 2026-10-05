"use client"

import type { SetupConfig, GameModeId, CategoryData, Question } from "@/lib/mold-types"
import { cn } from "@/lib/utils"
import { ConfigControls, CategorySelectorSection } from "@/components/mold/home/setup-panel-blocks"

interface SetupPanelProps {
  config: SetupConfig
  onChange: (patch: Partial<SetupConfig>) => void
  selectedMode: GameModeId
  categories: CategoryData[]
  questions?: Question[]
  subjectId?: string
  className?: string
}

export function SetupPanel({
  config,
  onChange,
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
        <button
          onClick={() => onChange({ timeLimitEnabled: true, hintsEnabled: false, questionCount: 20, selectedCategory: null })}
          className="text-[10px] font-mono text-muted-foreground hover:text-foreground border border-border px-2 py-0.5 rounded transition-colors cursor-pointer"
          title="Reset configuration to default values"
          aria-label="Reset configuration to default values"
        >
          RESET
        </button>
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
