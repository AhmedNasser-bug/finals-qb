"use client"

import { useGameEngine } from "@/lib/game-engine"
import type { Question } from "@/lib/mold-types"
import { calculateGrade, formatLabel } from "@/lib/mold-types"
import * as React from "react"
import { cn } from "@/lib/utils"
import DOMPurify from "isomorphic-dompurify"
import { parseRichTextParts } from "@/components/mold/common/rich-text"
import { MermaidDiagram } from "@/components/mold/common/mermaid-diagram"
import { LightbulbIcon } from "@/components/mold/game/game-icons"
import { OptionButton } from "@/components/mold/game/question-card-components"
import { QuestionHeader, QuestionContent } from "@/components/mold/game/question-card-blocks"

export function QuestionCard({
  question,
  showHint,
}: {
  question: Question
  showHint: boolean
}) {
  const { state, selectOption, accuracyPct } = useGameEngine()
  const { selectedOption, isRevealed, currentIndex } = state

  const grade = calculateGrade(accuracyPct)
  const gradeColor =
    grade === "S+" || grade === "S" ? "#fecc17" :
      grade === "A+" || grade === "A" ? "#4ae176" :
        grade === "B+" ? "#67d7f0" :
          grade === "C+" ? "#fb8c00" : "#ffb4ab"

  // ── Diagram resolution (priority: dedicated field → inline rich-text) ─────
  // Path A: question.diagram is a direct Mermaid string → split layout, right pane
  // Path B: question.question embeds ```mermaid``` fences → parsed by rich-text
  const hasDedicatedDiagram = !!question.diagram
  const parts = React.useMemo(() => parseRichTextParts(question.question), [question.question])
  const hasInlineDiagram = !hasDedicatedDiagram && parts.some(p => p.type === "mermaid")
  const hasDiagram = hasDedicatedDiagram || hasInlineDiagram

  // For dedicated diagram: respect diagramPosition (default "right")
  const diagramBelow = hasDedicatedDiagram && question.diagramPosition === "below"

  // ── Shared: option button renderer ──────────────────────────────────────────
  const renderOptions = (cols: "single" | "split") => (
    <div
      className={cn(
        "grid gap-3",
        cols === "split" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      )}
      role="radiogroup"
      aria-label="Answer options"
    >
      {question.options.map((opt, idx) => {
        const isSelected = selectedOption === opt.label
        const isCorrect = opt.label === question.answer
        const isWrong = isRevealed && isSelected && !isCorrect
        const isDimmed = isRevealed && !isCorrect && !isSelected

        return (
          <OptionButton
            key={opt.label}
            idx={idx}
            label={opt.label}
            text={opt.text}
            isSelected={isSelected}
            isRevealed={isRevealed}
            isCorrect={isCorrect}
            isWrong={isWrong}
            isDimmed={isDimmed}
            onSelect={() => selectOption(opt.label)}
          />
        )
      })}
    </div>
  )

  // ── Shared: diagram renderer ──────────────────────────────────────────────
  const renderDiagram = (mode: "side" | "below") => {
    if (!hasDiagram) return null

    // Determine the raw chart string
    let chart = question.diagram
    if (!chart && hasInlineDiagram) {
      const mermaidPart = parts.find(p => p.type === "mermaid")
      chart = mermaidPart?.content
    }
    if (!chart) return null

    // Give it a stable ID so Mermaid doesn't re-render same ID with different content
    const diagId = `q-diag-${question.id}-${mode}`

    return (
      <div className="flex flex-col gap-2 h-full">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 select-none shrink-0">
          DIAGRAM_VISUAL
        </span>
        {/* overflow-hidden: SVG is clipped to column height — no scrollbar */}
        <div className="bg-[#131313] border border-[#4e4632]/60 p-3 flex-1 overflow-hidden">
          <MermaidDiagram
            chart={chart}
            id={diagId}
            className="w-full h-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-slide-up">
      {/* ── Main card ── */}
      <div className="relative flex-1 bg-[#1c1b1b] flex flex-col min-h-0">
        <div className="scanlines absolute inset-0 opacity-20 pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col flex-1 min-h-0 p-4 md:p-6 lg:p-8 gap-4">

          <QuestionHeader
            question={question}
            currentIndex={currentIndex}
            grade={grade}
            gradeColor={gradeColor}
          />

          <QuestionContent
            question={question}
            parts={parts}
            hasDedicatedDiagram={hasDedicatedDiagram}
            diagramBelow={diagramBelow}
            renderOptions={renderOptions}
            renderDiagram={renderDiagram}
          />

        </div>
      </div>

      {/* ── Hint / explanation panel ── */}
      {(showHint && question.hint) || (isRevealed && question.explanation) ? (
        <div className="bg-[#0e0e0e] px-6 py-4 flex items-start gap-4 animate-fade-in border-t border-[#2a2a2a] shrink-0" aria-live="polite">
          <LightbulbIcon className="w-4 h-4 text-[#fecc17] mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              {isRevealed ? "SYSTEM_EXPLANATION" : "SYSTEM_HINT"}
            </span>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed italic">
              &quot;{isRevealed ? question.explanation : question.hint}&quot;
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

