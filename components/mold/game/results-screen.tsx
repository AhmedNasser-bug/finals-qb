"use client"

import { useGameEngine } from "@/lib/game-engine"
import { formatTime, calculateGrade, calculateAccuracy } from "@/lib/mold-types"
import * as React from "react"
import { cn } from "@/lib/utils"
import {
  StatsGrid,
  SequenceMap,
  ModulePerformance,
} from "@/components/mold/game/results-screen-components"

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
      <style>{`
        .grade-text-dynamic {
          color: ${gradeHex};
        }
        .grade-spotlight-dynamic {
          background-color: ${gradeHex};
        }
        .grade-glow-dynamic {
          box-shadow: 0 0 40px ${gradeHex}20;
        }
        .grade-letter-dynamic {
          font-size: clamp(72px, 10vw, 128px);
        }
      `}</style>
      <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 flex flex-col gap-8 md:gap-12">

        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--tw-hex-4e4632)]/30 pb-8">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <span className="font-mono text-xs tracking-[0.3em] text-[#4ae176] uppercase">
              QUIZ COMPLETE // {mode} // {config.difficulty}
            </span>
            <h1 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter text-[#e5e2e1] uppercase break-words break-all">
              QUIZ RESULTS
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">FINAL GRADE</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-6xl md:text-7xl font-black leading-none drop-shadow-[0_0_20px_rgba(254,204,23,0.2)] grade-text-dynamic">
                {grade}
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-xl text-[#e5e2e1] font-bold">{accuracyPct}%</span>
                <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">ACCURACY</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Result header ── */}
        <section className="flex flex-col items-center gap-6">
          <span className="font-mono text-[10px] tracking-[0.4em] text-[#fecc17] uppercase">
            QUIZ RESULTS
          </span>

          {/* Grade box */}
          <div className="relative">
            <div
              className="absolute inset-0 blur-3xl opacity-40 pointer-events-none grade-spotlight-dynamic"
            />
            <div className="relative w-48 h-48 md:w-64 md:h-64 bg-[#1c1b1b] flex items-center justify-center overflow-hidden grade-glow-dynamic">
              <div className="scanlines absolute inset-0 pointer-events-none opacity-20" />
              <span
                className="font-sans font-black leading-none tracking-tighter z-10 select-none text-[#ffedc2] grade-letter-dynamic"
              >
                {grade}
              </span>
            </div>
          </div>

          {/* Accuracy coefficient + segmented bar */}
          <div className="w-full max-w-2xl space-y-2">
            <div className="flex justify-between items-end">
              <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                ACCURACY RATE
              </span>
              <span className="font-mono text-2xl font-black grade-text-dynamic">
                {accuracyPct}%
              </span>
            </div>
            <div className="flex w-full gap-1 h-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-full transition-all duration-300",
                    i < filledSegments
                      ? "bg-[#4ae176] shadow-[0_0_8px_rgba(74,225,118,0.3)]"
                      : "bg-[#353534]"
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── 12-col grid: stat block + sequence map ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <StatsGrid
            elapsedSeconds={elapsedSeconds}
            avgTimeSec={avgTimeSec}
            bestStreak={bestStreak}
            xpYield={xpYield}
          />

          <SequenceMap
            pixels={pixels}
            total={total}
            pixelCount={pixelCount}
            score={score}
            wrongCountVal={wrongCountVal}
            skipCount={skipCount}
          />
        </div>

        {/* ── Module performance ── */}
        <ModulePerformance
          modules={modules}
          resolveGradeColor={resolveGradeColor}
        />

        {/* ── Bottom action HUD ── */}
        <footer className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--tw-hex-4e4632)]/10">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
              NEXT ACTION
            </span>
            <span className="font-sans text-sm font-medium text-[#e5e2e1]">
              Ready to continue?
            </span>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={onReturnHome}
              aria-label="Return home"
              title="Return home"
              className="flex-1 md:flex-none px-8 py-3 bg-[#353534] text-[#fecc17] font-mono text-xs font-black tracking-widest uppercase btn-depress hover:bg-[#3d3c3b] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c1b1b] rounded"
            >
              RETURN TO HOME
            </button>
            <button
              onClick={onPlayAgain}
              aria-label="Play again"
              title="Play again"
              className="flex-1 md:flex-none px-10 py-3 cta-gradient font-mono text-xs font-black tracking-widest uppercase btn-depress focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c1b1b] rounded border-glow"
            >
              PLAY AGAIN
            </button>
          </div>
        </footer>

      </div>
    </div>
  )
}
