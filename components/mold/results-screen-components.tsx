import * as React from "react"
import { formatTime } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

// ─── Stats Grid ──────────────────────────────────────────────────────────────

export interface StatsGridProps {
  elapsedSeconds: number
  avgTimeSec: string | null
  bestStreak: number
  xpYield: number
}

export function StatsGrid({ elapsedSeconds, avgTimeSec, bestStreak, xpYield }: StatsGridProps) {
  return (
    <div className="lg:col-span-4 grid grid-cols-2 gap-[1px] bg-[#4e4632]/10">
      <div className="bg-[#1c1b1b] p-6 flex flex-col justify-between h-32">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">TIME_ELAPSED</span>
        <span className="font-mono text-xl text-[#e5e2e1]">
          {elapsedSeconds > 0 ? formatTime(elapsedSeconds) : "0:00"}
        </span>
      </div>
      <div className="bg-[#1c1b1b] p-6 flex flex-col justify-between h-32">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">AVG_TIME/Q</span>
        <span className="font-mono text-xl text-[#e5e2e1]">
          {avgTimeSec !== null ? `${avgTimeSec}S` : "—"}
        </span>
      </div>
      <div className="bg-[#1c1b1b] p-6 flex flex-col justify-between h-32">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">STREAK_MAX</span>
        <span className="font-mono text-xl text-[#fecc17]">{bestStreak}</span>
      </div>
      <div className="bg-[#1c1b1b] p-6 flex flex-col justify-between h-32">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">XP_YIELD</span>
        <span className="font-mono text-xl text-[#4ae176]">+{xpYield.toLocaleString()}</span>
      </div>
    </div>
  )
}

// ─── Sequence Map ────────────────────────────────────────────────────────────

export interface SequenceMapProps {
  pixels: ("correct" | "wrong" | "skipped")[]
  total: number
  pixelCount: number
  score: number
  wrongCountVal: number
  skipCount: number
}

