"use client"

import React, { createContext, useContext, useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import type { SetupConfig, CategoryData } from "@/lib/mold-types"

const QUESTION_COUNT_OPTIONS = [10, 20, 30, 0] // 0 = all

// ─── Compound Component Context ──────────────────────────────────────────────

interface ConfigControlsContextValue {
  config: SetupConfig
  onChange: (patch: Partial<SetupConfig>) => void
}

const ConfigControlsContext = createContext<ConfigControlsContextValue | null>(null)

function useConfigControls() {
  const ctx = useContext(ConfigControlsContext)
  if (!ctx) {
    throw new Error("ConfigControls subcomponents must be used inside <ConfigControls>")
  }
  return ctx
}

// ─── Main Compound Component ──────────────────────────────────────────────────

export function ConfigControls({
  config,
  onChange,
  children,
}: {
  config: SetupConfig
  onChange: (patch: Partial<SetupConfig>) => void
  children: React.ReactNode
}) {
  const handleResetDefaults = () => {
    onChange({
      timeLimitEnabled: true,
      hintsEnabled: false,
      questionCount: 20,
    })
  }

  return (
    <ConfigControlsContext.Provider value={{ config, onChange }}>
      <div className="flex flex-col gap-4 p-5 rounded border border-border bg-panel">
        {/* Quick parameter toolbar */}
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Parameters
          </span>
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset parameters to standard defaults (Timer ON, Hints OFF, 20 questions)"
            aria-label="Reset parameters to defaults"
            className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors focus-ring px-1.5 py-0.5 rounded border border-transparent hover:border-border"
          >
            RESET DEFAULTS
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {children}
        </div>
      </div>
    </ConfigControlsContext.Provider>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

export function TimeLimitToggle() {
  const { config, onChange } = useConfigControls()
  return (
    <ConfigRow
      label="Time Limit"
      description={config.timeLimitEnabled ? "Global countdown active" : "No timer pressure"}
    >
      <Toggle
        checked={config.timeLimitEnabled}
        onChange={(v) => onChange({ timeLimitEnabled: v })}
        activeLabel="ON"
        inactiveLabel="OFF"
        ariaLabel="Toggle Time Limit"
        title={config.timeLimitEnabled ? "Disable time limit pressure" : "Enable countdown time limit"}
      />
    </ConfigRow>
  )
}

export function HintSystemToggle() {
  const { config, onChange } = useConfigControls()
  return (
    <ConfigRow
      label="Hint System"
      description={config.hintsEnabled ? "Hints available per question" : "No hints — pure recall"}
    >
      <Toggle
        checked={config.hintsEnabled}
        onChange={(v) => onChange({ hintsEnabled: v })}
        activeLabel="ON"
        inactiveLabel="OFF"
        ariaLabel="Toggle Hint System"
        title={config.hintsEnabled ? "Turn off hints for maximum score" : "Enable hints during questions"}
      />
    </ConfigRow>
  )
}

export function QuestionCountGroup({ options = QUESTION_COUNT_OPTIONS }: { options?: number[] }) {
  const { config, onChange } = useConfigControls()
  return (
    <ConfigRow
      label="Question Count"
      description="Number of questions to pull per session"
    >
      <div className="flex flex-wrap items-center gap-1.5 justify-end" role="group" aria-label="Question Count Options">
        {options.map((n) => {
          const isPressed = config.questionCount === n
          return (
            <button
              key={n}
              onClick={() => onChange({ questionCount: n })}
              aria-pressed={isPressed}
              aria-label={`${n === 0 ? "All available" : n} questions`}
              title={`Set question limit to ${n === 0 ? "all available" : n} questions`}
              className={cn(
                "px-3 py-2 text-xs font-mono rounded border transition-colors focus-ring min-w-[44px] min-h-[44px]",
                isPressed
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-[0_0_8px_hsla(var(--primary),0.15)]"
                  : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground bg-secondary/30"
              )}
            >
              {n === 0 ? "ALL" : n}
            </button>
          )
        })}
      </div>
    </ConfigRow>
  )
}

export function RevisionNote() {
  return (
    <p className="text-xs font-mono text-muted-foreground py-1 leading-relaxed border-l-2 border-primary/50 pl-3 bg-secondary/20 rounded-r">
      Full Revision uses all{" "}
      <span className="text-foreground font-semibold">questions in strict canonical order.</span>{" "}
      No parameter overrides available.
    </p>
  )
}

// Bind subcomponents statically
ConfigControls.TimeLimit = TimeLimitToggle
ConfigControls.HintSystem = HintSystemToggle
ConfigControls.QuestionCount = QuestionCountGroup
ConfigControls.RevisionNote = RevisionNote

// ─── Category Selection with Search & Live Filter ─────────────────────────────

export interface CategorySelectorSectionProps {
  config: SetupConfig
  onChange: (patch: Partial<SetupConfig>) => void
  categories: CategoryData[]
}

export function CategorySelectorSection({
  config,
  onChange,
  categories,
}: CategorySelectorSectionProps) {
  const [filterQuery, setFilterQuery] = useState("")

  const filteredCategories = useMemo(() => {
    if (!filterQuery.trim()) return categories
    const q = filterQuery.toLowerCase()
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, filterQuery])

  const totalQuestions = useMemo(
    () => categories.reduce((s, c) => s + c.questionCount, 0),
    [categories]
  )

  const activeCategoryName = useMemo(() => {
    if (!config.selectedCategory) return "All Categories"
    const found = categories.find((c) => c.id === config.selectedCategory)
    return found ? found.name : "All Categories"
  }, [categories, config.selectedCategory])

  return (
    <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-bold">
            Target Sector
          </p>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            role="status"
            aria-live="polite"
          >
            Active: {activeCategoryName}
          </span>
        </div>

        {/* Quick Category Filter Input (if > 3 categories) */}
        {categories.length > 3 && (
          <div className="relative">
            <input
              type="search"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search sectors..."
              aria-label="Search practice categories"
              title="Filter categories by name"
              className="px-2.5 py-1 text-xs font-mono bg-secondary/50 border border-border rounded text-foreground placeholder:text-muted-foreground focus-ring w-full sm:w-44"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery("")}
                aria-label="Clear category search"
                title="Clear category search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
        {(!filterQuery || "all categories".includes(filterQuery.toLowerCase())) && (
          <CategoryTile
            id={null}
            name="All Categories"
            questionCount={totalQuestions}
            selected={config.selectedCategory === null}
            onSelect={() => onChange({ selectedCategory: null })}
          />
        )}
        {filteredCategories.map((cat) => (
          <CategoryTile
            key={cat.id}
            id={cat.id}
            name={cat.name}
            questionCount={cat.questionCount}
            selected={config.selectedCategory === cat.id}
            onSelect={() => onChange({ selectedCategory: cat.id })}
          />
        ))}
        {filteredCategories.length === 0 && (
          <div className="col-span-2 sm:col-span-3 p-4 text-center text-xs font-mono text-muted-foreground border border-dashed border-border rounded">
            No matching sectors found for "{filterQuery}".
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Shared Base UI Blocks ───────────────────────────────────────────────────

export function ConfigRow({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground font-display tracking-tight">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  activeLabel,
  inactiveLabel,
  ariaLabel,
  title,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  activeLabel: string
  inactiveLabel: string
  ariaLabel?: string
  title?: string
}) {
  return (
    <button
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      title={title || (checked ? `Active: ${activeLabel}` : `Inactive: ${inactiveLabel}`)}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded border text-xs font-mono transition-all duration-150 focus-ring min-h-[44px] min-w-[76px] justify-center",
        checked
          ? "border-primary/50 bg-primary/10 text-primary font-bold"
          : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-border/80"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "w-2.5 h-2.5 rounded-full transition-colors shrink-0",
          checked ? "bg-primary animate-pulse" : "bg-muted-foreground"
        )}
      />
      {checked ? activeLabel : inactiveLabel}
    </button>
  )
}

export interface CategoryTileProps {
  id: string | null
  name: string
  questionCount: number
  selected: boolean
  onSelect: () => void
}

export function CategoryTile({ name, questionCount, selected, onSelect }: CategoryTileProps) {
  const ariaLabel = `Category: ${name}, ${questionCount} questions. ${
    selected ? "Currently selected sector filter." : "Click to select sector."
  }`

  const titleTooltip = `Filter practice pool to ${name} (${questionCount} questions)`

  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={ariaLabel}
      title={titleTooltip}
      className={cn(
        "flex flex-col gap-1.5 p-4 rounded border text-left transition-all duration-150 focus-ring min-h-[82px] justify-between group",
        selected
          ? "border-emerald-400/60 bg-emerald-400/5 text-foreground shadow-[0_0_10px_rgba(52,211,153,0.1)]"
          : "border-border bg-panel text-foreground/80 hover:border-border/80 hover:text-foreground"
      )}
    >
      <div className="flex items-start justify-between gap-1 w-full">
        <span className="text-sm font-semibold leading-snug text-pretty font-display">{name}</span>
        {selected && (
          <span className="text-emerald-400 text-xs font-mono font-bold shrink-0" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
      <span className={cn(
        "text-xs font-mono",
        selected ? "text-emerald-400 font-medium" : "text-muted-foreground"
      )}>
        {questionCount} qs
      </span>
    </button>
  )
}
