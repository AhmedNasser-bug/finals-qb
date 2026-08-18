import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { analyzeCognitiveLoad } from "./fatigue-detector.ts"
import type { RatingSubmittedEvent } from "./telemetry-types.ts"

describe("Cognitive Fatigue & Hesitation Detector", () => {
  test("returns OPTIMAL for fast response times below baseline", () => {
    const events: RatingSubmittedEvent[] = [
      { id: "1", type: "rating_submitted", cardId: "c1", subjectId: "s", category: "c", timestamp: "", rating: "good", decisionLatencyMs: 1500 },
      { id: "2", type: "rating_submitted", cardId: "c2", subjectId: "s", category: "c", timestamp: "", rating: "easy", decisionLatencyMs: 1800 },
    ]

    const analysis = analyzeCognitiveLoad(events, 2500)
    assert.equal(analysis.advice, "OPTIMAL")
    assert.ok(analysis.cognitiveHesitationIndex < 1.0)
  })

  test("triggers SUGGEST_BREAK when response latency spikes and shows strong positive slope", () => {
    const events: RatingSubmittedEvent[] = [
      { id: "1", type: "rating_submitted", cardId: "c1", subjectId: "s", category: "c", timestamp: "", rating: "good", decisionLatencyMs: 2000 },
      { id: "2", type: "rating_submitted", cardId: "c2", subjectId: "s", category: "c", timestamp: "", rating: "good", decisionLatencyMs: 2500 },
      { id: "3", type: "rating_submitted", cardId: "c3", subjectId: "s", category: "c", timestamp: "", rating: "hard", decisionLatencyMs: 6500 },
      { id: "4", type: "rating_submitted", cardId: "c4", subjectId: "s", category: "c", timestamp: "", rating: "again", decisionLatencyMs: 8000 },
    ]

    const analysis = analyzeCognitiveLoad(events, 2500)
    assert.equal(analysis.advice, "SUGGEST_BREAK")
    assert.ok(analysis.recentLatencySlope > 3000)
  })
})
