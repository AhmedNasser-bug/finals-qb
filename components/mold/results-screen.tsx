"use client"

import { useGameEngine } from "@/lib/game-engine"
import { calculateGrade, calculateAccuracy } from "@/lib/mold-types"
import * as React from "react"
import {
  StatsGrid,
  SequenceMap,
  ModulePerformance,
  ResultsHeader,
  EvaluationSummary,
  ResultsFooter,
} from "./results-screen-components"

export interface ResultsScreenProps {
  onReturnHome: () => void
  onPlayAgain: () => void
}

export function ResultsScreen({ onReturnHome, onPlayAgain }: ResultsScreenProps) {
  const { state } = useGameEngine()
  const { score, questions, bestStreak, elapsedSeconds, mode, config } = state

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

        <ResultsHeader
          mode={mode}
          difficulty={(config as any)?.difficulty ?? "STANDARD"}
          gradeHex={gradeHex}
          grade={grade}
          accuracyPct={accuracyPct}
        />

        <EvaluationSummary
          gradeHex={gradeHex}
          grade={grade}
          accuracyPct={accuracyPct}
          filledSegments={filledSegments}
        />

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

        <ModulePerformance
          modules={modules}
          resolveGradeColor={resolveGradeColor}
        />

        <ResultsFooter
          onReturnHome={onReturnHome}
          onPlayAgain={onPlayAgain}
        />

      </div>
    </div>
  )
}
