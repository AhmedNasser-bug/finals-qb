"use client"

import { useState } from "react"
import type { Flashcard } from "@/lib/mold-types"
import { formatLabel } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface FlashcardScreenProps {
  flashcards: Flashcard[]
  onComplete: () => void
  onReturnHome: () => void
}

export function FlashcardScreen({ flashcards, onComplete, onReturnHome }: FlashcardScreenProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Set<number>>(new Set())
  const [done, setDone] = useState(false)

  const card = flashcards[index]
  const total = flashcards.length
  const progress = (index / total) * 100

  function handleFlip() {
    setFlipped((f) => !f)
  }

  function handleKnow(didKnow: boolean) {
    const next = new Set(known)
    if (didKnow) next.add(index)
    setKnown(next)
    setFlipped(false)
    if (index + 1 >= total) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (done) {
    const knownCount = known.size
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-8 px-4 py-8 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-mono tracking-widest text-muted-foreground">SESSION COMPLETE</p>
          <div className="w-20 h-20 rounded border-2 border-primary bg-primary/10 flex items-center justify-center">
            <CardIcon className="w-10 h-10 text-primary" />
          </div>
        </div>
        <div className="w-full max-w-sm grid grid-cols-2 gap-3">
          <StatCell label="CARDS REVIEWED" value={String(total)} />
          <StatCell label="KNEW" value={`${knownCount} / ${total}`} accent />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={onReturnHome}
            className="flex-1 py-2.5 px-4 rounded border border-border bg-panel text-sm font-mono text-foreground/80 hover:text-foreground hover:border-border/80 transition-colors"
          >
            HOME
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-2.5 px-4 rounded border border-primary bg-primary text-primary-foreground text-sm font-mono font-bold hover:bg-primary/90 transition-colors"
          >
            AGAIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <header className="border-b border-border bg-panel px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground tracking-widest">FLASHCARDS</span>
          <button
            onClick={onReturnHome}
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-transparent hover:border-border"
          >
            QUIT
          </button>
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {index + 1} / {total}
        </span>
      </header>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">
        <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          {formatLabel(card.category)}
        </p>

        <button
          onClick={handleFlip}
          aria-label={flipped ? "Show term" : "Show definition"}
          className={cn(
            "w-full max-w-lg min-h-[200px] p-6 rounded border text-left flex flex-col justify-between",
            "transition-all duration-200 hover:border-primary/40",
            flipped ? "border-primary/40 bg-primary/5" : "border-border bg-panel"
          )}
        >
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            {flipped ? "DEFINITION" : "TERM — click to reveal"}
          </span>
          <p className={cn(
            "mt-4 leading-relaxed text-pretty",
            flipped ? "text-sm text-muted-foreground" : "text-xl font-semibold text-foreground"
          )}>
            {flipped ? card.definition : card.term}
          </p>
        </button>

        {/* Response controls (only after flip) */}
        {flipped && (
          <div className="flex gap-3 w-full max-w-lg animate-fade-in">
            <button
              onClick={() => handleKnow(false)}
              className="flex-1 py-2.5 px-4 rounded border border-red-400/30 bg-red-400/5 text-red-400 text-sm font-mono hover:bg-red-400/10 transition-colors"
            >
              STILL LEARNING
            </button>
            <button
              onClick={() => handleKnow(true)}
              className="flex-1 py-2.5 px-4 rounded border border-emerald-400/30 bg-emerald-400/5 text-emerald-400 text-sm font-mono font-bold hover:bg-emerald-400/10 transition-colors"
            >
              GOT IT
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded border border-border bg-panel">
      <span className="text-[10px] font-mono text-muted-foreground tracking-wider">{label}</span>
      <span className={cn("text-xl font-mono font-bold", accent ? "text-primary" : "text-foreground")}>
        {value}
      </span>
    </div>
  )
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
