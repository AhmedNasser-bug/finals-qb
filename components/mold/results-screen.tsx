"use client"

import { useGameEngine } from "@/lib/game-engine"
import { formatTime, calculateGrade, calculateAccuracy } from "@/lib/mold-types"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ResultsScreenProps {
  onReturnHome: () => void
  onPlayAgain: () => void
}

export function ResultsScreen({ onReturnHome, onPlayAgain }: ResultsScreenProps) {
  const { state } = useGameEngine()
  const { score, questions, bestStreak, elapsedSeconds, mode, config, hintsUsedTotal } = state

  const total = questions.length
  const answers = state.answers ?? []

  // Only count questions that were actually answered (true = correct, false = wrong).
  // Undefined entries are unanswered/skipped and must not inflate or deflate accuracy.
  const wrongCountVal = answers.filter((a) => a === false).length
  const accuracyPct = calculateAccuracy(score, wrongCountVal)
  const grade = calculateGrade(accuracyPct)

  const skipCount = answers.filter((a) => a === undefined).length

  // Grade color — must match the LetterGrade values returned by calculateGrade()
  // ("S+", "S", "A+", "A", "B+", "C+", "D+", "F") not bare "B" / "C".
  function resolveGradeColor(g: string): string {
    if (g === "S+" || g === "S") return "#fecc17"
    if (g === "A+" || g === "A") return "#4ae176"
    if (g === "B+") return "#67d7f0"
    if (g === "C+") return "#fb8c00"
    return "#ffb4ab" // D+, F
  }

  const gradeHex = resolveGradeColor(grade)

  // Accuracy bar: 10 segments, each represents 10% — filled count proportional to accuracy
  const filledSegments = Math.round((accuracyPct / 100) * 10)

  // XP yield — score-weighted formula
  const xpYield = Math.round(accuracyPct * 18 + bestStreak * 12)

  // Avg time per question in seconds (more useful than synthetic "latency" in ms)
  const answeredCount = score + wrongCountVal
  const avgTimeSec = answeredCount > 0 ? (elapsedSeconds / answeredCount).toFixed(1) : null

  // Module performance: group questions by category.
  // Using question index to align with answers[] array correctly.
  const categoryMap: Record<string, { correct: number; total: number }> = {}
  questions.forEach((q, i) => {
    const cat = q.category ?? "GENERAL"
    if (!categoryMap[cat]) categoryMap[cat] = { correct: 0, total: 0 }
    categoryMap[cat].total++
    if (answers[i] === true) categoryMap[cat].correct++
  })
  const modules = Object.entries(categoryMap).slice(0, 3).map(([cat, s], idx) => ({
    id: `MOD_${String(idx + 1).padStart(2, "0")}`,
    name: cat.replace(/_/g, " "),
    pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    grade: calculateGrade(s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0),
  }))

  // Pixel map: array of "correct", "wrong", "skipped" for every question
  const pixels = answers.map(a => a === true ? "correct" : a === false ? "wrong" : "skipped")

  // If there are thousands of questions, cap the UI rendering to prevent lag.
  // The grade/score logic remains accurate for the full set.
  const MAX_PIXELS = 100
  if (pixels.length > MAX_PIXELS) {
    pixels.length = MAX_PIXELS
  } else {
    // Ensure we render exactly `total` pixels even if answers is somehow short (up to 100)
    while (pixels.length < Math.min(total, MAX_PIXELS)) pixels.push("skipped")
  }
  const pixelCount = pixels.length

  return (
    <div className="flex-1 bg-[#131313] overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 flex flex-col gap-8 md:gap-12">

        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#4e4632]/30 pb-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.3em] text-[#4ae176] uppercase">
              SESSION_COMPLETE // {mode} // {config.difficulty}
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

        {/* ── Result header ── */}
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

        {/* ── 12-col grid: stat block + sequence map ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stats 2×2 */}
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

          {/* SESSION_SEQUENCE_MAP */}
          <div className="lg:col-span-8 bg-[#1c1b1b] p-6 md:p-8 relative overflow-hidden">
            <div className="scanlines absolute inset-0 pointer-events-none opacity-5" />
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
        </div>

        {/* ── Module performance ── */}
        {modules.length > 0 && (
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
        )}

        {/* ── Bottom action HUD ── */}
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

      </div>
    </div>
  )
}
