"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import type { Flashcard } from "@/lib/mold-types"
import { formatLabel, getCategoryAccent } from "@/lib/mold-types"
import { cn } from "@/lib/utils"
import { shuffle } from "@/lib/crypto-utils"
import { Header } from "@/components/mold/flashcard/flashcard-components"
import {
  SessionEndScreen,
  RoundEndScreen,
  FlashcardDossierCard,
  FlashcardResponseControls,
} from "@/components/mold/flashcard/flashcard-screen-blocks"
import { MemoryHeatmap } from "@/components/mold/flashcard/memory-heatmap"
import { RetentionBadge } from "@/components/mold/flashcard/retention-badge"
import {
  loadRetentionMap,
  saveRetentionMap,
  evaluateDeckRetention,
  updateCardRetention,
} from "@/lib/telemetry/retention-kernel"
import { buildIntelligentFlashcardQueue, RoutingStrategy } from "@/lib/telemetry/intelligent-routing"
import { telemetryCollector } from "@/lib/telemetry/telemetry-collector"
import { RetentionMap } from "@/lib/telemetry/telemetry-types"
import { Brain, Sparkles, LayoutGrid } from "lucide-react"

interface FlashcardScreenProps {
  flashcards: Flashcard[]
  subjectId?: string
  onComplete: () => void
  onReturnHome: () => void
}

type Phase = "studying" | "round-end" | "session-end"

export function FlashcardScreen({
  flashcards,
  subjectId = "active-subject",
  onComplete,
  onReturnHome,
}: FlashcardScreenProps) {
  const [retentionMap, setRetentionMap] = useState<RetentionMap>(() =>
    evaluateDeckRetention(flashcards, loadRetentionMap(subjectId), subjectId)
  )

  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(flashcards.map((c) => [c.id, 0]))
  )

  const [deck, setDeck] = useState<Flashcard[]>(() => {
    const intelligent = buildIntelligentFlashcardQueue(flashcards, retentionMap, subjectId, {
      strategy: "SMART_ADAPTIVE",
    })
    return intelligent.queue.length > 0 ? intelligent.queue : [...flashcards]
  })

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<Phase>("studying")
  const [showHeatmap, setShowHeatmap] = useState(false)

  const [roundGotIt, setRoundGotIt] = useState(0)
  const [roundStillLearning, setRoundStillLearning] = useState(0)
  const [animClass, setAnimClass] = useState<string>("animate-fade-in")

  const respondingRef = useRef(false)
  const cardStartTimeRef = useRef<number>(Date.now())
  const flipTimeRef = useRef<number | null>(null)

  const card = deck[index] || flashcards[0]
  const progress = deck.length > 0 ? ((index + 1) / deck.length) * 100 : 0
  const cardRetention = retentionMap[card.id]

  // Reset timestamp whenever current card changes
  useEffect(() => {
    cardStartTimeRef.current = Date.now()
    flipTimeRef.current = null
  }, [index, card.id])

  // Flip handler tracking cognitive flip latency
  const handleFlip = useCallback(() => {
    if (!flipped) {
      const now = Date.now()
      flipTimeRef.current = now
      const durationBeforeFlip = now - cardStartTimeRef.current
      telemetryCollector.record({
        id: "",
        type: "card_flipped",
        cardId: card.id,
        subjectId,
        category: card.category || "_general",
        timestamp: new Date().toISOString(),
        durationBeforeFlipMs: durationBeforeFlip,
      })
    }
    setFlipped((f) => !f)
  }, [flipped, card, subjectId])

  // Respond to a card with SuperMemo retention updates
  const handleRespond = useCallback(
    (knew: boolean) => {
      if (respondingRef.current) return
      respondingRef.current = true

      const now = Date.now()
      const totalDecisionMs = now - cardStartTimeRef.current
      const ratingQuality = knew ? "good" : "again"

      // Record Telemetry
      telemetryCollector.record({
        id: "",
        type: "rating_submitted",
        cardId: card.id,
        subjectId,
        category: card.category || "_general",
        timestamp: new Date().toISOString(),
        rating: ratingQuality,
        decisionLatencyMs: totalDecisionMs,
      })

      // Update Retention in Kernel
      const prevRetention = retentionMap[card.id]
      if (prevRetention) {
        const updated = updateCardRetention(prevRetention, ratingQuality, totalDecisionMs)
        const newMap = { ...retentionMap, [card.id]: updated }
        setRetentionMap(newMap)
        saveRetentionMap(subjectId, newMap)
      }

      const delta = knew ? 1 : -1
      const exitAnim = knew ? "animate-card-exit-right" : "animate-card-exit-left"
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
    [card, index, deck.length, scores, retentionMap, subjectId]
  )

  // Start next round with intelligent routing
  function handleContinue() {
    const intelligent = buildIntelligentFlashcardQueue(flashcards, retentionMap, subjectId, {
      strategy: "SMART_ADAPTIVE",
    })
    setDeck(intelligent.queue.length > 0 ? intelligent.queue : [...flashcards])
    setIndex(0)
    setFlipped(false)
    setRound((r) => r + 1)
    setRoundGotIt(0)
    setRoundStillLearning(0)
    setAnimClass("animate-fade-in")
    setPhase("studying")
  }

  // Drill triggered from Heatmap
  const handleDrillFromHeatmap = useCallback(
    (strategy: RoutingStrategy, category?: string) => {
      const intelligent = buildIntelligentFlashcardQueue(flashcards, retentionMap, subjectId, {
        strategy,
        selectedCategory: category,
      })
      if (intelligent.queue.length > 0) {
        setDeck(intelligent.queue)
        setIndex(0)
        setFlipped(false)
        setRound(1)
        setRoundGotIt(0)
        setRoundStillLearning(0)
        setPhase("studying")
        setShowHeatmap(false)
      }
    },
    [flashcards, retentionMap, subjectId]
  )

  // Derived stats
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

  const accent = getCategoryAccent(card.category)

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

      {/* Heatmap Toggle Action Bar */}
      <div className="px-4 py-2 bg-panel/60 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {cardRetention && (
            <RetentionBadge
              urgency={cardRetention.urgencyLevel}
              retrievability={cardRetention.currentRetrievability}
            />
          )}
          <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
            Stability: {cardRetention?.stability ?? 1.0}d
          </span>
        </div>

        <button type="button"
          onClick={() => setShowHeatmap((prev) => !prev)}
          className="px-2.5 py-1 text-xs font-mono font-bold bg-background border border-border hover:border-primary text-foreground rounded transition-colors flex items-center gap-1.5"
        >
          <Brain className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          {showHeatmap ? "HIDE HEATMAP" : "RETENTION HEATMAP"}
        </button>
      </div>

      {/* Conditional Memory Heatmap Drawer */}
      {showHeatmap ? (
        <div className="flex-1 p-4 overflow-y-auto max-w-5xl mx-auto w-full">
          <MemoryHeatmap
            cards={flashcards}
            retentionMap={retentionMap}
            subjectId={subjectId}
            onStartDrill={handleDrillFromHeatmap}
            onClose={() => setShowHeatmap(false)}
          />
        </div>
      ) : (
        /* Centered Dossier Card */
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative overflow-hidden">
          <FlashcardDossierCard
            card={card}
            index={index}
            flipped={flipped}
            animClass={animClass}
            accent={accent}
            onFlip={handleFlip}
          />

          {/* Response controls — only after flip */}
          {flipped && (
            <FlashcardResponseControls onRespond={handleRespond} />
          )}
        </div>
      )}
    </div>
  )
}
