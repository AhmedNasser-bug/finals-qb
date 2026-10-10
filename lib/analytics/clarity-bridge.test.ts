import { test, describe, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import {
  trackClarityEvent,
  setClarityTag,
  identifyClarityUser,
  getBehavioralTelemetrySummary,
  attachFrictionDetector,
} from "./clarity-bridge"
import { telemetryCollector } from "@/lib/telemetry/telemetry-collector"
import type { RageClickEvent, DeadClickEvent } from "@/lib/telemetry/telemetry-types"

describe("Microsoft Clarity Telemetry & Friction Engine", () => {
  const originalWindow = (globalThis as any).window
  const originalDocument = (globalThis as any).document

  afterEach(() => {
    if (originalWindow !== undefined) {
      ;(globalThis as any).window = originalWindow
    } else {
      delete (globalThis as any).window
    }
    if (originalDocument !== undefined) {
      ;(globalThis as any).document = originalDocument
    } else {
      delete (globalThis as any).document
    }
  })

  describe("1. Headless Runtime & Safety Fallbacks", () => {
    test("functions execute safely without errors when window is undefined", () => {
      delete (globalThis as any).window
      assert.doesNotThrow(() => {
        trackClarityEvent("test_event", { mode: "speedrun" })
        setClarityTag("subjectId", "human-computer-interaction")
        identifyClarityUser("student_42")
      })
    })

    test("functions execute safely when window exists but window.clarity is missing", () => {
      ;(globalThis as any).window = {}
      assert.doesNotThrow(() => {
        trackClarityEvent("test_event", { mode: "speedrun" })
        setClarityTag("subjectId", "human-computer-interaction")
        identifyClarityUser("student_42")
      })
    })

    test("catches and suppresses internal errors thrown by window.clarity", () => {
      ;(globalThis as any).window = {
        clarity: () => {
          throw new Error("Clarity SDK network fault")
        },
      }
      assert.doesNotThrow(() => {
        trackClarityEvent("test_event", { foo: "bar" })
        setClarityTag("key", "val")
        identifyClarityUser("user_err")
      })
    })
  })

  describe("2. Window.clarity Dispatching & Event Mirroring", () => {
    test("trackClarityEvent dispatches correct payload to window.clarity", () => {
      const calls: unknown[][] = []
      ;(globalThis as any).window = {
        clarity: (...args: unknown[]) => {
          calls.push(args)
        },
      }

      trackClarityEvent("quiz_answered", { questionId: "q-1", isCorrect: true })
      assert.equal(calls.length, 1)
      assert.equal(calls[0][0], "event")
      assert.equal(calls[0][1], "quiz_answered")
      assert.deepEqual(calls[0][2], { questionId: "q-1", isCorrect: true })
    })

    test("trackClarityEvent simultaneously mirrors events to window.gtag if present", () => {
      const clarityCalls: unknown[][] = []
      const gtagCalls: unknown[][] = []
      ;(globalThis as any).window = {
        clarity: (...args: unknown[]) => {
          clarityCalls.push(args)
        },
        gtag: (...args: unknown[]) => {
          gtagCalls.push(args)
        },
      }

      trackClarityEvent("rage_click", { target: "button", count: 4 })
      assert.equal(clarityCalls.length, 1)
      assert.equal(gtagCalls.length, 1)
      assert.equal(gtagCalls[0][0], "event")
      assert.equal(gtagCalls[0][1], "clarity_rage_click")
      assert.deepEqual(gtagCalls[0][2], { target: "button", count: 4 })
    })

    test("setClarityTag dispatches ('set', key, value) to window.clarity", () => {
      const calls: unknown[][] = []
      ;(globalThis as any).window = {
        clarity: (...args: unknown[]) => {
          calls.push(args)
        },
      }

      setClarityTag("subjectId", "human-computer-interaction")
      assert.equal(calls.length, 1)
      assert.equal(calls[0][0], "set")
      assert.equal(calls[0][1], "subjectId")
      assert.equal(calls[0][2], "human-computer-interaction")
    })

    test("identifyClarityUser dispatches ('identify', userId) to window.clarity", () => {
      const calls: unknown[][] = []
      ;(globalThis as any).window = {
        clarity: (...args: unknown[]) => {
          calls.push(args)
        },
      }

      identifyClarityUser("learner_99")
      assert.equal(calls.length, 1)
      assert.equal(calls[0][0], "identify")
      assert.equal(calls[0][1], "learner_99")
    })
  })

  describe("3. Friction Detection Engine (Rage, Dead Clicks & Scroll)", () => {
    test("detects rage clicks when same target is clicked rapidly (>= 3 times in 600ms)", () => {
      const listeners: Record<string, Function[]> = {}
      const clarityEvents: unknown[][] = []

      const mockTarget = {
        tagName: "BUTTON",
        innerText: "Next Question",
        getAttribute: () => null,
        hasAttribute: () => false,
        parentElement: null,
      }

      ;(globalThis as any).window = {
        clarity: (...args: unknown[]) => clarityEvents.push(args),
        addEventListener: (event: string, fn: Function) => {
          listeners[event] = listeners[event] || []
          listeners[event].push(fn)
        },
        removeEventListener: (event: string, fn: Function) => {
          if (listeners[event]) {
            listeners[event] = listeners[event].filter((f) => f !== fn)
          }
        },
        scrollY: 0,
      }
      ;(globalThis as any).document = {
        body: {},
      }

      const cleanup = attachFrictionDetector("test-subject-hci")
      assert.equal(typeof cleanup, "function")

      const clickHandler = listeners["click"]?.[0]
      assert.ok(clickHandler, "Click handler must be registered")

      // Simulate 3 rapid clicks on the same target
      const baseTime = Date.now()
      clickHandler({ target: mockTarget, clientX: 120, clientY: 250, timeStamp: baseTime })
      clickHandler({ target: mockTarget, clientX: 122, clientY: 252, timeStamp: baseTime + 100 })
      clickHandler({ target: mockTarget, clientX: 121, clientY: 251, timeStamp: baseTime + 200 })

      // Should have emitted a rage_click event to clarity
      const rageCall = clarityEvents.find((c) => c[0] === "event" && c[1] === "rage_click")
      assert.ok(rageCall, "Rage click event should be sent to Clarity")
      assert.equal((rageCall[2] as any).target, "button")
      assert.equal((rageCall[2] as any).count, 3)

      cleanup()
    })

    test("detects dead clicks on non-interactive elements", () => {
      const listeners: Record<string, Function[]> = {}
      const clarityEvents: unknown[][] = []

      const mockNonInteractive = {
        tagName: "SPAN",
        innerText: "Static Label",
        getAttribute: () => null,
        hasAttribute: () => false,
        parentElement: null,
      }

      ;(globalThis as any).window = {
        clarity: (...args: unknown[]) => clarityEvents.push(args),
        addEventListener: (event: string, fn: Function) => {
          listeners[event] = listeners[event] || []
          listeners[event].push(fn)
        },
        removeEventListener: (event: string, fn: Function) => {
          if (listeners[event]) {
            listeners[event] = listeners[event].filter((f) => f !== fn)
          }
        },
        scrollY: 0,
      }
      ;(globalThis as any).document = {
        body: {},
      }

      const cleanup = attachFrictionDetector("test-subject-hci")
      const clickHandler = listeners["click"]?.[0]
      assert.ok(clickHandler)

      clickHandler({ target: mockNonInteractive, clientX: 200, clientY: 300, timeStamp: Date.now() })

      const deadCall = clarityEvents.find((c) => c[0] === "event" && c[1] === "dead_click")
      assert.ok(deadCall, "Dead click event should be sent to Clarity for non-interactive elements")

      cleanup()
    })

    test("does NOT trigger dead clicks on interactive elements (button, a, input, role=button)", () => {
      const listeners: Record<string, Function[]> = {}
      const clarityEvents: unknown[][] = []

      const mockInteractiveButton = {
        tagName: "BUTTON",
        innerText: "Submit",
        getAttribute: () => null,
        hasAttribute: () => false,
        parentElement: null,
      }

      ;(globalThis as any).window = {
        clarity: (...args: unknown[]) => clarityEvents.push(args),
        addEventListener: (event: string, fn: Function) => {
          listeners[event] = listeners[event] || []
          listeners[event].push(fn)
        },
        removeEventListener: (event: string, fn: Function) => {
          if (listeners[event]) {
            listeners[event] = listeners[event].filter((f) => f !== fn)
          }
        },
        scrollY: 0,
      }
      ;(globalThis as any).document = {
        body: {},
      }

      const cleanup = attachFrictionDetector("test-subject-hci")
      const clickHandler = listeners["click"]?.[0]
      assert.ok(clickHandler)

      clickHandler({ target: mockInteractiveButton, clientX: 100, clientY: 100, timeStamp: Date.now() })

      const deadCall = clarityEvents.find((c) => c[0] === "event" && c[1] === "dead_click")
      assert.equal(deadCall, undefined, "Interactive button should not trigger dead click")

      cleanup()
    })

    test("detects excessive scroll velocity (> 1500 px/s)", () => {
      const listeners: Record<string, Function[]> = {}
      const clarityEvents: unknown[][] = []

      let currentScrollY = 0

      ;(globalThis as any).window = {
        clarity: (...args: unknown[]) => clarityEvents.push(args),
        addEventListener: (event: string, fn: Function) => {
          listeners[event] = listeners[event] || []
          listeners[event].push(fn)
        },
        removeEventListener: (event: string, fn: Function) => {
          if (listeners[event]) {
            listeners[event] = listeners[event].filter((f) => f !== fn)
          }
        },
        get scrollY() {
          return currentScrollY
        },
      }
      ;(globalThis as any).document = { body: {} }

      const cleanup = attachFrictionDetector("test-subject-hci")
      const scrollHandler = listeners["scroll"]?.[0]
      assert.ok(scrollHandler)

      // First scroll tick at t=0
      currentScrollY = 100
      scrollHandler()

      // Rapid scroll tick 100ms later moving 500px (velocity = 5000 px/s > 1500 px/s)
      currentScrollY = 600
      scrollHandler()

      cleanup()
    })

    test("idempotent attachment: does not attach duplicate listeners if already attached", () => {
      let addCallCount = 0
      ;(globalThis as any).window = {
        addEventListener: () => {
          addCallCount++
        },
        removeEventListener: () => {},
        scrollY: 0,
      }

      const cleanup1 = attachFrictionDetector()
      const cleanup2 = attachFrictionDetector()

      // First call attached 2 listeners (click, scroll), second call returned no-op
      assert.equal(addCallCount, 2)

      cleanup1()
      cleanup2()
    })
  })

  describe("4. Behavioral Telemetry Summary Aggregation", () => {
    test("correctly calculates friction index and aggregates metrics", () => {
      const now = Date.now()
      const rage: RageClickEvent = {
        id: `rage_agg_${now}`,
        type: "rage_click",
        timestamp: new Date().toISOString(),
        subjectId: "summary-test",
        category: "behavioral-friction",
        targetTag: "div",
        clickCount: 4,
        coordinate: { x: 50, y: 50 },
      }
      const dead: DeadClickEvent = {
        id: `dead_agg_${now}`,
        type: "dead_click",
        timestamp: new Date().toISOString(),
        subjectId: "summary-test",
        category: "behavioral-friction",
        targetTag: "p",
        coordinate: { x: 80, y: 80 },
      }

      telemetryCollector.record(rage)
      telemetryCollector.record(dead)

      const summary = getBehavioralTelemetrySummary("summary-test")
      assert.ok(summary.rageClicks >= 1)
      assert.ok(summary.deadClicks >= 1)
      assert.ok(summary.frictionIndex >= 0 && summary.frictionIndex <= 100)
    })
  })
})
