import React from "react"
import { cn } from "@/lib/utils"

export interface Step1ContentTypeProps {
  contentType: "questions" | "flashcards" | "both"
  setContentType: (type: "questions" | "flashcards" | "both") => void
  questionCount: number
  setQuestionCount: (count: number) => void
  flashcardCount: number
  setFlashcardCount: (count: number) => void
}

export function Step1ContentType({
  contentType,
  setContentType,
  questionCount,
  setQuestionCount,
  flashcardCount,
  setFlashcardCount,
}: Step1ContentTypeProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
          STEP 01 // CONTENT_TYPE_SELECTION
        </span>
        <h3 className="text-lg font-bold font-mono text-white tracking-tight">
          Choose Generated Material Type & Volume
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Select the types of learning materials you would like the AI to generate and configure their quantities.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { id: "questions", name: "Questions Only", desc: "MCQ & TrueFalse sets" },
          { id: "flashcards", name: "Flashcards Only", desc: "Key concept definitions" },
          { id: "both", name: "Both Sets", desc: "Unified study collection" },
        ].map((type) => {
          const isSelected = contentType === type.id
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setContentType(type.id as any)}
              className={cn(
                "flex flex-col text-left p-4 border transition-all duration-150 cursor-pointer min-h-[90px] justify-between rounded-none",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground border-glow"
                  : "border-border bg-[#101115] text-zinc-400 hover:text-white"
              )}
            >
              <span className={cn("text-xs font-mono font-bold uppercase tracking-wide", isSelected ? "text-primary" : "text-white")}>
                {type.name}
              </span>
              <span className="text-[10px] leading-snug mt-1 font-sans text-zinc-500">
                {type.desc}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-900">
        {(contentType === "questions" || contentType === "both") && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/60 bg-[#101115] p-5">
            <div className="flex flex-col">
              <label htmlFor="question-count-input" className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Questions Count
              </label>
              <span className="text-[10px] text-zinc-500 mt-0.5 font-mono uppercase">
                Range: 5 — 50 items
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
                className="w-40 accent-primary cursor-pointer"
              />
              <input
                id="question-count-input"
                type="number"
                min={5}
                max={50}
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.min(50, Math.max(5, parseInt(e.target.value) || 0)))}
                className="w-16 bg-[#07080a] border border-border rounded-none py-1.5 text-center text-sm font-mono text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
        )}

        {(contentType === "flashcards" || contentType === "both") && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/60 bg-[#101115] p-5">
            <div className="flex flex-col">
              <label htmlFor="flashcard-count-input" className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Flashcards Count
              </label>
              <span className="text-[10px] text-zinc-500 mt-0.5 font-mono uppercase">
                Range: 5 — 50 items
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={flashcardCount}
                onChange={(e) => setFlashcardCount(parseInt(e.target.value) || 10)}
                className="w-40 accent-primary cursor-pointer"
              />
              <input
                id="flashcard-count-input"
                type="number"
                min={5}
                max={50}
                value={flashcardCount}
                onChange={(e) => setFlashcardCount(Math.min(50, Math.max(5, parseInt(e.target.value) || 0)))}
                className="w-16 bg-[#07080a] border border-border rounded-none py-1.5 text-center text-sm font-mono text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
