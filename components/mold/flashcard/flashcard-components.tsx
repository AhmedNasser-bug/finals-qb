import { cn } from "@/lib/utils"

export interface HeaderProps {
  onQuit: () => void
  progress: number
  position: string
  round: number
  confident: number
  learning: number
}

export function Header({
  onQuit,
  progress,
  position,
  round,
  confident,
  learning,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-panel px-4 py-3 flex flex-col gap-2">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground tracking-widest">FLASHCARDS</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
            ROUND {round}
          </span>
        </div>
        <button
          onClick={onQuit}
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-transparent hover:border-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          QUIT
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Rich stats rail */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">{position}</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-emerald-400/80">KNOWN {confident}</span>
          <span className="text-[10px] font-mono text-red-400/80">LEARNING {learning}</span>
        </div>
      </div>
    </header>
  )
}

export interface StatCellProps {
  label: string
  value: string
  color: string
  borderColor: string
}

export function StatCell({
  label,
  value,
  color,
  borderColor,
}: StatCellProps) {
  return (
    <div className={cn("flex flex-col gap-1 p-3 rounded border bg-panel", borderColor)}>
      <span className="text-[10px] font-mono text-muted-foreground tracking-wider">{label}</span>
      <span className={cn("text-xl font-mono font-bold", color)}>{value}</span>
    </div>
  )
}

export interface ScorePillProps {
  label: string
  count: number
  color: "emerald" | "red"
}

export function ScorePill({
  label,
  count,
  color,
}: ScorePillProps) {
  const cls = color === "emerald"
    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
    : "border-red-400/30 bg-red-400/10 text-red-400"

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded border", cls)}>
      <span className="text-lg font-mono font-bold">{count}</span>
      <span className="text-[10px] font-mono tracking-wider">{label}</span>
    </div>
  )
}

export interface DistributionBarProps {
  confident: number
  neutral: number
  learning: number
  total: number
}

export function DistributionBar({
  confident,
  neutral,
  learning,
  total,
}: DistributionBarProps) {
  const confPct = (confident / total) * 100
  const neutralPct = (neutral / total) * 100
  const learnPct = (learning / total) * 100

  return (
    <div className="h-3 rounded-full overflow-hidden flex bg-secondary">
      {confPct > 0 && (
        <div className="bg-emerald-400 transition-all duration-500" style={{ width: `${confPct}%` }} />
      )}
      {neutralPct > 0 && (
        <div className="bg-muted-foreground/30 transition-all duration-500" style={{ width: `${neutralPct}%` }} />
      )}
      {learnPct > 0 && (
        <div className="bg-red-400 transition-all duration-500" style={{ width: `${learnPct}%` }} />
      )}
    </div>
  )
}
