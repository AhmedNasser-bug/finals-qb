import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { buildIntelligentFlashcardQueue } from "./intelligent-routing.ts"
import type { Flashcard } from "../types/mold-types.ts"
import { createInitialCardState } from "./retention-kernel.ts"

describe("Intelligent Routing Engine", () => {
  const cards: Flashcard[] = [
    { id: "c1", category: "math", term: "T1", definition: "D1" },
    { id: "c2", category: "math", term: "T2", definition: "D2" },
    { id: "c3", category: "math", term: "T3", definition: "D3" },
    { id: "c4", category: "history", term: "T4", definition: "D4" },
  ]

  const retentionMap = {
    c1: { ...createInitialCardState(cards[0], "subj"), urgencyLevel: "MASTERED" as const, currentRetrievability: 0.95 },
    c2: { ...createInitialCardState(cards[1], "subj"), urgencyLevel: "CRITICAL_LAPSED" as const, currentRetrievability: 0.30 },
    c3: { ...createInitialCardState(cards[2], "subj"), urgencyLevel: "DUE" as const, currentRetrievability: 0.65 },
    c4: { ...createInitialCardState(cards[3], "subj"), urgencyLevel: "NEW" as const, currentRetrievability: 1.0 },
  }

  test("prioritizes Critical and Due cards ahead of Mastered and New in SMART_ADAPTIVE mode", () => {
    const result = buildIntelligentFlashcardQueue(cards, retentionMap, "subj", {
      strategy: "SMART_ADAPTIVE",
    })

    assert.equal(result.queue.length, 4)
    assert.equal(result.queue[0].id, "c2") // Critical first
    assert.equal(result.queue[1].id, "c3") // Due second
    assert.equal(result.queue[2].id, "c4") // New third
    assert.equal(result.queue[3].id, "c1") // Mastered last
  })

  test("filters strictly due cards in DUE_ONLY mode", () => {
    const result = buildIntelligentFlashcardQueue(cards, retentionMap, "subj", {
      strategy: "DUE_ONLY",
    })

    assert.equal(result.queue.length, 2)
    assert.equal(result.queue[0].id, "c2")
    assert.equal(result.queue[1].id, "c3")
  })

  test("filters by category correctly", () => {
    const result = buildIntelligentFlashcardQueue(cards, retentionMap, "subj", {
      strategy: "SMART_ADAPTIVE",
      selectedCategory: "history",
    })

    assert.equal(result.queue.length, 1)
    assert.equal(result.queue[0].id, "c4")
  })
})
