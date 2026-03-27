"use client"

import type { SetupConfig, GameModeId, CategoryData } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface SetupPanelProps {
  config: SetupConfig
  onChange: (patch: Partial<SetupConfig>) => void
  selectedMode: GameModeId
  categories: CategoryData[]
  className?: string
}

const QUESTION_COUNT_OPTIONS = [10, 20, 30, 0] // 0 = all

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

      <div className="flex flex-col gap-3 p-4 rounded border border-border bg-panel">
        {/* Time limit toggle — hidden for untimed modes */}
        {!isUntimed && !isFullRevision && (
          <ConfigRow
            label="Time Limit"
            description={config.timeLimitEnabled ? "Global countdown active" : "No timer pressure"}
          >
            <Toggle
              checked={config.timeLimitEnabled}
              onChange={(v) => onChange({ timeLimitEnabled: v })}
              activeLabel="ON"
              inactiveLabel="OFF"
            />
          </ConfigRow>
        )}

        {/* Hints toggle */}
        <ConfigRow
          label="Hint System"
          description={config.hintsEnabled ? "Hints available per question" : "No hints — pure recall"}
        >
          <Toggle
            checked={config.hintsEnabled}
            onChange={(v) => onChange({ hintsEnabled: v })}
            activeLabel="ON"
            inactiveLabel="OFF"
          />
        </ConfigRow>

        {/* Question count — hidden for full revision (always all) */}
        {!isFullRevision && !isPractice && (
          <ConfigRow
            label="Question Count"
            description="Number of questions to pull per session"
          >
            <div className="flex items-center gap-1">
              {QUESTION_COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => onChange({ questionCount: n })}
                  className={cn(
                    "px-2.5 py-1 text-xs font-mono rounded border transition-colors",
                    config.questionCount === n
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                  )}
                >
                  {n === 0 ? "ALL" : n}
                </button>
              ))}
            </div>
          </ConfigRow>
        )}

        {/* Full revision note */}
        {isFullRevision && (
          <p className="text-xs font-mono text-muted-foreground py-1">
            Full Revision uses all {" "}
            <span className="text-foreground">questions in strict order.</span>{" "}
            No modifications available.
          </p>
        )}
      </div>

      {/* Category selector — practice mode only */}
      {isPractice && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono tracking-wider text-emerald-400">
            Target Sector
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <CategoryTile
              id={null}
              name="All Categories"
              questionCount={categories.reduce((s, c) => s + c.questionCount, 0)}
              selected={config.selectedCategory === null}
              onSelect={() => onChange({ selectedCategory: null })}
            />
            {categories.map((cat) => (
              <CategoryTile
                key={cat.id}
                id={cat.id}
                name={cat.name}
                questionCount={cat.questionCount}
                selected={config.selectedCategory === cat.id}
                onSelect={() => onChange({ selectedCategory: cat.id })}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ConfigRow({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  activeLabel,
  inactiveLabel,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  activeLabel: string
  inactiveLabel: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-all duration-150",
        checked
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-border/80"
      )}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted-foreground"
        )}
      />
      {checked ? activeLabel : inactiveLabel}
    </button>
  )
}

interface CategoryTileProps {
  id: string | null
  name: string
  questionCount: number
  selected: boolean
  onSelect: () => void
}

function CategoryTile({ name, questionCount, selected, onSelect }: CategoryTileProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-1 p-3 rounded border text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-emerald-400/60 bg-emerald-400/5 text-foreground"
          : "border-border bg-panel text-foreground/80 hover:border-border/80 hover:text-foreground"
      )}
    >
      <span className="text-sm font-medium leading-snug text-pretty">{name}</span>
      <span className={cn(
        "text-xs font-mono",
        selected ? "text-emerald-400" : "text-muted-foreground"
      )}>
        {questionCount} qs
      </span>
    </button>
  )
}
