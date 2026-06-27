import React from "react"
import { cn } from "@/lib/utils"

interface Step1ContentTypeProps {
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

      {/* Content Type Selector */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: "questions", name: "Questions Only", desc: "MCQ & TrueFalse sets" },
          { id: "flashcards", name: "Flashcards Only", desc: "Key concept definitions" },
          { id: "both", name: "Both Types", desc: "Comprehensive coverage" },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setContentType(type.id as any)}
            className={cn(
              "p-4 border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-none",
              contentType === type.id
                ? "border-primary bg-primary/10"
                : "border-border bg-panel hover:bg-zinc-800/50 hover:border-zinc-700"
            )}
          >
            <span className={cn(
              "block text-sm font-bold font-mono uppercase mb-1",
              contentType === type.id ? "text-primary" : "text-white"
            )}>
              {type.name}
            </span>
            <span className="block text-[11px] font-sans text-zinc-500 leading-tight">
              {type.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Quantity Selectors */}
      <div className="space-y-4 pt-2">
        <label className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
          Configure Generation Volume
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div className={cn(
            "p-4 border border-border bg-panel flex flex-col gap-3 transition-opacity",
            (contentType === "flashcards") && "opacity-40 pointer-events-none"
          )}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-zinc-300">Question Count</span>
              <span className="text-lg font-bold text-white font-mono">{questionCount}</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className={cn(
            "p-4 border border-border bg-panel flex flex-col gap-3 transition-opacity",
            (contentType === "questions") && "opacity-40 pointer-events-none"
          )}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-zinc-300">Flashcard Count</span>
              <span className="text-lg font-bold text-white font-mono">{flashcardCount}</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={flashcardCount}
              onChange={(e) => setFlashcardCount(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
