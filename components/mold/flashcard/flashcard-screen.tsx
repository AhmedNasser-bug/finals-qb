"use client"

import { useState, useCallback, useMemo, useRef } from "react"
import type { Flashcard } from "@/lib/mold-types"
import { formatLabel } from "@/lib/mold-types"
import { cn } from "@/lib/utils"
import { shuffle } from "@/lib/crypto-utils"
import { RichText } from "@/components/mold/common/rich-text"
import { Header } from "@/components/mold/flashcard/flashcard-components"
import {
  SessionEndScreen,
  RoundEndScreen,
  FlashcardDossierCard,
  FlashcardResponseControls,
} from "@/components/mold/flashcard/flashcard-screen-blocks"

interface FlashcardScreenProps {
  flashcards: Flashcard[]
  onComplete: () => void
  onReturnHome: () => void
}

type Phase = "studying" | "round-end" | "session-end"

// ─── Category accent map ───────────────────────────────────────────────────
const CATEGORY_ACCENT: Record<string, { color: string; border: string; label: string }> = {
  "fundamentals": { color: "text-primary", border: "border-t-primary", label: "CORE" },
  "finite-automata": { color: "text-cyan-400", border: "border-t-cyan-400", label: "FA" },
  "turing-machines": { color: "text-violet-400", border: "border-t-violet-400", label: "TM" },
  "complexity": { color: "text-red-400", border: "border-t-red-400", label: "COMP" },
  "regular-languages": { color: "text-emerald-400", border: "border-t-emerald-400", label: "REG" },
  "context-free": { color: "text-orange-400", border: "border-t-orange-400", label: "CFL" },
}

const DEFAULT_ACCENT = { color: "text-primary", border: "border-t-primary", label: "NODE" }

function getAccent(category: string) {
  return CATEGORY_ACCENT[category] ?? DEFAULT_ACCENT
}

/** Sort deck by score ascending — most negative first. Random tiebreak within same score. */
function sortByPriority(flashcards: Flashcard[], scores: Record<string, number>): Flashcard[] {
  const groups: Record<number, Flashcard[]> = {}
  flashcards.forEach((f) => {
    const score = scores[f.id] ?? 0
    if (!groups[score]) groups[score] = []
    groups[score].push(f)
  })

  const sortedScores = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b)

  const result: Flashcard[] = []
  sortedScores.forEach((score) => {
    result.push(...shuffle(groups[score]))
  })

  return result
}

export function FlashcardScreen({ flashcards, onComplete, onReturnHome }: FlashcardScreenProps) {
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(flashcards.map((c) => [c.id, 0]))
  )

  const [deck, setDeck] = useState<Flashcard[]>(() => [...flashcards])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<Phase>("studying")

  const [roundGotIt, setRoundGotIt] = useState(0)
  const [roundStillLearning, setRoundStillLearning] = useState(0)

  // Animation state for card transitions
  const [animClass, setAnimClass] = useState<string>("animate-fade-in")
  const respondingRef = useRef(false)

  const card = deck[index]
  const progress = ((index + 1) / deck.length) * 100

  // ── Respond to a card ───────────────────────────────────────────────────
  const handleRespond = useCallback(
    (knew: boolean) => {
      if (respondingRef.current) return
      respondingRef.current = true

      const delta = knew ? 1 : -1
      const exitAnim = knew ? "animate-card-exit-right" : "animate-card-exit-left"

      // Play exit animation, then update state
      setAnimClass(exitAnim)

      setTimeout(() => {
        const newScores = { ...scores, [card.id]: (scores[card.id] ?? 0) + delta }
        setScores(newScores)

        if (knew) {
          setRoundGotIt((n) => n + 1)
        } else {
          setRoundStillLearning((n) => n + 1)
        }

        setFlipped(false)

        if (index + 1 >= deck.length) {
          setAnimClass("animate-fade-in")
          setPhase("round-end")
        } else {
          setIndex((i) => i + 1)
          setAnimClass("animate-card-enter-right")
        }

        setTimeout(() => {
          setAnimClass("")
          respondingRef.current = false
        }, 50)
      }, 220)
    },
    [card, index, deck.length, scores]
  )

  // ── Start next round ────────────────────────────────────────────────────
  function handleContinue() {
    const sorted = sortByPriority(flashcards, scores)
    setDeck(sorted)
    setIndex(0)
    setFlipped(false)
    setRound((r) => r + 1)
    setRoundGotIt(0)
    setRoundStillLearning(0)
    setAnimClass("animate-fade-in")
    setPhase("studying")
  }

  // ── Derived stats ───────────────────────────────────────────────────────
  const { confident, neutral, learning, hardestCards, worstScore, hardest } = useMemo(() => {
    let conf = 0
    let neut = 0
    let learn = 0
    let worst = Infinity
    let hardestCard: Flashcard | undefined = undefined
    const learningList: Flashcard[] = []

    for (const crd of flashcards) {
      const s = scores[crd.id] ?? 0
      if (s > 0) conf++
      else if (s === 0) neut++
      else {
        learn++
        learningList.push(crd)
      }

      if (s < worst) {
        worst = s
        hardestCard = crd
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

  // ── Session-end screen ──────────────────────────────────────────────────
  if (phase === "session-end") {
    return (
      <SessionEndScreen
        round={round}
        flashcardsLength={flashcards.length}
        confident={confident}
        neutral={neutral}
        learning={learning}
        hardest={hardest}
        scores={scores}
        onReturnHome={onReturnHome}
        onComplete={onComplete}
      />
    )
  }

  // ── Round-end screen ────────────────────────────────────────────────────
  if (phase === "round-end") {
    return (
      <RoundEndScreen
        round={round}
        deckLength={deck.length}
        flashcardsLength={flashcards.length}
        confident={confident}
        neutral={neutral}
        learning={learning}
        roundGotIt={roundGotIt}
        roundStillLearning={roundStillLearning}
        hardestCards={hardestCards}
        scores={scores}
        onReturnHome={onReturnHome}
        onContinue={handleContinue}
        onEndSession={() => setPhase("session-end")}
      />
    )
  }

  // ── Study screen ────────────────────────────────────────────────────────
  const accent = getAccent(card.category)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        onQuit={onReturnHome}
        progress={progress}
        position={`${index + 1} / ${deck.length}`}
        round={round}
        confident={confident}
        learning={learning}
      />

      {/* ── Centered Dossier Card ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative overflow-hidden">
        <FlashcardDossierCard
          card={card}
          index={index}
          flipped={flipped}
          animClass={animClass}
          accent={accent}
          onFlip={() => setFlipped((f) => !f)}
        />

        {/* ── Response controls — only after flip ───────────────── */}
        {flipped && (
          <FlashcardResponseControls onRespond={handleRespond} />
        )}
      </div>
    </div>
  )
}
