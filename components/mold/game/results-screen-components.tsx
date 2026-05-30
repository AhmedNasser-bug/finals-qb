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
