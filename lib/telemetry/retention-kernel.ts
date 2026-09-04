/**
 * @mold/telemetry - SuperMemo Spaced Repetition Kernel
 *
 * Pure domain mathematics implementing Ebbinghaus exponential decay
 * R(t) = e^(-t/S) and SuperMemo interval adjustment with cognitive latency weighting.
 */

import type {
  CardRetentionState,
  FlashcardRecallQuality,
  RetentionMap,
  CategoryRetentionSummary,
} from "./telemetry-types"
import type { Flashcard } from "../types/mold-types"
import { getNamespacedKey } from "../utils/user-storage"

const CARD_RETENTION_BASE_KEY = "mold_v2_card_retention"

/**
 * Calculates decayed retrievability probability R(t) = e^(-t / S)
 * @param stabilityDays Memory half-life / stability in days (S >= 0.1)
 * @param elapsedDays Days elapsed since last review (t >= 0)
 */
export function calculateRetrievability(stabilityDays: number, elapsedDays: number): number {
  if (stabilityDays <= 0) return 0
  const t = Math.max(0, elapsedDays)
  const S = Math.max(0.1, stabilityDays)
  const r = Math.exp(-t / S)
  return Math.max(0, Math.min(1, Math.round(r * 1000) / 1000))
}

/**
 * Maps Flashcard recall quality to numeric quality rating [1..5] with hesitation weighting
 */
export function deriveQualityScore(
  quality: FlashcardRecallQuality,
  decisionLatencyMs?: number
): number {
  let q = 4
  switch (quality) {
    case "again":
      q = 1
      break
    case "hard":
      q = 3
      break
    case "good":
      q = 4
      break
    case "easy":
      q = 5
      break
  }

  // Hesitation penalty: If user took > 7s on "good" or "easy", downgrade quality by 1 step
  if (decisionLatencyMs && decisionLatencyMs > 7000 && q >= 4) {
    q -= 1
  }

  return q
}

/**
 * Evaluates urgency classification based on decayed retrievability R
 */
export function classifyUrgency(
  retrievability: number,
  repetitions: number
): CardRetentionState["urgencyLevel"] {
  if (repetitions === 0) return "NEW"
  if (retrievability < 0.5) return "CRITICAL_LAPSED"
  if (retrievability < 0.75) return "DUE"
  if (retrievability < 0.9) return "APPROACHING_DECAY"
  return "MASTERED"
}

/**
 * Creates default retention state for an unreviewed card
 */
export function createInitialCardState(
  card: Flashcard,
  subjectId: string
): CardRetentionState {
  return {
    cardId: card.id,
    subjectId,
    category: card.category || "_general",
    term: card.term,
    definition: card.definition,
    repetitions: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    stability: 1.0,
    difficulty: 0.3,
    lapses: 0,
    lastReviewedAt: null,
    nextDueDate: null,
    currentRetrievability: 1.0,
    urgencyLevel: "NEW",
  }
}

/**
 * Updates SM-2 memory parameters upon card rating
 */
export function updateCardRetention(
  prev: CardRetentionState,
  quality: FlashcardRecallQuality,
  decisionLatencyMs: number = 0,
  nowIso: string = new Date().toISOString()
): CardRetentionState {
  const q = deriveQualityScore(quality, decisionLatencyMs)

  let newRepetitions = prev.repetitions
  let newInterval = prev.intervalDays
  let newLapses = prev.lapses
  let newEaseFactor = prev.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

  if (newEaseFactor < 1.3) newEaseFactor = 1.3
  newEaseFactor = Math.round(newEaseFactor * 100) / 100

  let newStability = prev.stability

  if (q >= 3) {
    if (newRepetitions === 0) {
      newInterval = 1
      newStability = 2.0
    } else if (newRepetitions === 1) {
      newInterval = 6
      newStability = 5.0
    } else {
      newInterval = Math.round(prev.intervalDays * newEaseFactor)
      newStability = Math.round(prev.stability * newEaseFactor * 10) / 10
    }
    newRepetitions += 1
  } else {
    // Lapsed memory
    newRepetitions = 0
    newInterval = 1
    newStability = Math.max(0.5, Math.round((prev.stability * 0.3) * 10) / 10)
    newLapses += 1
  }

  const nowMs = new Date(nowIso).getTime()
  const nextDueMs = nowMs + newInterval * 24 * 60 * 60 * 1000
  const nextDueDate = new Date(nextDueMs).toISOString()

  return {
    ...prev,
    repetitions: newRepetitions,
    intervalDays: newInterval,
    easeFactor: newEaseFactor,
    stability: newStability,
    lapses: newLapses,
    lastReviewedAt: nowIso,
    nextDueDate,
    currentRetrievability: 1.0, // Freshly reviewed
    urgencyLevel: "MASTERED",
  }
}

