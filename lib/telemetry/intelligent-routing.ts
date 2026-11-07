/**
 * @mold/telemetry - Intelligent Routing Engine
 *
 * Decoupled action engine that builds optimal flashcard review queues
 * by prioritizing cognitive decay, lapsed memory items, and due intervals.
 */

import type { Flashcard } from "../types/mold-types"
import type { CardRetentionState, RetentionMap } from "./telemetry-types"
import { createInitialCardState } from "./retention-kernel"

export type RoutingStrategy = "SMART_ADAPTIVE" | "DUE_ONLY" | "CRITICAL_ONLY" | "SEQUENTIAL"

export interface RoutingPlanOptions {
  strategy?: RoutingStrategy
  limit?: number
  selectedCategory?: string | null
  targetRetrievability?: number // Default 0.85
}

export interface IntelligentRoutingResult {
  queue: Flashcard[]
  totalAvailable: number
  dueCount: number
  criticalCount: number
  newCount: number
  strategyUsed: RoutingStrategy
}

/**
 * Builds an intelligently sorted queue of flashcards for maximum learning ROI.
 */
export function buildIntelligentFlashcardQueue(
  cards: Flashcard[],
  retentionMap: RetentionMap,
  subjectId: string,
  options: RoutingPlanOptions = {}
): IntelligentRoutingResult {
  const {
    strategy = "SMART_ADAPTIVE",
    limit = 0,
    selectedCategory = null,
  } = options

  // 1. Filter by category if requested
  let pool = cards
  if (selectedCategory && selectedCategory !== "all") {
    pool = cards.filter((c) => c.category === selectedCategory)
  }

  // 2. Classify cards into priority buckets
  // ⚡ Bolt Optimization: Precompute retrievability wrapper for fast sorting
  // Prevents O(N log N) map lookups during the sorting phase
  interface WrappedCard { card: Flashcard; r: number }
  const criticalWrapper: WrappedCard[] = []
  const dueWrapper: WrappedCard[] = []
  const approachingWrapper: WrappedCard[] = []
  const unreviewed: Flashcard[] = []
  const mastered: Flashcard[] = []

  for (let i = 0; i < pool.length; i++) {
    const card = pool[i];
    const state: CardRetentionState = retentionMap[card.id] || createInitialCardState(card, subjectId)
    const r = state.currentRetrievability ?? 1

    switch (state.urgencyLevel) {
      case "CRITICAL_LAPSED":
        criticalWrapper.push({ card, r })
        break
      case "DUE":
        dueWrapper.push({ card, r })
        break
      case "APPROACHING_DECAY":
        approachingWrapper.push({ card, r })
        break
      case "NEW":
        unreviewed.push(card)
        break
      case "MASTERED":
        mastered.push(card)
        break
    }
  }

  // Sort critical & due by lowest retrievability first
  const sortByLowestR = (a: WrappedCard, b: WrappedCard) => a.r - b.r

  criticalWrapper.sort(sortByLowestR)
  dueWrapper.sort(sortByLowestR)
  approachingWrapper.sort(sortByLowestR)

  const critical = criticalWrapper.map(w => w.card)
  const due = dueWrapper.map(w => w.card)
  const approaching = approachingWrapper.map(w => w.card)

  let queue: Flashcard[] = []

  switch (strategy) {
    case "CRITICAL_ONLY":
      queue = [...critical]
      break

    case "DUE_ONLY":
      queue = [...critical, ...due, ...approaching]
      break

    case "SEQUENTIAL":
      queue = [...pool]
      break

    case "SMART_ADAPTIVE":
    default:
      // Smart composition: Critical -> Due -> Approaching Decay -> New -> Mastered
      queue = [...critical, ...due, ...approaching, ...unreviewed, ...mastered]
      break
  }

  const totalAvailable = queue.length
  if (limit > 0 && queue.length > limit) {
    queue = queue.slice(0, limit)
  }

  return {
    queue,
    totalAvailable,
    dueCount: due.length,
    criticalCount: critical.length,
    newCount: unreviewed.length,
    strategyUsed: strategy,
  }
}
