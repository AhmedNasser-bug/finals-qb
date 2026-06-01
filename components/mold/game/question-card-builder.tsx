"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import DOMPurify from "isomorphic-dompurify"
import { useQuestionCard, QuestionCardContext } from "@/lib/question-card-context"
import { calculateGrade, formatLabel, gradeColor } from "@/lib/mold-types"
import { parseRichTextParts } from "@/components/mold/common/rich-text"
import { MermaidDiagram } from "@/components/mold/common/mermaid-diagram"
import { CheckCircleIcon, RadioIcon, LightbulbIcon, XIcon } from "@/components/mold/game/game-icons"

// ─── Main Compound Component Object ──────────────────────────────────────────

export const QuestionCard = {
  Provider: QuestionCardProvider,
  Frame: QuestionCardFrame,
  Header: QuestionCardHeader,
  Counter: QuestionCardCounter,
  Telemetry: QuestionCardTelemetry,
  Specimen: QuestionCardSpecimen,
  HtmlContent: QuestionCardHtmlContent,
  MermaidDiagram: QuestionCardMermaidDiagram,
  Options: QuestionCardOptions,
  Footer: QuestionCardFooter,
}

// ─── Provider & Frame ──────────────────────────────────────────────────────────

function QuestionCardProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: import("@/lib/question-card-context").QuestionCardContextValue
}) {
  return (
    <QuestionCardContext.Provider value={value}>
      {children}
    </QuestionCardContext.Provider>
  )
}

function QuestionCardFrame({ children }: { children: React.ReactNode }) {
  const { state } = useQuestionCard()
  const { currentQuestion } = state

  const hasDedicatedDiagram = !!currentQuestion?.diagram
  const parts = React.useMemo(() => currentQuestion ? parseRichTextParts(currentQuestion.question) : [], [currentQuestion?.question])
  const hasInlineDiagram = !hasDedicatedDiagram && parts.some(p => p.type === "mermaid")
  const hasDiagram = hasDedicatedDiagram || hasInlineDiagram
  const diagramBelow = hasDedicatedDiagram && currentQuestion.diagramPosition === "below"
  const needsStretch = hasDiagram && !diagramBelow

  return (
    <div className={cn(
      "flex flex-col animate-slide-up w-full",
      needsStretch ? "flex-1 min-h-0" : "max-w-3xl mx-auto my-auto"
    )}>
      <div className={cn(
        "relative bg-[#1c1b1b] border border-border flex flex-col min-h-0 rounded",
        needsStretch ? "flex-1" : "shadow-xl border-zinc-800/80"
      )}>
        <div className="scanlines absolute inset-0 opacity-20 pointer-events-none z-0" />
        <div className={cn(
          "relative z-10 flex flex-col min-h-0 gap-4",
          needsStretch ? "flex-1 p-4 md:p-6 lg:p-8" : "p-6 md:p-8"
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Header & Telemetry ────────────────────────────────────────────────────────

function QuestionCardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start shrink-0 gap-4">
      {children}
    </div>
  )
}

function QuestionCardCounter() {
  const { state } = useQuestionCard()
  const { currentQuestion, currentIndex } = state
  return (
    <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
      CHALLENGE_ID: {formatLabel(currentQuestion.category ?? "")}_{String(currentIndex + 1).padStart(2, "0")}
    </span>
  )
}

function QuestionCardTelemetry({
  showSkills = false,
  accuracyPct = 0,
}: {
  showSkills?: boolean
  accuracyPct?: number
}) {
  const grade = calculateGrade(accuracyPct)
  return (
    <div className="text-right shrink-0">
      <span
        className={cn(
          "font-mono text-4xl font-black tracking-tighter leading-none block",
          gradeColor(grade)
        )}
      >
        {grade}
      </span>
      <span className="font-mono text-[9px] tracking-widest uppercase text-[#4ae176]">
        {showSkills ? "MASTERY_TELEMETRY" : "CURRENT_PERFORMANCE"}
      </span>
    </div>
  )
}

// ─── Specimen & Prompt Renders ──────────────────────────────────────────────────

function QuestionCardSpecimen({ children }: { children: React.ReactNode }) {
  const { state } = useQuestionCard()
  const { currentQuestion } = state

  // Resolve diagram existence
  const hasDedicatedDiagram = !!currentQuestion.diagram
  const parts = React.useMemo(() => parseRichTextParts(currentQuestion.question), [currentQuestion.question])
  const hasInlineDiagram = !hasDedicatedDiagram && parts.some(p => p.type === "mermaid")
  const hasDiagram = hasDedicatedDiagram || hasInlineDiagram
  const diagramBelow = hasDedicatedDiagram && currentQuestion.diagramPosition === "below"

  if (hasDiagram && !diagramBelow) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 lg:gap-8 flex-1 min-h-0">
        {children}
      </div>
    )
  }

  return <div className="flex flex-col gap-4 flex-1 min-h-0">{children}</div>
}

