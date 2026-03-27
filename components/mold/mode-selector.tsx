"use client"

import { GAME_MODES, type GameMode, type GameModeId } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface ModeSelectorProps {
  selected: GameModeId
  onSelect: (id: GameModeId) => void
  className?: string
}

const MODE_ICONS: Record<GameModeId, React.ReactNode> = {
  speedrun:      <SpeedrunIcon />,
  blitz:         <BlitzIcon />,
  hardcore:      <HardcoreIcon />,
  survival:      <SurvivalIcon />,
  practice:      <PracticeIcon />,
  flashcards:    <FlashcardsIcon />,
  "full-revision": <FullRevisionIcon />,
}

export function ModeSelector({ selected, onSelect, className }: ModeSelectorProps) {
  const challengeModes = GAME_MODES.filter((m) => m.category === "challenge")
  const learningModes  = GAME_MODES.filter((m) => m.category === "learning")

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
          Operational Mode
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {/* Challenge group */}
        <ModeGroup
          label="Challenge Modes"
          modes={challengeModes}
          selected={selected}
          onSelect={onSelect}
          accent="danger"
        />
        {/* Learning group */}
        <ModeGroup
          label="Learning Modes"
          modes={learningModes}
          selected={selected}
          onSelect={onSelect}
          accent="success"
        />
      </div>
    </section>
  )
}

interface ModeGroupProps {
  label: string
  modes: GameMode[]
  selected: GameModeId
  onSelect: (id: GameModeId) => void
  accent: "danger" | "success"
}

function ModeGroup({ label, modes, selected, onSelect, accent }: ModeGroupProps) {
  const accentClass = accent === "danger" ? "text-red-400" : "text-emerald-400"
  const borderSelectedClass = accent === "danger"
    ? "border-red-400/60 bg-red-400/5"
    : "border-emerald-400/60 bg-emerald-400/5"

  return (
    <div className="flex flex-col gap-2">
      <p className={cn("text-xs font-mono tracking-wider", accentClass)}>{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((mode) => (
          <ModeCard
            key={mode.id}
            mode={mode}
            icon={MODE_ICONS[mode.id]}
            isSelected={selected === mode.id}
            onSelect={onSelect}
            selectedClass={borderSelectedClass}
            accentClass={accentClass}
          />
        ))}
      </div>
    </div>
  )
}

interface ModeCardProps {
  mode: GameMode
  icon: React.ReactNode
  isSelected: boolean
  onSelect: (id: GameModeId) => void
  selectedClass: string
  accentClass: string
}

function ModeCard({ mode, icon, isSelected, onSelect, selectedClass, accentClass }: ModeCardProps) {
  return (
    <button
      onClick={() => onSelect(mode.id)}
      className={cn(
        "group relative flex flex-col gap-2 p-3 rounded border text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? cn("border-opacity-60", selectedClass)
          : "border-border bg-panel hover:border-border/80 hover:bg-secondary/60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("shrink-0", isSelected ? accentClass : "text-muted-foreground group-hover:text-foreground transition-colors")}>
          {icon}
        </span>
        <span className={cn(
          "text-[10px] font-mono px-1.5 py-0.5 rounded-sm border leading-none",
          isSelected
            ? cn("border-current", accentClass)
            : "border-border text-muted-foreground"
        )}>
          {mode.tag}
        </span>
      </div>
      <div>
        <p className={cn(
          "text-sm font-semibold leading-none mb-1 transition-colors",
          isSelected ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
        )}>
          {mode.label}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {mode.description}
        </p>
      </div>
    </button>
  )
}

// ─── Inline SVG icons (no emoji) ─────────────────────────────────────────────

function SpeedrunIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function BlitzIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
function HardcoreIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}
function SurvivalIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function PracticeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
function FlashcardsIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
function FullRevisionIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}
