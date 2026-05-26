"use client"

import { useGameEngine } from "@/lib/game-engine"
import type { Question } from "@/lib/mold-types"
import { calculateGrade, formatLabel } from "@/lib/mold-types"
import * as React from "react"
import { cn } from "@/lib/utils"
import DOMPurify from "isomorphic-dompurify"
import { parseRichTextParts } from "./rich-text"
import { MermaidDiagram } from "./mermaid-diagram"
import { CheckCircleIcon, RadioIcon, LightbulbIcon, XIcon } from "./game-icons"

interface OptionButtonProps {
  idx: number;
  label: string;
  text?: string;
  isSelected: boolean;
  isRevealed: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}

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

          {/* Top metadata row — always full width */}
          <div className="flex justify-between items-start shrink-0">
            <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
              CHALLENGE_ID: {formatLabel(question.category ?? "")}_{String(currentIndex + 1).padStart(2, "0")}
            </span>
            <div className="text-right">
              <span
                className="font-mono text-4xl font-black tracking-tighter leading-none block"
                style={{ color: gradeColor }}
              >
                {grade}
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#4ae176]">
                CURRENT_PERFORMANCE
              </span>
            </div>
          </div>

          {/* ── Two-column split (side diagram) ────────────────────────────── */}
          {hasDiagram && !diagramBelow ? (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 lg:gap-8 flex-1 min-h-0">

              {/* LEFT: question text + options */}
              <div className="flex flex-col gap-4 overflow-y-auto min-h-0">
                <div className="space-y-2 shrink-0">
                  <h2 className="font-sans text-xl md:text-2xl font-bold text-[#e5e2e1] leading-tight tracking-tight text-pretty">
                    <span id={question.id}>
                      {hasDedicatedDiagram ? (
                        <span dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(question.question)
                        }} />
                      ) : (
                        parts.map((part: { type: string; content: string }, i: number) =>
                          part.type === "html" ? (
                            <span key={i} dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(part.content)
                            }} />
                          ) : null
                        )
                      )}
                    </span>
                  </h2>
                  <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                    {question.difficulty} &mdash; {question.type === "TrueFalse" ? "True / False" : "MCQ"}
                  </p>
                </div>
                {/* Options stacked vertically in left column */}
                {renderOptions("split")}
              </div>

              {/* RIGHT: diagram — fills column height, no scrollbar */}
              <div className="hidden lg:flex flex-col min-h-0 h-full">
                {renderDiagram("side")}
              </div>
              {/* Mobile: diagram below options */}
              <div className="lg:hidden">
                {renderDiagram("below")}
              </div>
            </div>

          ) : (
            /* ── Single-column (no diagram or diagram-below) ─────────────── */
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#e5e2e1] leading-tight tracking-tight text-pretty">
                  <span id={question.id}>
                    {hasDedicatedDiagram ? (
                      <span dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(question.question)
                      }} />
                    ) : (
                      parts.map((part: { type: string; content: string }, i: number) =>
                        part.type === "html" ? (
                          <span key={i} dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(part.content)
                          }} />
                        ) : null
                      )
                    )}
                  </span>
                </h2>
                <p className="font-sans text-sm text-zinc-400">
                  {question.difficulty} &mdash; {question.type === "TrueFalse" ? "True / False" : "Multiple Choice"}
                </p>
              </div>

              {/* Diagram stacked below question text */}
              {hasDedicatedDiagram && diagramBelow && (
                <div className="w-full">
                  {renderDiagram("below")}
                </div>
              )}

              {/* Options: 2-col grid in single-column layout */}
              {renderOptions("single")}
            </div>
          )}
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function OptionButton({
  idx,
  label,
  text,
  isSelected,
  isRevealed,
  isCorrect,
  isWrong,
  isDimmed,
  onSelect,
}: OptionButtonProps) {
  return (
    <button
      role="radio"
      aria-checked={isSelected}
      disabled={isRevealed}
      onClick={onSelect}
      className={cn(
        "relative flex items-start justify-between p-4 text-left transition-all duration-100 btn-depress group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17]",
        !isRevealed && !isSelected && "bg-[#2a2a2a] hover:bg-[#353534] border-l-4 border-transparent hover:border-[#4e4632]",
        !isRevealed && isSelected && "bg-[#2a2a2a] border-l-4 border-[#fecc17] glow-primary",
        isRevealed && isCorrect && "bg-[#4ae176]/10 border-l-4 border-[#4ae176]",
        isRevealed && isWrong && "bg-[#930013]/10 border-l-4 border-[#930013]",
        isDimmed && "bg-[#1c1b1b] border-l-4 border-transparent opacity-40",
      )}
    >
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className={cn(
          "font-mono text-[10px] tracking-widest uppercase",
          !isRevealed && isSelected ? "text-[#fecc17]" :
            isRevealed && isCorrect ? "text-[#4ae176]" :
              isRevealed && isWrong ? "text-[#ffb4ab]" :
                "text-zinc-500"
        )}>
          OPTION_{String(idx + 1).padStart(2, "0")}
        </span>
        <span className={cn(
          "font-mono text-sm font-bold leading-snug",
          !isRevealed && isSelected ? "text-[#fecc17]" :
            isRevealed && isCorrect ? "text-[#4ae176]" :
              isRevealed && isWrong ? "text-[#ffb4ab]" :
                isDimmed ? "text-zinc-600" :
                  "text-[#e5e2e1]"
        )}>
          {/* Fallback to label if text is undefined for compatibility with types */}
          {text ?? label}
        </span>
      </div>
      <div className="ml-3 mt-0.5 shrink-0">
        {isRevealed && isCorrect && <CheckCircleIcon className="w-5 h-5 text-[#fecc17]" />}
        {isRevealed && isWrong && <XIcon className="w-5 h-5 text-[#ffb4ab]" />}
        {!isRevealed && isSelected && <CheckCircleIcon className="w-5 h-5 text-[#fecc17]" />}
        {!isRevealed && !isSelected && <RadioIcon className="w-5 h-5 text-zinc-700" />}
      </div>
    </button>
  )
}
