import * as React from "react"
import DOMPurify from "isomorphic-dompurify"
import { renderMath } from "@/lib/utils/math-renderer"
import { formatLabel } from "@/lib/mold-types"
import type { QuestionHeaderProps, QuestionContentProps } from "@/components/mold/game/question-card-types"

export function QuestionHeader({ question, currentIndex, grade, gradeColor }: QuestionHeaderProps) {
  return (
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
  )
}

export function QuestionContent({
  question,
  parts,
  hasDedicatedDiagram,
  diagramBelow,
  renderOptions,
  renderDiagram,
}: QuestionContentProps) {
  if (hasDedicatedDiagram || parts.some(p => p.type === "mermaid")) {
    if (!diagramBelow) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 lg:gap-8 flex-1 min-h-0">
          {/* LEFT: question text + options */}
          <div className="flex flex-col gap-4 overflow-y-auto min-h-0">
            <div className="space-y-2 shrink-0">
              <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground leading-tight tracking-tight text-pretty">
                <span id={question.id}>
                  {hasDedicatedDiagram ? (
                    <span dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(renderMath(question.question))
                    }} />
                  ) : (
                    parts.map((part, i) =>
                      part.type === "html" ? (
                        <span key={i} dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(renderMath(part.content))
                        }} />
                      ) : null
                    )
                  )}
                </span>
              </h2>
              <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
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
      )
    }
  }

  // Single-column (no diagram or diagram-below)
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h2 className="font-sans text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight text-pretty">
          <span id={question.id}>
            {hasDedicatedDiagram ? (
              <span dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMath(question.question))
              }} />
            ) : (
              parts.map((part, i) =>
                part.type === "html" ? (
                  <span key={i} dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(renderMath(part.content))
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
  )
}
