import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { trackGAEvent, setGAUserProperty } from "./ga-bridge"

describe("Google Analytics GA4 Bridge", () => {
  test("trackGAEvent and setGAUserProperty execute safely in headless runtime", () => {
    assert.doesNotThrow(() => {
      trackGAEvent("test_event", { mode: "speedrun" })
      setGAUserProperty({ role: "learner" })
    })
  })

  test("dispatches to window.gtag when available", () => {
    const calls: unknown[][] = []
    ;(globalThis as any).window = {
      gtag: (...args: unknown[]) => {
        calls.push(args)
      },
    }

    trackGAEvent("quiz_complete", { score: 95 })
    assert.equal(calls.length, 1)
    assert.equal(calls[0][0], "event")
    assert.equal(calls[0][1], "quiz_complete")
    assert.deepEqual(calls[0][2], { score: 95 })

    // Clean up
    delete (globalThis as any).window
  })
})
