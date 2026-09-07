"use client"

import { GAME_MODES, type GameMode, type GameModeId } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface ModeSelectorProps {
  selected: GameModeId
  onSelect: (id: GameModeId) => void
  onLaunch?: () => void
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

export function ModeSelector({ selected, onSelect, onLaunch, className }: ModeSelectorProps) {
  const challengeModes = GAME_MODES.filter((m) => m.category === "challenge")
  const learningModes  = GAME_MODES.filter((m) => m.category === "learning")

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
          Choose Study Mode
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {/* Challenge group */}
        <ModeGroup
          label="Challenge Regimes"
          modes={challengeModes}
          selected={selected}
          onSelect={onSelect}
          onLaunch={onLaunch}
          accent="danger"
          startIndex={1}
        />
        {/* Learning group */}
        <ModeGroup
          label="Learning & Practice Modules"
          modes={learningModes}
          selected={selected}
          onSelect={onSelect}
          onLaunch={onLaunch}
          accent="success"
          startIndex={challengeModes.length + 1}
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
  onLaunch?: () => void
  accent: "danger" | "success"
  startIndex: number
}

function ModeGroup({ label, modes, selected, onSelect, onLaunch, accent, startIndex }: ModeGroupProps) {
  const accentClass = accent === "danger" ? "text-destructive" : "text-emerald-400"
  const borderSelectedClass = accent === "danger"
    ? "border-destructive/60 bg-destructive/5"
    : "border-emerald-400/60 bg-emerald-400/5"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className={cn("text-xs font-mono tracking-wider font-semibold", accentClass)}>
          {label}
        </p>
        <span className="text-[10px] font-mono text-muted-foreground">
          {modes.length} MODES
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modes.map((mode, idx) => {
          const isLastAndOdd = idx === modes.length - 1 && modes.length % 2 !== 0
          return (
            <div key={mode.id} className={cn(isLastAndOdd && "sm:col-span-2")}>
              <ModeCard
                mode={mode}
                indexNumber={startIndex + idx}
                icon={MODE_ICONS[mode.id]}
                isSelected={selected === mode.id}
                onSelect={onSelect}
                onLaunch={onLaunch}
                selectedClass={borderSelectedClass}
                accentClass={accentClass}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ModeCardProps {
  mode: GameMode
  indexNumber: number
  icon: React.ReactNode
  isSelected: boolean
  onSelect: (id: GameModeId) => void
  onLaunch?: () => void
  selectedClass: string
  accentClass: string
}

function ModeCard({
  mode,
  indexNumber,
  icon,
  isSelected,
  onSelect,
  onLaunch,
  selectedClass,
  accentClass,
}: ModeCardProps) {
  // Custom tag styling based on semantic tokens
  let tagBg = "bg-secondary text-muted-foreground border-border"
  if (mode.id === "practice") {
    tagBg = "bg-primary/10 text-primary border-primary/30"
  } else if (mode.id === "flashcards") {
    tagBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
  } else if (mode.category === "challenge") {
    tagBg = "bg-destructive/10 text-destructive border-destructive/30"
  } else {
    tagBg = "bg-purple-500/10 text-purple-400 border-purple-500/30"
  }

  const tooltipTitle = `Mode: ${mode.label} (${mode.tag.toUpperCase()}) — ${mode.description}. ${
    isSelected ? "Currently selected. Click again or double-click to start immediately." : "Click to select this mode."
  }`

  const ariaLabel = `${mode.label} mode, ${mode.tag} tag, index ${indexNumber}. ${mode.description}. ${
    isSelected ? "Active mode. Press Enter to launch." : "Click to select."
  }`

  return (
    <button type="button"
      onClick={() => {
        if (isSelected && onLaunch) {
          onLaunch()
        } else {
          onSelect(mode.id)
        }
      }}
      onDoubleClick={() => {
        onSelect(mode.id)
        if (onLaunch) onLaunch()
      }}
      aria-pressed={isSelected}
      aria-label={ariaLabel}
      title={tooltipTitle}
      className={cn(
        "group relative flex flex-col gap-4 p-5 rounded border text-left transition-all duration-200 focus-ring min-h-[160px] justify-between cursor-pointer w-full",
        isSelected
          ? "border-primary bg-panel border-glow shadow-[0_0_18px_hsla(var(--primary),0.08)]"
          : "border-border bg-panel/60 hover:border-border/80 hover:bg-panel"
      )}
    >
      <div className="flex items-start justify-between gap-2 w-full select-none">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "shrink-0 p-1.5 rounded bg-secondary border border-border group-hover:scale-110 transition-transform duration-200",
              isSelected ? "text-primary border-primary/30" : "text-muted-foreground"
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
          <span className="text-[10px] font-mono font-bold text-muted-foreground/60 border border-border/50 px-1 py-0.2 rounded" aria-hidden="true">
            [{indexNumber}]
          </span>
        </div>
        <span
          className={cn(
            "text-[9px] font-mono px-2 py-0.5 border leading-none shrink-0 font-bold uppercase tracking-wider rounded-sm",
            tagBg
          )}
          title={`Tag: ${mode.tag}`}
        >
          {mode.tag.toUpperCase()}
        </span>
      </div>

      <div className="space-y-1.5">
        <p
          className={cn(
            "text-base font-bold leading-tight font-display uppercase tracking-tight",
            isSelected ? "text-foreground" : "text-foreground/90 group-hover:text-foreground transition-colors"
          )}
        >
          {mode.label}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed font-sans font-medium line-clamp-2">
          {mode.description}
        </p>
      </div>

      <div
        className={cn(
          "font-mono text-[9px] uppercase tracking-widest border-t border-border/60 pt-2.5 w-full transition-all duration-200 font-bold flex items-center justify-between",
          isSelected ? "text-primary animate-pulse" : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        <span>{isSelected ? "⚡ CLICK AGAIN TO START" : "SELECT MODE"}</span>
        <span aria-hidden="true">➔</span>
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
