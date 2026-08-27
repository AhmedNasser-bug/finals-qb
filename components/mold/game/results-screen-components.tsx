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
    <div className="lg:col-span-4 grid grid-cols-2 gap-[1px] bg-border/20">
      <div className="bg-[#1c1b1b] p-6 flex flex-col justify-between h-32">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">TIME ELAPSED</span>
        <span className="font-mono text-xl text-[#e5e2e1]">
          {elapsedSeconds > 0 ? formatTime(elapsedSeconds) : "0:00"}
        </span>
      </div>
      <div className="bg-[#1c1b1b] p-6 flex flex-col justify-between h-32">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">AVG. TIME / QUESTION</span>
        <span className="font-mono text-xl text-[#e5e2e1]">
          {avgTimeSec !== null ? `${avgTimeSec}S` : "—"}
        </span>
      </div>
      <div className="bg-[#1c1b1b] p-6 flex flex-col justify-between h-32">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">BEST STREAK</span>
        <span className="font-mono text-xl text-[#fecc17]">{bestStreak}</span>
      </div>
      <div className="bg-[#1c1b1b] p-6 flex flex-col justify-between h-32">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">POINTS EARNED</span>
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
            QUESTION RESULTS MAP
          </h3>
          <span className="font-mono text-[10px] tracking-widest text-zinc-500">
            QUESTION INDEX: {String(1).padStart(3, "0")} - {String(total).padStart(3, "0")}
          </span>
        </div>

        {/* Pixel grid — up to 100 cells, auto-cols to fit container */}
        <style>{`
          .seq-map-grid {
            grid-template-columns: repeat(${Math.min(pixelCount, 20)}, 1fr);
          }
        `}</style>
        <div className="grid gap-[4px] seq-map-grid">
          {pixels.map((state, i) => (
            <div
              key={i}
              title={`Q${i + 1}: ${state === "correct" ? "Correct" : state === "wrong" ? "Wrong" : "Skipped"}`}
              className={cn(
                "aspect-square rounded-[2px]",
                state === "correct" ? "bg-[#4ae176]" :
                  state === "wrong" ? "bg-[#93000a]" :
                    "bg-[#353534]"
              )}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#4ae176]" />
            <span className="font-mono text-[10px] tracking-widest text-zinc-400">
              CORRECT [{score}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#93000a]" />
            <span className="font-mono text-[10px] tracking-widest text-zinc-400">
              WRONG [{wrongCountVal}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#353534]" />
            <span className="font-mono text-[10px] tracking-widest text-zinc-400">
              SKIPPED [{skipCount}]
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
      <style>{`
        ${modules.map((mod) => `
          .mod-color-${mod.id} {
            color: ${resolveGradeColor(mod.grade)};
          }
          .mod-bar-fill-${mod.id} {
            width: ${mod.pct}%;
            background-color: ${resolveGradeColor(mod.grade)};
          }
        `).join("\n")}
      `}</style>
      <h2 className="font-sans font-bold text-xl tracking-tight uppercase text-[#e5e2e1]">
        CATEGORY SUMMARY
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
                <span className="font-mono text-[10px] text-zinc-500 uppercase">ACCURACY</span>
                <span className={cn("font-mono text-base font-black", `mod-color-${mod.id}`)}>
                  {mod.grade}
                </span>
              </div>
              <div
                className="h-[2px] w-full bg-[#353534] cursor-help"
                role="progressbar"
                aria-valuenow={mod.pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${mod.name} accuracy progress`}
                title={`${mod.name} accuracy: ${mod.pct}%`}
              >
                <div className={cn("h-full transition-all duration-700 ease-out", `mod-bar-fill-${mod.id}`)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
