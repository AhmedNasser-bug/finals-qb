import { test, describe } from "node:test"
import assert from "node:assert"
import {
  trackClarityEvent,
  setClarityTag,
  identifyClarityUser,
  getBehavioralTelemetrySummary,
  attachFrictionDetector,
} from "./clarity-bridge"
import { telemetryCollector } from "@/lib/telemetry/telemetry-collector"
import type { RageClickEvent, DeadClickEvent } from "@/lib/telemetry/telemetry-types"

describe("Microsoft Clarity Bridge & Friction Telemetry", () => {
  test("trackClarityEvent and setClarityTag execute safely in headless / non-window runtime", () => {
    assert.doesNotThrow(() => {
      trackClarityEvent("test_event", { foo: "bar" })
      setClarityTag("subjectId", "human-computer-interaction")
      identifyClarityUser("user_test_123")
    })
  })

  test("getBehavioralTelemetrySummary aggregates friction metrics and calculates friction index", () => {
    const now = Date.now()
    const rageEv: RageClickEvent = {
      id: `rage_test_${now}`,
      type: "rage_click",
      timestamp: new Date().toISOString(),
      subjectId: "test-subject",
      category: "behavioral-friction",
      targetTag: "button",
      clickCount: 3,
      coordinate: { x: 100, y: 200 },
    }

    const deadEv: DeadClickEvent = {
      id: `dead_test_${now}`,
      type: "dead_click",
      timestamp: new Date().toISOString(),
      subjectId: "test-subject",
      category: "behavioral-friction",
      targetTag: "span",
      coordinate: { x: 150, y: 250 },
    }

    telemetryCollector.record(rageEv)
    telemetryCollector.record(deadEv)

    const summary = getBehavioralTelemetrySummary("test-subject")
    assert.ok(summary.rageClicks >= 1, "Rage clicks should be recorded")
    assert.ok(summary.deadClicks >= 1, "Dead clicks should be recorded")
    assert.ok(summary.frictionIndex >= 0 && summary.frictionIndex <= 100, "Friction index should be between 0 and 100")
  })

  test("attachFrictionDetector returns cleanup function", () => {
    const cleanup = attachFrictionDetector("test-subject")
    assert.strictEqual(typeof cleanup, "function")
    assert.doesNotThrow(() => cleanup())
  })
})
