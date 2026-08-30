import { describe, test } from "node:test"
import assert from "node:assert/strict"
import type { Question } from "@/lib/mold-types"
import {
  getBloomsWeight,
  sortFullRevisionQuestions,
  getRecallabilityColor,
  weightedQuestionPool,
} from "./recallability"

describe("Bloom's Taxonomy & Full Revision Sorting", () => {
  test("getBloomsWeight resolves taxonomy labels and difficulty correctly", () => {
    const qRemember: Question = {
      id: "q1",
      type: "MCQ",
      difficulty: "Easy",
      category: "cat-1",
      question: "What is X?",
      options: [],
      answer: "A",
      ...({ bloomsTaxonomy: "Remember" } as any),
    }

    const qEvaluate: Question = {
      id: "q2",
      type: "MCQ",
      difficulty: "Hard",
      category: "cat-1",
      question: "Evaluate X vs Y",
      options: [],
      answer: "A",
      ...({ bloomsTaxonomy: "Evaluate" } as any),
    }

    const qFallbackHard: Question = {
      id: "q3",
      type: "MCQ",
      difficulty: "Hard",
      category: "cat-1",
      question: "Prove theorem",
      options: [],
      answer: "A",
    }

    const qFallbackEasy: Question = {
      id: "q4",
      type: "MCQ",
      difficulty: "Easy",
      category: "cat-1",
      question: "Define state",
      options: [],
      answer: "A",
    }

    assert.strictEqual(getBloomsWeight(qRemember), 1)
    assert.strictEqual(getBloomsWeight(qEvaluate), 5)
    assert.strictEqual(getBloomsWeight(qFallbackHard), 5)
    assert.strictEqual(getBloomsWeight(qFallbackEasy), 1)
  })

  test("sortFullRevisionQuestions preserves category sequence and sorts within each category", () => {
    const questions: Question[] = [
      // Category B (appears first)
      { id: "b3", type: "MCQ", difficulty: "Hard", category: "cat-b", question: "B Hard", options: [], answer: "A" },
      { id: "b1", type: "MCQ", difficulty: "Easy", category: "cat-b", question: "B Easy", options: [], answer: "A" },
      { id: "b2", type: "MCQ", difficulty: "Medium", category: "cat-b", question: "B Med", options: [], answer: "A" },

      // Category A (appears second)
      { id: "a3", type: "MCQ", difficulty: "Hard", category: "cat-a", question: "A Hard", options: [], answer: "A" },
      { id: "a2", type: "MCQ", difficulty: "Medium", category: "cat-a", question: "A Med", options: [], answer: "A" },
      { id: "a1", type: "MCQ", difficulty: "Easy", category: "cat-a", question: "A Easy", options: [], answer: "A" },
    ]

    const sorted = sortFullRevisionQuestions(questions)

    // 1. Categories MUST remain in order of first appearance: cat-b first, then cat-a
    assert.strictEqual(sorted[0].category, "cat-b")
    assert.strictEqual(sorted[1].category, "cat-b")
    assert.strictEqual(sorted[2].category, "cat-b")
    assert.strictEqual(sorted[3].category, "cat-a")
    assert.strictEqual(sorted[4].category, "cat-a")
    assert.strictEqual(sorted[5].category, "cat-a")

    // 2. Questions within cat-b sorted ascending by Bloom's / difficulty: Easy -> Medium -> Hard
    assert.strictEqual(sorted[0].id, "b1") // Easy
    assert.strictEqual(sorted[1].id, "b2") // Medium
    assert.strictEqual(sorted[2].id, "b3") // Hard

    // 3. Questions within cat-a sorted ascending by Bloom's / difficulty: Easy -> Medium -> Hard
    assert.strictEqual(sorted[3].id, "a1") // Easy
    assert.strictEqual(sorted[4].id, "a2") // Medium
    assert.strictEqual(sorted[5].id, "a3") // Hard
  })

  test("handles empty and single element pools gracefully", () => {
    assert.deepStrictEqual(sortFullRevisionQuestions([]), [])
    const single: Question[] = [{ id: "s1", type: "MCQ", difficulty: "Easy", category: "c1", question: "Q", options: [], answer: "A" }]
    assert.deepStrictEqual(sortFullRevisionQuestions(single), single)
  })
})

describe("Category Recallability & Color Grading", () => {
  test("getRecallabilityColor maps scores from Green (high) to Red (low)", () => {
    const green = getRecallabilityColor(90)
    assert.strictEqual(green.tier, "mastered")
    assert.ok(green.textColor.includes("emerald"))

    const lime = getRecallabilityColor(70)
    assert.strictEqual(lime.tier, "good")
    assert.ok(lime.textColor.includes("lime"))

    const yellow = getRecallabilityColor(55)
    assert.strictEqual(yellow.tier, "developing")
    assert.ok(yellow.textColor.includes("amber"))

    const red = getRecallabilityColor(30)
    assert.strictEqual(red.tier, "critical")
    assert.ok(red.textColor.includes("red"))
  })
})

describe("Recallability-Weighted Question Pool Randomization", () => {
  test("weightedQuestionPool prioritizes lower recallability categories with higher frequency", () => {
    const questions: Question[] = [
      // 10 questions in mastered category (95% recall)
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `mastered-${i}`,
        type: "MCQ" as const,
        difficulty: "Easy" as const,
        category: "mastered-topic",
        question: `Mastered Q ${i}`,
        options: [],
        answer: "A",
      })),
      // 10 questions in weak category (10% recall)
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `weak-${i}`,
        type: "MCQ" as const,
        difficulty: "Hard" as const,
        category: "weak-topic",
        question: `Weak Q ${i}`,
        options: [],
        answer: "A",
      })),
    ]

    const recallabilityMap: Record<string, number> = {
      "mastered-topic": 95, // Weight = 10
      "weak-topic": 10,     // Weight = 95
    }

    // Run multiple samples and check that weak questions are selected significantly more often in top slice
    let weakCountInTop5 = 0
    const iterations = 50

    for (let i = 0; i < iterations; i++) {
      const sampled = weightedQuestionPool(questions, recallabilityMap, 5)
      weakCountInTop5 += sampled.filter((q) => q.category === "weak-topic").length
    }

    const avgWeakInTop5 = weakCountInTop5 / iterations
    // Expected: weak questions represent significantly more than 50% of the top 5 (typically 3.5 to 4.5 out of 5)
    assert.ok(
      avgWeakInTop5 > 2.5,
      `Expected weak category questions to appear more frequently in top 5, got avg ${avgWeakInTop5}`
    )
  })

  test("weightedQuestionPool respects questionCount slicing", () => {
    const questions: Question[] = Array.from({ length: 20 }, (_, i) => ({
      id: `q-${i}`,
      type: "MCQ",
      difficulty: "Medium",
      category: "general",
      question: `Question ${i}`,
      options: [],
      answer: "A",
    }))

    const sampled10 = weightedQuestionPool(questions, {}, 10)
    assert.strictEqual(sampled10.length, 10)

    const sampledAll = weightedQuestionPool(questions, {}, 0)
    assert.strictEqual(sampledAll.length, 20)
  })
})
