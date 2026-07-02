"use client"

import React, { createContext, useContext } from "react"
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
  return (
    <ConfigControlsContext.Provider value={{ config, onChange }}>
      <div className="flex flex-col gap-4 p-5 rounded border border-border bg-panel">
        {children}
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
      <div className="flex flex-wrap items-center gap-1.5 justify-end">
        {options.map((n) => {
          const isPressed = config.questionCount === n
          const pressedProps = isPressed ? { "aria-pressed": true } : { "aria-pressed": false }
          return (
            <button
              key={n}
              onClick={() => onChange({ questionCount: n })}
              {...pressedProps}
              aria-label={`${n === 0 ? "All" : n} questions`}
              className={cn(
                "px-3 py-2 text-xs font-mono rounded border transition-colors focus-ring min-w-[44px] min-h-[44px]",
                isPressed
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground bg-secondary/20"
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
    <p className="text-xs font-mono text-muted-foreground py-1 leading-relaxed">
      Full Revision uses all{" "}
      <span className="text-foreground">questions in strict order.</span>{" "}
      No modifications available.
    </p>
  )
}

// Bind subcomponents statically
ConfigControls.TimeLimit = TimeLimitToggle
ConfigControls.HintSystem = HintSystemToggle
ConfigControls.QuestionCount = QuestionCountGroup
ConfigControls.RevisionNote = RevisionNote

// ─── Category Selection ──────────────────────────────────────────────────────

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
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs font-mono tracking-widest text-[#4ae176] uppercase">
        Target Sector
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
}: {
  checked: boolean
  onChange: (v: boolean) => void
  activeLabel: string
  inactiveLabel: string
  ariaLabel?: string
}) {
  const checkedProps = checked ? { "aria-checked": true } : { "aria-checked": false }
  return (
    <button
      role="switch"
      aria-label={ariaLabel}
      {...checkedProps}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded border text-xs font-mono transition-all duration-150 focus-ring min-h-[44px] min-w-[76px] justify-center",
        checked
          ? "border-primary/50 bg-primary/10 text-primary font-bold"
          : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-border/80"
      )}
    >
      <span
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
  const pressedProps = selected ? { "aria-pressed": true } : { "aria-pressed": false }
  return (
    <button
      onClick={onSelect}
      {...pressedProps}
      className={cn(
        "flex flex-col gap-1.5 p-4 rounded border text-left transition-all duration-150 focus-ring min-h-[82px] justify-between",
        selected
          ? "border-emerald-400/60 bg-emerald-400/5 text-foreground"
          : "border-border bg-panel text-foreground/80 hover:border-border/80 hover:text-foreground"
      )}
    >
      <span className="text-sm font-semibold leading-snug text-pretty font-display">{name}</span>
      <span className={cn(
        "text-xs font-mono",
        selected ? "text-emerald-400" : "text-muted-foreground"
      )}>
        {questionCount} qs
      </span>
    </button>
  )
}
