import { test, describe } from "node:test"
import assert from "node:assert/strict"
import {
  calculateRetrievability,
  deriveQualityScore,
  classifyUrgency,
  updateCardRetention,
  evaluateDeckRetention,
  createInitialCardState,
  deriveCategoryRetentionSummaries,
} from "./retention-kernel.ts"
import type { Flashcard } from "../types/mold-types.ts"

describe("Retention Kernel Math & SuperMemo Algorithms", () => {
  test("calculateRetrievability calculates exponential decay R(t) = e^(-t/S)", () => {
    // Fresh (0 days elapsed) -> R = 1.0
    assert.equal(calculateRetrievability(5, 0), 1.0)

    // Half-life t = S -> R = e^(-1) ≈ 0.368
    assert.equal(calculateRetrievability(5, 5), 0.368)

    // Elapsed 2.5 days on 5-day stability -> e^(-0.5) ≈ 0.607
    assert.equal(calculateRetrievability(5, 2.5), 0.607)

    // Handled zero or negative stability gracefully
    assert.equal(calculateRetrievability(0, 5), 0)
  })

  test("deriveQualityScore incorporates cognitive latency penalty", () => {
    // Normal fast recall
    assert.equal(deriveQualityScore("easy", 1200), 5)
    assert.equal(deriveQualityScore("good", 2000), 4)

    // High hesitation penalty (> 7000ms)
    assert.equal(deriveQualityScore("easy", 8500), 4)
    assert.equal(deriveQualityScore("good", 9200), 3)

    // Again/Hard remain unchanged
    assert.equal(deriveQualityScore("again", 10000), 1)
    assert.equal(deriveQualityScore("hard", 9000), 3)
  })

  test("classifyUrgency categorizes retrievability thresholds", () => {
    assert.equal(classifyUrgency(1.0, 0), "NEW")
    assert.equal(classifyUrgency(0.95, 3), "MASTERED")
    assert.equal(classifyUrgency(0.85, 2), "APPROACHING_DECAY")
    assert.equal(classifyUrgency(0.65, 2), "DUE")
    assert.equal(classifyUrgency(0.40, 1), "CRITICAL_LAPSED")
  })

  test("updateCardRetention progresses SM-2 intervals on successful reviews", () => {
    const card: Flashcard = {
      id: "c1",
      category: "automata",
      term: "DFA",
      definition: "Deterministic Finite Automaton",
    }
    const initial = createInitialCardState(card, "toc")

    // First review with 'good'
    const r1 = updateCardRetention(initial, "good", 1500)
    assert.equal(r1.repetitions, 1)
    assert.equal(r1.intervalDays, 1)
    assert.equal(r1.stability, 2.0)
    assert.equal(r1.urgencyLevel, "MASTERED")

    // Second review with 'good'
    const r2 = updateCardRetention(r1, "good", 1200)
    assert.equal(r2.repetitions, 2)
    assert.equal(r2.intervalDays, 6)
    assert.equal(r2.stability, 5.0)

    // Third review with 'again' (lapse)
    const lapsed = updateCardRetention(r2, "again", 4000)
    assert.equal(lapsed.repetitions, 0)
    assert.equal(lapsed.intervalDays, 1)
    assert.equal(lapsed.lapses, 1)
    assert.ok(lapsed.stability < r2.stability)
  })

  test("evaluateDeckRetention computes decayed status across time", () => {
    const cards: Flashcard[] = [
      { id: "c1", category: "math", term: "T1", definition: "D1" },
      { id: "c2", category: "math", term: "T2", definition: "D2" },
    ]

    const initialMap = {
      c1: {
        ...createInitialCardState(cards[0], "math"),
        repetitions: 1,
        stability: 2.0,
        lastReviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      },
      c2: {
        ...createInitialCardState(cards[1], "math"),
        repetitions: 2,
        stability: 10.0,
        lastReviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
    }

    const evaluated = evaluateDeckRetention(cards, initialMap, "math")
    assert.ok(evaluated["c1"].currentRetrievability < 0.2) // Highly decayed
    assert.equal(evaluated["c1"].urgencyLevel, "CRITICAL_LAPSED")

    assert.ok(evaluated["c2"].currentRetrievability > 0.85) // Stable
    assert.equal(evaluated["c2"].urgencyLevel, "MASTERED")
  })

  test("deriveCategoryRetentionSummaries aggregates metrics per topic", () => {
    const cards: Flashcard[] = [
      { id: "c1", category: "cfg", term: "T1", definition: "D1" },
      { id: "c2", category: "cfg", term: "T2", definition: "D2" },
      { id: "c3", category: "dfa", term: "T3", definition: "D3" },
    ]

    const map = {
      c1: { ...createInitialCardState(cards[0], "toc"), currentRetrievability: 0.95, urgencyLevel: "MASTERED" as const, stability: 8 },
      c2: { ...createInitialCardState(cards[1], "toc"), currentRetrievability: 0.60, urgencyLevel: "DUE" as const, stability: 3 },
      c3: { ...createInitialCardState(cards[2], "toc"), currentRetrievability: 0.40, urgencyLevel: "CRITICAL_LAPSED" as const, stability: 1 },
    }

    const summaries = deriveCategoryRetentionSummaries(cards, map)
    assert.equal(summaries.length, 2)

    const cfgSummary = summaries.find((s) => s.category === "cfg")
    assert.ok(cfgSummary)
    assert.equal(cfgSummary.totalCards, 2)
    assert.equal(cfgSummary.masteredCount, 1)
    assert.equal(cfgSummary.dueCount, 1)
  })
})
