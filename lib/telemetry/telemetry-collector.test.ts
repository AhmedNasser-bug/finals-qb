import { test, describe, beforeEach } from "node:test"
import assert from "node:assert/strict"
import { telemetryCollector } from "./telemetry-collector.ts"
import type { CardFlippedEvent, RatingSubmittedEvent } from "./telemetry-types.ts"

// Mock localStorage for node test environment
const mockStorage: Record<string, string> = {}
;(globalThis as any).localStorage = {
  getItem: (k: string) => mockStorage[k] ?? null,
  setItem: (k: string, v: string) => {
    mockStorage[k] = v
  },
  removeItem: (k: string) => {
    delete mockStorage[k]
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k])
  },
}
;(globalThis as any).window = {}

describe("TelemetryCollector", () => {
  beforeEach(() => {
    telemetryCollector.clear()
    localStorage.clear()
  })

  test("records events and assigns unique id and timestamp if missing", () => {
    const event: CardFlippedEvent = {
      id: "",
      type: "card_flipped",
      cardId: "card-1",
      subjectId: "toc",
      category: "automata",
      timestamp: "",
      durationBeforeFlipMs: 2500,
    }

    telemetryCollector.record(event)
    const stored = telemetryCollector.getEvents({ subjectId: "toc" })

    assert.equal(stored.length, 1)
    assert.ok(stored[0].id.startsWith("evt_"))
    assert.ok(stored[0].timestamp.length > 0)
    assert.equal((stored[0] as CardFlippedEvent).durationBeforeFlipMs, 2500)
  })

  test("notifies subscribed listeners synchronously", () => {
    let notifiedEvent: any = null
    const unsubscribe = telemetryCollector.subscribe((evt) => {
      notifiedEvent = evt
    })

    const ratingEvt: RatingSubmittedEvent = {
      id: "evt-test-1",
      type: "rating_submitted",
      cardId: "card-99",
      subjectId: "toc",
      category: "grammar",
      timestamp: new Date().toISOString(),
      rating: "easy",
      decisionLatencyMs: 1200,
    }

    telemetryCollector.record(ratingEvt)
    assert.ok(notifiedEvent)
    assert.equal(notifiedEvent.cardId, "card-99")
    assert.equal(notifiedEvent.rating, "easy")

    unsubscribe()
    notifiedEvent = null
    telemetryCollector.record(ratingEvt)
    assert.equal(notifiedEvent, null)
  })

  test("persists and reloads events from localStorage with namespacing", () => {
    const event: CardFlippedEvent = {
      id: "evt-persist-1",
      type: "card_flipped",
      cardId: "card-p1",
      subjectId: "algorithms",
      category: "trees",
      timestamp: new Date().toISOString(),
      durationBeforeFlipMs: 1800,
    }

    telemetryCollector.record(event, "user_123")
    const loaded = telemetryCollector.loadStoredEvents("algorithms", "user_123")
    assert.equal(loaded.length, 1)
    assert.equal((loaded[0] as CardFlippedEvent).cardId, "card-p1")
  })
})
