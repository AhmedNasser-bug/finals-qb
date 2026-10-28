import React from 'react'
import { cn } from "@/lib/utils"

interface Step1Props {
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
  setFlashcardCount
}: Step1Props) {
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
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">MODE</span>
                <span className={cn("block text-xs font-bold font-mono", isSelected ? "text-primary" : "text-white")}>
                  {type.name}
                </span>
                <span className="block text-[11px] text-zinc-500 font-sans leading-tight">
                  {type.desc}
                </span>
              </div>
              <span className={cn(
                "text-[10px] font-mono font-bold uppercase tracking-wider block border-t border-border/50 pt-2",
                isSelected ? "text-primary" : "text-zinc-600"
              )}>
                {isSelected ? "✓ SELECTED" : "SELECT"}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-6 pt-4 border-t border-border/50">
        {(contentType === "questions" || contentType === "both") && (
          <div className="space-y-4 bg-[#101115] p-5 border border-border">
            <div className="flex justify-between items-center">
              <label htmlFor="q-count" className="text-sm font-mono font-bold text-white tracking-tight">
                Question Generation Volume
              </label>
              <span className="text-primary font-mono text-xl font-bold bg-primary/10 px-3 py-1 rounded">
                {questionCount}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Target number of unique questions. Large values (30+) may truncate in standard AI output windows or degrade quality.
            </p>
            <input
              id="q-count"
              type="range"
              min={5}
              max={50}
              step={5}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-primary h-1 bg-zinc-800 rounded-none outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>MIN: 5</span>
              <span>MAX: 50</span>
            </div>
          </div>
        )}

        {(contentType === "flashcards" || contentType === "both") && (
          <div className="space-y-4 bg-[#101115] p-5 border border-border">
            <div className="flex justify-between items-center">
              <label htmlFor="f-count" className="text-sm font-mono font-bold text-white tracking-tight">
                Flashcard Generation Volume
              </label>
              <span className="text-primary font-mono text-xl font-bold bg-primary/10 px-3 py-1 rounded">
                {flashcardCount}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Target number of atomic flashcards. Focus on term/definition pairs.
            </p>
            <input
              id="f-count"
              type="range"
              min={5}
              max={100}
              step={5}
              value={flashcardCount}
              onChange={(e) => setFlashcardCount(Number(e.target.value))}
              className="w-full accent-primary h-1 bg-zinc-800 rounded-none outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>MIN: 5</span>
              <span>MAX: 100</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
