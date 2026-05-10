"use client"

import { useState, useCallback, useMemo } from "react"
import type { Flashcard } from "@/lib/mold-types"
import { formatLabel } from "@/lib/mold-types"
import { cn } from "@/lib/utils"

interface FlashcardScreenProps {
  flashcards: Flashcard[]
  onComplete: () => void
  onReturnHome: () => void
}

type Phase = "studying" | "round-end" | "session-end"

interface CardScore {
  cardId: string
  score: number
}

/** Sort deck by score ascending — most negative first. Random tiebreak within same score. */
function sortByPriority(flashcards: Flashcard[], scores: Record<string, number>): Flashcard[] {
  return [...flashcards].sort((a, b) => {
    const diff = (scores[a.id] ?? 0) - (scores[b.id] ?? 0)
    if (diff !== 0) return diff
    return Math.random() - 0.5
  })
}

export function FlashcardScreen({ flashcards, onComplete, onReturnHome }: FlashcardScreenProps) {
  // ── Priority scores: card.id → cumulative score ──────────────────────────
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(flashcards.map((c) => [c.id, 0]))
  )

  // ── Current round deck — sorted after round 1 ────────────────────────────
  const [deck, setDeck] = useState<Flashcard[]>(() => [...flashcards])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<Phase>("studying")

  // Round-level tracking: how many got-it vs still-learning this round
  const [roundGotIt, setRoundGotIt] = useState(0)
  const [roundStillLearning, setRoundStillLearning] = useState(0)

  const card = deck[index]
  const progress = ((index + 1) / deck.length) * 100

  // ── Respond to a card ─────────────────────────────────────────────────────
  const handleRespond = useCallback(
    (knew: boolean) => {
      const delta = knew ? 1 : -1
      const newScores = { ...scores, [card.id]: (scores[card.id] ?? 0) + delta }
      setScores(newScores)

      if (knew) {
        setRoundGotIt((n) => n + 1)
      } else {
        setRoundStillLearning((n) => n + 1)
      }

      setFlipped(false)

      if (index + 1 >= deck.length) {
        // Round complete — go to round-end screen
        setPhase("round-end")
      } else {
        setIndex((i) => i + 1)
      }
    },
    [card, index, deck.length, scores]
  )

  // ── Start next round: re-sort full deck by updated scores ─────────────────
  function handleContinue() {
    const sorted = sortByPriority(flashcards, scores)
    setDeck(sorted)
    setIndex(0)
    setFlipped(false)
    setRound((r) => r + 1)
    setRoundGotIt(0)
    setRoundStillLearning(0)
    setPhase("studying")
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  const { confident, neutral, learning, hardestCards, worstScore, hardest } = useMemo(() => {
    let conf = 0
    let neut = 0
    let learn = 0
    let worst = Infinity
    let hardestCard: Flashcard | undefined = undefined
    const learningList: Flashcard[] = []

    for (const card of flashcards) {
      const s = scores[card.id] ?? 0
      if (s > 0) conf++
      else if (s === 0) neut++
      else {
        learn++
        learningList.push(card)
      }

      if (s < worst) {
        worst = s
        hardestCard = card
      }
    }

    const hardestSorted = learningList
      .sort((a, b) => (scores[a.id] ?? 0) - (scores[b.id] ?? 0))
      .slice(0, 5)

    return {
      confident: conf,
      neutral: neut,
      learning: learn,
      hardestCards: hardestSorted,
      worstScore: worst === Infinity ? 0 : worst,
      hardest: hardestCard,
    }
  }, [flashcards, scores])

  // ── Session-end screen ────────────────────────────────────────────────────
  if (phase === "session-end") {
    return (
      <div className="flex flex-col flex-1">
        <Header onQuit={onReturnHome} progress={100} position={`${flashcards.length} / ${flashcards.length}`} round={round} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-8 animate-fade-in">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">SESSION COMPLETE</p>
            <h2 className="text-2xl font-mono font-bold text-foreground">
              {round} {round === 1 ? "ROUND" : "ROUNDS"}
            </h2>
            <p className="text-xs font-mono text-muted-foreground">
              {round * flashcards.length} total reviews
            </p>
          </div>

          {/* Score distribution */}
          <div className="w-full max-w-sm grid grid-cols-3 gap-3">
            <StatCell label="CONFIDENT" value={String(confident)} color="text-emerald-400" borderColor="border-emerald-400/30" />
            <StatCell label="NEUTRAL"   value={String(neutral)}   color="text-muted-foreground" borderColor="border-border" />
            <StatCell label="LEARNING"  value={String(learning)}  color="text-red-400" borderColor="border-red-400/30" />
          </div>

          {/* Hardest card */}
          {hardest && (
            <div className="w-full max-w-sm flex flex-col gap-1.5">
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest">HARDEST CARD</p>
              <div className="p-3 rounded border border-red-400/20 bg-red-400/5">
                <p className="text-sm font-semibold text-foreground">{hardest.term}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{hardest.definition}</p>
                <p className="text-[10px] font-mono text-red-400 mt-2">score {scores[hardest.id]}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={onReturnHome}
              className="flex-1 py-2.5 px-4 rounded border border-border bg-panel text-sm font-mono text-foreground/80 hover:text-foreground hover:border-border/60 transition-colors"
            >
              HOME
            </button>
            <button
              onClick={onComplete}
              className="flex-1 py-2.5 px-4 rounded border border-primary bg-primary text-primary-foreground text-sm font-mono font-bold hover:bg-primary/90 transition-colors"
            >
              NEW SESSION
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Round-end screen ──────────────────────────────────────────────────────
  if (phase === "round-end") {
    return (
      <div className="flex flex-col flex-1">
        <Header onQuit={onReturnHome} progress={100} position={`${deck.length} / ${deck.length}`} round={round} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-8 animate-slide-up">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">ROUND {round} COMPLETE</p>
            <div className="flex items-center gap-4 mt-2">
              <ScorePill label="GOT IT"        count={roundGotIt}        color="emerald" />
              <ScorePill label="STILL LEARNING" count={roundStillLearning} color="red" />
            </div>
          </div>

          {/* Cumulative distribution bar */}
          <div className="w-full max-w-sm flex flex-col gap-2">
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">DECK STATUS</p>
            <DistributionBar confident={confident} neutral={neutral} learning={learning} total={flashcards.length} />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
              <span className="text-emerald-400">{confident} confident</span>
              <span className="text-muted-foreground">{neutral} neutral</span>
              <span className="text-red-400">{learning} learning</span>
            </div>
          </div>

          {/* Hardest cards preview */}
          {hardestCards.length > 0 && (
            <div className="w-full max-w-sm flex flex-col gap-2">
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest">
                NEXT — PRIORITY CARDS
              </p>
              <div className="flex flex-col gap-1.5">
                {hardestCards.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-3 py-2 rounded border border-red-400/20 bg-red-400/5"
                  >
                    <span className="text-xs font-semibold text-foreground truncate">{c.term}</span>
                    <span className="text-[10px] font-mono text-red-400 ml-2 shrink-0">
                      {scores[c.id] > 0 ? `+${scores[c.id]}` : scores[c.id]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={() => setPhase("session-end")}
              className="flex-1 py-2.5 px-4 rounded border border-border bg-panel text-sm font-mono text-foreground/80 hover:text-foreground transition-colors"
            >
              END SESSION
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-2.5 px-4 rounded border border-primary bg-primary text-primary-foreground text-sm font-mono font-bold hover:bg-primary/90 transition-colors"
            >
              CONTINUE — ROUND {round + 1}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Study screen ──────────────────────────────────────────────────────────
  const cardScore = scores[card.id] ?? 0

  return (
    <div className="flex flex-col flex-1">
      <Header
        onQuit={onReturnHome}
        progress={progress}
        position={`${index + 1} / ${deck.length}`}
        round={round}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">
        {/* Category + priority score badge */}
        <div className="flex items-center gap-3">
          <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
            {formatLabel(card.category)}
          </p>
          {cardScore !== 0 && (
            <span className={cn(
              "text-[10px] font-mono px-1.5 py-0.5 rounded border",
              cardScore > 0
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                : "border-red-400/30 bg-red-400/10 text-red-400"
            )}>
              {cardScore > 0 ? `+${cardScore}` : cardScore}
            </span>
          )}
        </div>

        {/* Flip card */}
        <button
          onClick={() => setFlipped((f) => !f)}
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

        {/* Response controls — only after flip */}
        {flipped && (
          <div className="flex gap-3 w-full max-w-lg animate-fade-in">
            <button
              onClick={() => handleRespond(false)}
              className="flex-1 py-2.5 px-4 rounded border border-red-400/30 bg-red-400/5 text-red-400 text-sm font-mono hover:bg-red-400/10 transition-colors"
            >
              STILL LEARNING  &nbsp;-1
            </button>
            <button
              onClick={() => handleRespond(true)}
              className="flex-1 py-2.5 px-4 rounded border border-emerald-400/30 bg-emerald-400/5 text-emerald-400 text-sm font-mono font-bold hover:bg-emerald-400/10 transition-colors"
            >
              GOT IT  &nbsp;+1
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header({
  onQuit,
  progress,
  position,
  round,
}: {
  onQuit: () => void
  progress: number
  position: string
  round: number
}) {
  return (
    <header className="border-b border-border bg-panel px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground tracking-widest">FLASHCARDS</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
            ROUND {round}
          </span>
        </div>
        <button
          onClick={onQuit}
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
      <span className="text-xs font-mono text-muted-foreground">{position}</span>
    </header>
  )
}

function StatCell({
  label,
  value,
  color,
  borderColor,
}: {
  label: string
  value: string
  color: string
  borderColor: string
}) {
  return (
    <div className={cn("flex flex-col gap-1 p-3 rounded border bg-panel", borderColor)}>
      <span className="text-[10px] font-mono text-muted-foreground tracking-wider">{label}</span>
      <span className={cn("text-xl font-mono font-bold", color)}>{value}</span>
    </div>
  )
}

function ScorePill({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: "emerald" | "red"
}) {
  const cls = color === "emerald"
    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
    : "border-red-400/30 bg-red-400/10 text-red-400"

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded border", cls)}>
      <span className="text-lg font-mono font-bold">{count}</span>
      <span className="text-[10px] font-mono tracking-wider">{label}</span>
    </div>
  )
}

function DistributionBar({
  confident,
  neutral,
  learning,
  total,
}: {
  confident: number
  neutral: number
  learning: number
  total: number
}) {
  const confPct    = (confident / total) * 100
  const neutralPct = (neutral   / total) * 100
  const learnPct   = (learning  / total) * 100

  return (
    <div className="h-3 rounded-full overflow-hidden flex bg-secondary">
      {confPct > 0 && (
        <div className="bg-emerald-400 transition-all duration-500" style={{ width: `${confPct}%` }} />
      )}
      {neutralPct > 0 && (
        <div className="bg-muted-foreground/30 transition-all duration-500" style={{ width: `${neutralPct}%` }} />
      )}
      {learnPct > 0 && (
        <div className="bg-red-400 transition-all duration-500" style={{ width: `${learnPct}%` }} />
      )}
    </div>
  )
}