function QuestionCardHtmlContent() {
  const { state } = useQuestionCard()
  const { currentQuestion } = state

  const hasDedicatedDiagram = !!currentQuestion.diagram
  const parts = React.useMemo(() => parseRichTextParts(currentQuestion.question), [currentQuestion.question])

  return (
    <div className="space-y-2 shrink-0">
      <h2 className="font-sans text-xl md:text-2xl font-bold text-[#e5e2e1] leading-tight tracking-tight text-pretty">
        <span id={currentQuestion.id}>
          {hasDedicatedDiagram ? (
            <span dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(currentQuestion.question)
            }} />
          ) : (
            parts.map((part, i) =>
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
        {currentQuestion.difficulty} &mdash; {currentQuestion.type === "TrueFalse" ? "True / False" : "MCQ"}
      </p>
    </div>
  )
}

function QuestionCardMermaidDiagram({ mode = "side" }: { mode?: "side" | "below" }) {
  const { state } = useQuestionCard()
  const { currentQuestion } = state

  const hasDedicatedDiagram = !!currentQuestion.diagram
  const parts = React.useMemo(() => parseRichTextParts(currentQuestion.question), [currentQuestion.question])
  const hasInlineDiagram = !hasDedicatedDiagram && parts.some(p => p.type === "mermaid")
  const hasDiagram = hasDedicatedDiagram || hasInlineDiagram

  if (!hasDiagram) return null

  let chart = currentQuestion.diagram
  if (!chart && hasInlineDiagram) {
    const mermaidPart = parts.find(p => p.type === "mermaid")
    chart = mermaidPart?.content
  }
  if (!chart) return null

  const diagId = `q-diag-${currentQuestion.id}-${mode}`

  const inner = (
    <div className="flex flex-col gap-2 h-full">
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 select-none shrink-0">
        DIAGRAM_VISUAL
      </span>
      <div className="bg-[#131313] border border-[var(--tw-hex-4e4632)]/60 p-3 flex-1 overflow-hidden">
        <MermaidDiagram
          chart={chart}
          id={diagId}
          className="w-full h-full"
        />
      </div>
    </div>
  )

  if (mode === "side") {
    return <div className="hidden lg:flex flex-col min-h-0 h-full">{inner}</div>
  }

  return <div className="lg:hidden w-full">{inner}</div>
}

// ─── Interactive Inputs ────────────────────────────────────────────────────────

function QuestionCardOptions({ cols = "single" }: { cols?: "single" | "split" | "auto" }) {
  const { state, actions } = useQuestionCard()
  const { currentQuestion, selectedOption, isRevealed } = state

  const hasDedicatedDiagram = !!currentQuestion.diagram
  const parts = React.useMemo(() => parseRichTextParts(currentQuestion.question), [currentQuestion.question])
  const hasDiagram = hasDedicatedDiagram || parts.some(p => p.type === "mermaid")
  const diagramBelow = hasDedicatedDiagram && currentQuestion.diagramPosition === "below"

  // Auto-resolve column split if not specified
  const computedCols = cols === "auto" 
    ? (hasDiagram && !diagramBelow ? "split" : "single")
    : cols

  return (
    <div
      className={cn(
        "grid gap-3 flex-1 overflow-y-auto min-h-0",
        computedCols === "split" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      )}
      role="radiogroup"
      aria-label="Answer options"
    >
      {currentQuestion.options.map((opt, idx) => {
        const isSelected = selectedOption === opt.label
        const isCorrect = opt.label === currentQuestion.answer
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
            onSelect={() => actions.selectOption(opt.label)}
          />
        )
      })}
    </div>
  )
}

interface OptionButtonProps {
  idx: number
  label: string
  text?: string
  isSelected: boolean
  isRevealed: boolean
  isCorrect: boolean
  isWrong: boolean
  isDimmed: boolean
  onSelect: () => void
}

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
  const checkedProps = isSelected ? { "aria-checked": "true" as const } : { "aria-checked": "false" as const }
  return (
    <button
      role="radio"
      {...checkedProps}
      disabled={isRevealed}
      onClick={onSelect}
      className={cn(
        "relative flex items-start justify-between p-4 text-left transition-all duration-100 btn-depress group shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecc17]",
        !isRevealed && !isSelected && "bg-[#2a2a2a] hover:bg-[#353534] border-l-4 border-transparent hover:border-[#4e4632]",
        !isRevealed && isSelected && "bg-[#2a2a2a] border-l-4 border-[#fecc17] glow-primary",
        isRevealed && isCorrect && "bg-[var(--tw-hex-4ae176)]/10 border-l-4 border-[#4ae176]",
        isRevealed && isWrong && "bg-[var(--tw-hex-930013)]/10 border-l-4 border-[#930013]",
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

// ─── Footer Explanation & Hints ─────────────────────────────────────────────────

function QuestionCardFooter({ showHint = false }: { showHint?: boolean }) {
  const { state } = useQuestionCard()
  const { currentQuestion, isRevealed, hintTimeRemaining } = state

  const hasHint = showHint && !!currentQuestion.hint
  const hasExplanation = isRevealed && !!currentQuestion.explanation

  if (!hasHint && !hasExplanation) return null

  const showCountdown = hasHint && !hasExplanation && typeof hintTimeRemaining === "number"

  return (
    <div className="bg-[#0e0e0e] px-6 py-4 flex items-start gap-4 animate-fade-in border-t border-[#2a2a2a] shrink-0" aria-live="polite">
      <LightbulbIcon className="w-4 h-4 text-[#fecc17] mt-0.5 shrink-0" />
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            {hasExplanation ? "SYSTEM_EXPLANATION" : "SYSTEM_HINT"}
          </span>
          {showCountdown && (
            <span className="font-mono text-[9px] text-[#fecc17] font-bold tracking-widest uppercase animate-pulse">
              EXPIRING IN {hintTimeRemaining}S
            </span>
          )}
        </div>
        <p className="font-sans text-xs text-zinc-400 leading-relaxed italic">
          &quot;{hasExplanation ? currentQuestion.explanation : currentQuestion.hint}&quot;
        </p>
      </div>
    </div>
  )
}