export function SequenceMap({ pixels, total, pixelCount, score, wrongCountVal, skipCount }: SequenceMapProps) {
  return (
    <div className="lg:col-span-8 bg-[#1c1b1b] p-6 md:p-8 relative overflow-hidden">
      <div className="scanlines absolute inset-0 pointer-events-none opacity-5" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="font-sans font-bold text-lg tracking-tight uppercase text-[#e5e2e1]">
            SESSION_SEQUENCE_MAP
          </h3>
          <span className="font-mono text-[10px] tracking-widest text-zinc-500">
            Q_INDEX: {String(1).padStart(3, "0")} - {String(total).padStart(3, "0")}
          </span>
        </div>

        {/* Pixel grid — up to 100 cells, auto-cols to fit container */}
        <div
          className="grid gap-[4px]"
          style={{ gridTemplateColumns: `repeat(${Math.min(pixelCount, 20)}, 1fr)` }}
        >
          {pixels.map((state, i) => (
            <div
              key={i}
              title={`Q${i + 1}: ${state === "correct" ? "Correct" : state === "wrong" ? "Wrong" : "Skipped"}`}
              className="aspect-square"
              style={{
                backgroundColor:
                  state === "correct" ? "rgba(74,225,118,0.8)" :
                    state === "wrong" ? "#93000a" :
                      "#353534",
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#4ae176]" />
            <span className="font-mono text-[10px] tracking-widest text-zinc-400">
              SUCCESS [{score}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#93000a]" />
            <span className="font-mono text-[10px] tracking-widest text-zinc-400">
              CRITICAL_ERR [{wrongCountVal}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#353534]" />
            <span className="font-mono text-[10px] tracking-widest text-zinc-400">
              VOID/SKIP [{skipCount}]
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Module Performance ──────────────────────────────────────────────────────

export interface ModulePerformanceProps {
  modules: {
    id: string
    name: string
    pct: number
    grade: string
  }[]
  resolveGradeColor: (g: string) => string
}

export function ModulePerformance({ modules, resolveGradeColor }: ModulePerformanceProps) {
  if (modules.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-sans font-bold text-xl tracking-tight uppercase text-[#e5e2e1]">
        MODULE_PERFORMANCE
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-[#201f1f] p-6 relative flex flex-col gap-4">
            <span className="absolute top-2 right-2 font-mono text-[10px] text-zinc-600">
              {mod.id}
            </span>
            <h4 className="font-sans font-semibold text-sm text-zinc-300 uppercase tracking-wide">
              {mod.name}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-mono text-[10px] text-zinc-500 uppercase">EFFICIENCY</span>
                <span
                  className="font-mono text-base font-black"
                  style={{ color: resolveGradeColor(mod.grade) }}
                >
                  {mod.grade}
                </span>
              </div>
              <div className="h-[2px] w-full bg-[#353534]">
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{
                    width: `${mod.pct}%`,
                    backgroundColor: resolveGradeColor(mod.grade),
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export interface ResultsHeaderProps {
  mode: string;
  difficulty: string;
  gradeHex: string;
  grade: string;
  accuracyPct: number;
}

export function ResultsHeader({
  mode,
  difficulty,
  gradeHex,
  grade,
  accuracyPct,
}: ResultsHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#4e4632]/30 pb-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-[0.3em] text-[#4ae176] uppercase">
          SESSION_COMPLETE // {mode} // {difficulty}
        </span>
        <h1 className="font-sans font-black text-4xl md:text-6xl tracking-tighter text-[#e5e2e1] uppercase">
          DIAGNOSTIC_REPORT
        </h1>
      </div>
      <div className="flex flex-col items-start md:items-end gap-1">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">FINAL_EVALUATION</span>
        <div className="flex items-center gap-4">
          <span className="font-mono text-6xl md:text-7xl font-black leading-none drop-shadow-[0_0_20px_rgba(254,204,23,0.2)]" style={{ color: gradeHex }}>
            {grade}
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-xl text-[#e5e2e1] font-bold">{accuracyPct}%</span>
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">SYNCHRONIZATION</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export interface EvaluationSummaryProps {
  gradeHex: string;
  grade: string;
  accuracyPct: number;
  filledSegments: number;
}

export function EvaluationSummary({
  gradeHex,
  grade,
  accuracyPct,
  filledSegments,
}: EvaluationSummaryProps) {
  return (
    <section className="flex flex-col items-center gap-6">
      <span className="font-mono text-[10px] tracking-[0.4em] text-[#fecc17] uppercase">
        SESSION_COMPLETE // EVALUATION_RESULT
      </span>

      {/* Grade box */}
      <div className="relative">
        <div
          className="absolute inset-0 blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: gradeHex }}
        />
        <div className="relative w-48 h-48 md:w-64 md:h-64 bg-[#1c1b1b] flex items-center justify-center overflow-hidden"
          style={{ boxShadow: `0 0 40px ${gradeHex}20` }}
        >
          <div className="scanlines absolute inset-0 pointer-events-none opacity-20" />
          <span
            className="font-sans font-black leading-none tracking-tighter z-10 select-none"
            style={{ fontSize: "clamp(72px, 10vw, 128px)", color: "#ffedc2" }}
          >
            {grade}
          </span>
        </div>
      </div>

      {/* Accuracy coefficient + segmented bar */}
      <div className="w-full max-w-2xl space-y-2">
        <div className="flex justify-between items-end">
          <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            ACCURACY_COEFFICIENT
          </span>
          <span className="font-mono text-2xl font-black" style={{ color: gradeHex }}>
            {accuracyPct}%
          </span>
        </div>
        <div className="flex w-full gap-1 h-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              style={{
                backgroundColor: i < filledSegments ? "#4ae176" : "#353534",
                boxShadow: i < filledSegments ? "0 0 8px rgba(74,225,118,0.3)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export interface ResultsFooterProps {
  onReturnHome: () => void;
  onPlayAgain: () => void;
}

export function ResultsFooter({
  onReturnHome,
  onPlayAgain,
}: ResultsFooterProps) {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#4e4632]/10">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
          SYSTEM_ACTION_READY
        </span>
        <span className="font-sans text-sm font-medium text-[#e5e2e1]">
          TERMINATE_OR_REITERATE?
        </span>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <button
          onClick={onReturnHome}
          className="flex-1 md:flex-none px-8 py-3 bg-[#353534] text-[#fecc17] font-mono text-xs font-black tracking-widest uppercase btn-depress hover:bg-[#3d3c3b] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c1b1b] rounded"
        >
          DUMP_LOGS
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-1 md:flex-none px-10 py-3 cta-gradient font-mono text-xs font-black tracking-widest uppercase btn-depress focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c1b1b] rounded"
          style={{ boxShadow: "0 0 25px rgba(254,204,23,0.15)" }}
        >
          CONTINUE_CYCLE
        </button>
      </div>
    </footer>
  )
}
