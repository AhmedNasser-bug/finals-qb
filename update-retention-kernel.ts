import fs from 'fs';

let content = fs.readFileSync('lib/telemetry/retention-kernel.ts', 'utf8');

const oldDerive = `export function deriveCategoryRetentionSummaries(
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
    const mastered = cardStates.filter((s) => s.urgencyLevel === "MASTERED").length
    const due = cardStates.filter((s) => s.urgencyLevel === "DUE" || s.urgencyLevel === "APPROACHING_DECAY").length
    const lapsed = cardStates.filter((s) => s.urgencyLevel === "CRITICAL_LAPSED").length

    const avgR =
      total > 0
        ? Math.round((cardStates.reduce((acc, s) => acc + s.currentRetrievability, 0) / total) * 100) / 100
        : 0
    const avgS =
      total > 0
        ? Math.round((cardStates.reduce((acc, s) => acc + s.stability, 0) / total) * 10) / 10
        : 0

    return {
      category: cat,
      totalCards: total,
      masteredCount: mastered,
      dueCount: due,
      lapsedCount: lapsed,
      averageRetrievability: avgR,
      averageStabilityDays: avgS,
    }
  })
}`;

const newDerive = `export function deriveCategoryRetentionSummaries(
  cards: Flashcard[],
  retentionMap: RetentionMap
): CategoryRetentionSummary[] {
  const groups: Record<string, { total: number, mastered: number, due: number, lapsed: number, sumR: number, sumS: number }> = {}

  // O(N) single pass grouping and aggregation to avoid multiple array allocations and chained .filter()/.reduce() calls
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i]
    const cat = c.category || "_general"
    if (!groups[cat]) {
      groups[cat] = { total: 0, mastered: 0, due: 0, lapsed: 0, sumR: 0, sumS: 0 }
    }
    const state = retentionMap[c.id]
    if (state) {
      const g = groups[cat]
      g.total++
      if (state.urgencyLevel === "MASTERED") {
        g.mastered++
      } else if (state.urgencyLevel === "DUE" || state.urgencyLevel === "APPROACHING_DECAY") {
        g.due++
      } else if (state.urgencyLevel === "CRITICAL_LAPSED") {
        g.lapsed++
      }
      g.sumR += state.currentRetrievability
      g.sumS += state.stability
    }
  }

  return Object.keys(groups).map((cat) => {
    const stats = groups[cat]
    const total = stats.total
    const avgR = total > 0 ? Math.round((stats.sumR / total) * 100) / 100 : 0
    const avgS = total > 0 ? Math.round((stats.sumS / total) * 10) / 10 : 0

    return {
      category: cat,
      totalCards: total,
      masteredCount: stats.mastered,
      dueCount: stats.due,
      lapsedCount: stats.lapsed,
      averageRetrievability: avgR,
      averageStabilityDays: avgS,
    }
  })
}`;

content = content.replace(oldDerive, newDerive);

const oldEvaluate = `export function evaluateDeckRetention(
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
}`;

const newEvaluate = `export function evaluateDeckRetention(
  cards: Flashcard[],
  retentionMap: RetentionMap,
  subjectId: string,
  nowMs: number = Date.now()
): RetentionMap {
  const updatedMap: RetentionMap = {}

  // Pre-calculate inverse for faster multiplication instead of division
  const msToDays = 1 / (1000 * 60 * 60 * 24)

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    let existing = retentionMap[card.id]

    if (!existing) {
      existing = createInitialCardState(card, subjectId)
    }

    if (!existing.lastReviewedAt) {
      updatedMap[card.id] = { ...existing, urgencyLevel: "NEW", currentRetrievability: 1.0 }
      continue
    }

    // Fast-path for Date.parse over new Date() object allocation
    const lastReviewedStr = existing.lastReviewedAt
    let lastMs = typeof lastReviewedStr === 'number'
        ? lastReviewedStr
        : Date.parse(lastReviewedStr as unknown as string);

    if (isNaN(lastMs)) {
        lastMs = new Date(lastReviewedStr).getTime()
    }

    const elapsedDays = Math.max(0, (nowMs - lastMs) * msToDays)
    const r = calculateRetrievability(existing.stability, elapsedDays)
    const urgency = classifyUrgency(r, existing.repetitions)

    updatedMap[card.id] = {
      ...existing,
      currentRetrievability: r,
      urgencyLevel: urgency,
    }
  }

  return updatedMap
}`;

content = content.replace(oldEvaluate, newEvaluate);

const oldUpdate = `export function updateCardRetention(
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
  const nextDueDate = new Date(nextDueMs).toISOString()`;

const newUpdate = `export function updateCardRetention(
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

  // Fast-path parsing
  let nowMs = typeof nowIso === 'number' ? nowIso : Date.parse(nowIso);
  if (isNaN(nowMs)) nowMs = new Date(nowIso).getTime();

  const nextDueMs = nowMs + newInterval * 24 * 60 * 60 * 1000
  const nextDueDate = new Date(nextDueMs).toISOString()`;

content = content.replace(oldUpdate, newUpdate);

fs.writeFileSync('lib/telemetry/retention-kernel.ts', content);