/**
 * Refreshes current retrievability for all cards based on current timestamp
 */
export function evaluateDeckRetention(
  cards: Flashcard[],
  retentionMap: RetentionMap,
  subjectId: string,
  nowMs: number = Date.now()
): RetentionMap {
  const updatedMap: RetentionMap = {}

  for (const card of cards) {
    const existing = retentionMap[card.id] || createInitialCardState(card, subjectId)
    if (!existing.lastReviewedAt) {
      updatedMap[card.id] = { ...existing, urgencyLevel: "NEW", currentRetrievability: 1.0 }
      continue
    }

    const lastMs = new Date(existing.lastReviewedAt).getTime()
    const elapsedDays = Math.max(0, (nowMs - lastMs) / (1000 * 60 * 60 * 24))
    const r = calculateRetrievability(existing.stability, elapsedDays)
    const urgency = classifyUrgency(r, existing.repetitions)

    updatedMap[card.id] = {
      ...existing,
      currentRetrievability: r,
      urgencyLevel: urgency,
    }
  }

  return updatedMap
}

/**
 * Derives category-level retention summaries for matrix/radar visualizations
 */
export function deriveCategoryRetentionSummaries(
  cards: Flashcard[],
  retentionMap: RetentionMap
): CategoryRetentionSummary[] {
  const groups: Record<string, CardRetentionState[]> = {}

  cards.forEach((c) => {
    const cat = c.category || "_general"
    if (!groups[cat]) groups[cat] = []
    const state = retentionMap[c.id]
    if (state) groups[cat].push(state)
  })

  return Object.entries(groups).map(([cat, cardStates]) => {
    const total = cardStates.length
    let masteredCount = 0;
    let dueCount = 0;
    let lapsedCount = 0;
    let sumR = 0;
    let sumS = 0;

    for (const s of cardStates) {
      if (s.urgencyLevel === "MASTERED") masteredCount++;
      else if (s.urgencyLevel === "DUE" || s.urgencyLevel === "APPROACHING_DECAY") dueCount++;
      else if (s.urgencyLevel === "CRITICAL_LAPSED") lapsedCount++;

      sumR += s.currentRetrievability;
      sumS += s.stability;
    }

    const avgR = total > 0 ? Math.round((sumR / total) * 100) / 100 : 0;
    const avgS = total > 0 ? Math.round((sumS / total) * 10) / 10 : 0;

    return {
      category: cat,
      totalCards: total,
      masteredCount,
      dueCount,
      lapsedCount,
      averageRetrievability: avgR,
      averageStabilityDays: avgS,
    }
  })
}

/**
 * Storage Helpers
 */
export function loadRetentionMap(subjectId: string, userId?: string | null): RetentionMap {
  if (typeof window === "undefined") return {}
  try {
    const key = getNamespacedKey(`${CARD_RETENTION_BASE_KEY}_${subjectId}`, userId)
    const raw = localStorage.getItem(key)
    if (!raw) return {}
    return JSON.parse(raw) as RetentionMap
  } catch {
    return {}
  }
}

export function saveRetentionMap(
  subjectId: string,
  map: RetentionMap,
  userId?: string | null
): void {
  if (typeof window === "undefined") return
  try {
    const key = getNamespacedKey(`${CARD_RETENTION_BASE_KEY}_${subjectId}`, userId)
    localStorage.setItem(key, JSON.stringify(map))
  } catch {}
}
