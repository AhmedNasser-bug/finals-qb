"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import DOMPurify from "isomorphic-dompurify"
import { useQuestionCard, QuestionCardContext } from "@/lib/question-card-context"
import { calculateGrade, formatLabel, gradeColor, hasVisual } from "@/lib/mold-types"
import { parseRichTextParts } from "@/components/mold/common/rich-text"
import { renderMath } from "@/lib/utils/math-renderer"
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
  const streak = state.streak ?? 0

  // Dynamic glow classes based on streak milestones
  const isSupercharged = streak >= 10
  const isCombustion = streak >= 5 && streak < 10

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-slide-up w-full h-full">
      <div 
        className={cn(
          "relative bg-[#1c1b1b] border flex flex-col flex-1 min-h-0 rounded shadow-xl transition-all duration-300",
          isSupercharged
            ? "border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.25)] ring-1 ring-red-500/30"
            : isCombustion
              ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20"
              : "border-zinc-800/80 border-border"
        )}
      >
        {isSupercharged && (
          <div className="absolute inset-0 bg-red-950/5 opacity-[0.03] pointer-events-none z-0 mix-blend-color-dodge animate-pulse" />
        )}
        <div className="scanlines absolute inset-0 opacity-20 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8 gap-4">
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
      <h2 className="font-sans text-xl md:text-2xl font-bold text-[#e5e2e1] leading-tight tracking-tight text-pretty select-text">
        <span id={currentQuestion.id}>
          {hasDedicatedDiagram ? (
            <span dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(renderMath(currentQuestion.question))
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

  const hasVisualLatex = !!currentQuestion.visualLatex
  const hasVisualHtml = !!currentQuestion.visualHtml
  const hasVisualActive = hasDiagram || hasVisualLatex || hasVisualHtml

  if (!hasVisualActive) return null

  let chart = currentQuestion.diagram
  if (!chart && hasInlineDiagram) {
    const mermaidPart = parts.find(p => p.type === "mermaid")
    chart = mermaidPart?.content
  }

  const diagId = `q-diag-${currentQuestion.id}-${mode}`

  const activeVisualsCount = [!!chart, hasVisualLatex, hasVisualHtml].filter(Boolean).length
  const isSingle = activeVisualsCount === 1

  const inner = (
    <div className="flex flex-col gap-2 h-full min-h-0 w-full">
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500 select-none shrink-0">
        VISUAL_SPECIMEN_PANEL
      </span>
      <div className={cn(
        "flex-1 flex flex-col gap-4 pr-2 custom-scrollbar min-h-0 w-full",
        mode === "below" 
          ? "max-h-[320px] overflow-y-auto" 
          : "h-full overflow-y-auto"
      )}>
        {/* Section 1: Diagram */}
        {chart && (
          <div className={cn(
            "flex flex-col gap-1.5 w-full",
            mode === "below"
              ? isSingle
                ? "shrink-0 min-h-[280px] h-[280px]"
                : "shrink-0 min-h-[220px] h-[220px]"
              : isSingle
                ? "flex-1 min-h-0 h-full"
                : "shrink-0 min-h-[300px] h-[300px]"
          )}>
            <span className="font-mono text-[9px] tracking-wider text-zinc-600 uppercase select-none shrink-0">
              [VISUAL_1: MERMAID_DIAGRAM]
            </span>
            <div 
              className="bg-[#131313] border border-zinc-800 p-3 flex-1 overflow-auto rounded relative w-full h-full"
            >
              <MermaidDiagram
                chart={chart}
                id={diagId}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Section 2: LaTeX (centered KaTeX display block) */}
        {hasVisualLatex && (
          <div className={cn(
            "flex flex-col gap-1.5 w-full",
            mode === "below"
              ? isSingle
                ? "shrink-0 min-h-[280px] h-[280px]"
                : "shrink-0 min-h-[220px] h-[220px]"
              : isSingle
                ? "flex-1 min-h-0 h-full"
                : "shrink-0 min-h-[300px] h-[300px]"
          )}>
            <span className="font-mono text-[9px] tracking-wider text-zinc-600 uppercase select-none shrink-0">
              [VISUAL_2: LATEX_FORMULA]
            </span>
            <div 
              className="bg-[#131313] border border-zinc-800 p-4 text-center rounded overflow-auto text-[#e5e2e1] w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMath(`$$${currentQuestion.visualLatex}$$`))
              }}
            />
          </div>
        )}

        {/* Section 3: HTML Block */}
        {hasVisualHtml && (
          <div className={cn(
            "flex flex-col gap-1.5 w-full",
            mode === "below"
              ? isSingle
                ? "shrink-0 min-h-[280px] h-[280px]"
                : "shrink-0 min-h-[220px] h-[220px]"
              : isSingle
                ? "flex-1 min-h-0 h-full"
                : "shrink-0 min-h-[300px] h-[300px]"
          )}>
            <span className="font-mono text-[9px] tracking-wider text-zinc-600 uppercase select-none shrink-0">
              [VISUAL_3: SPECIMEN_HTML]
            </span>
            <div 
              className="bg-[#131313] border border-zinc-800 p-4 rounded text-left text-sm text-[#e5e2e1] overflow-auto font-sans w-full h-full"
              dangerouslySetInnerHTML={{
                __html: renderMath(DOMPurify.sanitize(currentQuestion.visualHtml ?? ""))
              }}
            />
          </div>
        )}
      </div>
    </div>
  )

  if (mode === "side") {
    return (
      <div className="hidden md:flex flex-col min-h-0 h-full w-full">
        {inner}
      </div>
    )
  }

  // Mobile stacked view: uses scroll container with standard margin
  return <div className="md:hidden w-full shrink-0 mb-4">{inner}</div>
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
        "grid gap-3 content-start shrink-0",
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
  const { state: cardState } = useQuestionCard()
  const streak = cardState.streak ?? 0
  const checkedProps = isSelected ? { "aria-checked": "true" as const } : { "aria-checked": "false" as const }

  const getFloatText = () => {
    if (streak >= 10) return `OVERDRIVE ×${streak}! ⚡`
    if (streak >= 5) return `COMBO ×${streak}! 🔥`
    return `+1 STREAK! 📈`
  }

  return (
    <button
      role="radio"
      {...checkedProps}
      disabled={isRevealed}
      aria-label={`Option ${label}: ${text ?? label}`}
      title={`Select Option ${label} (Press ${idx + 1} or ${label})`}
      onClick={onSelect}
      className={cn(
        "relative flex items-start justify-between p-4 text-left transition-all duration-100 btn-depress group shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !isRevealed && !isSelected && "bg-[#2a2a2a] hover:bg-[#353534] border-l-4 border-transparent hover:border-[#4e4632]",
        !isRevealed && isSelected && "bg-[#2a2a2a] border-l-4 border-primary glow-primary",
        isRevealed && isCorrect && "bg-emerald-500/10 border-l-4 border-emerald-500",
        isRevealed && isWrong && "bg-destructive/10 border-l-4 border-destructive",
        isDimmed && "bg-[#1c1b1b] border-l-4 border-transparent opacity-40",
      )}
    >
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-mono text-[10px] tracking-widest uppercase",
            !isRevealed && isSelected ? "text-primary font-bold" :
              isRevealed && isCorrect ? "text-emerald-400 font-bold" :
                isRevealed && isWrong ? "text-destructive font-bold" :
                  "text-muted-foreground"
          )}>
            OPTION_{String(idx + 1).padStart(2, "0")}
          </span>
          <span 
            className="font-mono text-[9px] font-bold px-1 py-0.2 bg-secondary text-muted-foreground border border-border rounded select-none group-hover:border-primary/40 group-hover:text-primary transition-colors" 
            aria-hidden="true"
          >
            [{idx + 1}]
          </span>
        </div>
        <span
          className={cn(
            "font-sans text-sm font-bold leading-snug",
            !isRevealed && isSelected ? "text-primary" :
              isRevealed && isCorrect ? "text-emerald-400" :
                isRevealed && isWrong ? "text-destructive" :
                  isDimmed ? "text-muted-foreground/40" :
                    "text-foreground"
          )}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(renderMath(text ?? label))
          }}
        />
      </div>
      <div className="ml-3 mt-0.5 shrink-0">
        {isRevealed && isCorrect && <CheckCircleIcon className="w-5 h-5 text-[#fecc17]" />}
        {isRevealed && isWrong && <XIcon className="w-5 h-5 text-[#ffb4ab]" />}
        {!isRevealed && isSelected && <CheckCircleIcon className="w-5 h-5 text-[#fecc17]" />}
        {!isRevealed && !isSelected && <RadioIcon className="w-5 h-5 text-zinc-700" />}
      </div>
      {isRevealed && isCorrect && isSelected && (
        <>
          <style>{`
            @keyframes floatUp {
              0% { transform: translateY(4px); opacity: 0; }
              15% { transform: translateY(-2px); opacity: 1; }
              85% { transform: translateY(-12px); opacity: 1; }
              100% { transform: translateY(-20px); opacity: 0; }
            }
            .animate-float-up {
              animation: floatUp 1.8s ease-in-out forwards;
            }
          `}</style>
          <span className="absolute -top-4 right-10 bg-[#fecc17] text-black font-mono text-[9px] font-black px-2 py-0.5 rounded shadow-[0_0_12px_rgba(254,204,23,0.6)] animate-float-up pointer-events-none select-none z-30 uppercase tracking-wider">
            {getFloatText()}
          </span>
        </>
      )}
    </button>
  )
}

import { useGameEngine } from "@/lib/game-engine"

// ─── Footer Explanation & Hints ─────────────────────────────────────────────────

function QuestionCardFooter({ showHint = false }: { showHint?: boolean }) {
  const { state } = useQuestionCard()
  const { state: gameState } = useGameEngine()
  const { currentQuestion, isRevealed, hintTimeRemaining } = state
  const streak = gameState.streak

  const hasHint = showHint && !!currentQuestion.hint
  const hasExplanation = isRevealed && !!currentQuestion.explanation

  if (!hasHint && !hasExplanation) return null

  const showCountdown = hasHint && !hasExplanation && typeof hintTimeRemaining === "number"

  return (
    <div className="bg-[#0e0e0e] px-6 py-4 flex items-start gap-4 animate-fade-in border-t border-[#2a2a2a] shrink-0" aria-live="polite">
      <LightbulbIcon className="w-4 h-4 text-[#fecc17] mt-0.5 shrink-0" />
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
              {hasExplanation ? "SYSTEM_EXPLANATION" : "SYSTEM_HINT"}
            </span>
            {streak >= 3 && (
              <span className={cn(
                "font-mono text-[9px] font-bold uppercase tracking-wider animate-pulse ml-2",
                streak >= 12 ? "text-grade-a" : streak >= 8 ? "text-destructive" : streak >= 5 ? "text-orange-400" : "text-primary"
              )}>
                {streak >= 12 
                  ? `⚡ MASTERY ACTIVE ×${streak}` 
                  : streak >= 8 
                    ? `⚡ OVERCLOCK MODE ×${streak}` 
                    : streak >= 5 
                      ? `🔥 PRECISION BURST ×${streak}` 
                      : `🔥 LOCKED IN ×${streak}`}
              </span>
            )}
          </div>
          {showCountdown && (
            <span className="font-mono text-[9px] text-[#fecc17] font-bold tracking-widest uppercase animate-pulse">
              EXPIRING IN {hintTimeRemaining}S
            </span>
          )}
        </div>
        <p
          className="font-sans text-xs text-[#b8b5b4] leading-relaxed italic"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(renderMath(hasExplanation ? currentQuestion.explanation ?? "" : currentQuestion.hint ?? ""))
          }}
        />
      </div>
    </div>
  )
}
