/**
 * @mold/analytics - Microsoft Clarity Behavioral Telemetry Bridge
 *
 * Provides real-user monitoring (RUM), frustration pattern detection
 * (rage clicks, dead clicks, excessive scrolling), and two-way integration
 * between MOLD V2's internal TelemetryCollector and Microsoft Clarity.
 */

import { telemetryCollector } from "@/lib/telemetry/telemetry-collector"
import type {
  CognitiveTelemetryEvent,
  RageClickEvent,
  DeadClickEvent,
  ExcessiveScrollEvent,
  BehavioralTelemetrySummary,
} from "@/lib/telemetry/telemetry-types"
import { loadSubjectRuns } from "@/lib/utils/user-storage"
import Clarity from "@microsoft/clarity"

declare global {
  interface Window {
    clarity?: {
      (command: "set", key: string, value: string | string[]): void
      (command: "event", eventName: string, eventData?: Record<string, unknown>): void
      (command: "identify", userId: string, sessionId?: string): void
      q?: unknown[]
    }
  }
}

/**
 * Send custom event to Microsoft Clarity if active
 */
export function trackClarityEvent(name: string, data?: Record<string, unknown>): void {
  if (typeof window !== "undefined") {
    try {
      if (data && typeof window.clarity === "function") {
        window.clarity("event", name, data)
      } else {
        Clarity.event(name)
      }
    } catch {
      // Ignore delivery errors
    }
    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", `clarity_${name}`, data)
      } catch {
        // Ignore delivery errors
      }
    }
  }
}

/**
 * Set custom tag / dimension in Microsoft Clarity (e.g. subjectId, gameMode)
 */
export function setClarityTag(key: string, value: string): void {
  if (typeof window !== "undefined") {
    try {
      Clarity.setTag(key, value)
    } catch {
      // Ignore tag errors
    }
  }
}

/**
 * Set user identity in Microsoft Clarity
 */
export function identifyClarityUser(userId: string): void {
  if (typeof window !== "undefined") {
    try {
      Clarity.identify(userId)
    } catch {
      // Ignore identity errors
    }
  }
}

interface ClickRecord {
  target: EventTarget | null
  time: number
  x: number
  y: number
}

const RAGE_CLICK_THRESHOLD_MS = 600
const RAGE_CLICK_MIN_COUNT = 3
const EXCESSIVE_SCROLL_VELOCITY = 1500 // px/s

let isDetectorAttached = false
let recentClicks: ClickRecord[] = []
let lastScrollY = 0
let lastScrollTime = 0

/**
 * Checks if an element is legitimately interactive
 */
function isInteractiveElement(el: Element | null): boolean {
  if (!el) return false
  const interactiveTags = new Set(["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA", "DETAILS", "SUMMARY"])
  let curr: Element | null = el

  while (curr && curr !== document.body) {
    if (interactiveTags.has(curr.tagName)) return true
    if (curr.getAttribute("role") === "button" || curr.getAttribute("role") === "link") return true
    if (curr.getAttribute("tabindex") && curr.getAttribute("tabindex") !== "-1") return true
    if (curr.hasAttribute("onclick")) return true
    const computed = window.getComputedStyle ? window.getComputedStyle(curr) : null
    if (computed && computed.cursor === "pointer") return true
    curr = curr.parentElement
  }
  return false
}

/**
 * Attach passive DOM listeners to automatically detect UI friction signals
 * (Rage clicks, Dead clicks, and Excessive scroll velocity)
 */
export function attachFrictionDetector(activeSubjectId: string = "human-computer-interaction"): () => void {
  if (typeof window === "undefined" || isDetectorAttached) {
    return () => {}
  }

  isDetectorAttached = true

  const handleClick = (e: MouseEvent) => {
    const now = Date.now()
    const target = e.target as HTMLElement | null
    const targetTag = target?.tagName?.toLowerCase() || "unknown"
    const targetText = target?.innerText?.slice(0, 30)?.trim()

    // 1. Rage Click Detection
    recentClicks = recentClicks.filter((c) => now - c.time < RAGE_CLICK_THRESHOLD_MS)
    recentClicks.push({ target, time: now, x: e.clientX, y: e.clientY })

    const sameTargetClicks = recentClicks.filter((c) => c.target === target)
    if (sameTargetClicks.length >= RAGE_CLICK_MIN_COUNT) {
      const rageEvent: RageClickEvent = {
        id: `rage_${now}_${Math.random().toString(36).substring(2, 6)}`,
        type: "rage_click",
        timestamp: new Date().toISOString(),
        subjectId: activeSubjectId,
        category: "behavioral-friction",
        targetTag,
        targetText,
        clickCount: sameTargetClicks.length,
        coordinate: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
      }

      telemetryCollector.record(rageEvent)
      trackClarityEvent("rage_click", {
        target: targetTag,
        text: targetText,
        count: sameTargetClicks.length,
        x: e.clientX,
        y: e.clientY,
      })

      // Reset to prevent spamming
      recentClicks = []
      return
    }

    // 2. Dead Click Detection
    if (!isInteractiveElement(target)) {
      const deadEvent: DeadClickEvent = {
        id: `dead_${now}_${Math.random().toString(36).substring(2, 6)}`,
        type: "dead_click",
        timestamp: new Date().toISOString(),
        subjectId: activeSubjectId,
        category: "behavioral-friction",
        targetTag,
        targetText,
        coordinate: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
      }

      telemetryCollector.record(deadEvent)
      trackClarityEvent("dead_click", {
        target: targetTag,
        text: targetText,
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleScroll = () => {
    const now = Date.now()
    const currentY = window.scrollY

    if (lastScrollTime <= 0) {
      lastScrollY = currentY
      lastScrollTime = now
      return
    }

    const dt = (now - lastScrollTime) / 1000
    if (dt <= 0.05) {
      lastScrollY = currentY
      lastScrollTime = now
      return
    }

    const dy = Math.abs(currentY - lastScrollY)
    const velocity = dy / dt
    if (velocity > EXCESSIVE_SCROLL_VELOCITY) {
      const scrollEvent: ExcessiveScrollEvent = {
        id: `scroll_${now}_${Math.random().toString(36).substring(2, 6)}`,
        type: "excessive_scroll",
        timestamp: new Date().toISOString(),
        subjectId: activeSubjectId,
        category: "behavioral-friction",
        scrollVelocity: Math.round(velocity),
        direction: currentY > lastScrollY ? "down" : "up",
      }
      telemetryCollector.record(scrollEvent)
      trackClarityEvent("excessive_scroll", { velocity: Math.round(velocity) })
    }

    lastScrollY = currentY
    lastScrollTime = now
  }

  window.addEventListener("click", handleClick, { passive: true, capture: true })
  window.addEventListener("scroll", handleScroll, { passive: true })

  return () => {
    isDetectorAttached = false
    window.removeEventListener("click", handleClick, { capture: true })
    window.removeEventListener("scroll", handleScroll)
  }
}

/**
 * Aggregates behavioral telemetry events into a unified friction summary
 * based 100% on actual user interactions and recorded sessions without simulations or mocks.
 */
export function getBehavioralTelemetrySummary(subjectId?: string): BehavioralTelemetrySummary {
  const events = telemetryCollector.getEvents(subjectId ? { subjectId } : undefined)
  const actualRuns = loadSubjectRuns(subjectId)

  let rageClicks = 0
  let deadClicks = 0
  let excessiveScrolls = 0
  let quickBacks = 0
  let totalClicks = 0

  for (const ev of events) {
    if (ev.type === "rage_click") rageClicks++
    if (ev.type === "dead_click") deadClicks++
    if (ev.type === "excessive_scroll") excessiveScrolls++
    if (ev.type === "quick_back") quickBacks++
    if (
      ev.type === "question_answered" ||
      ev.type === "card_flipped" ||
      ev.type === "rating_submitted" ||
      ev.type === "hint_opened"
    ) {
      totalClicks++
    }
  }

  // Count answered questions from completed run records if in-memory click buffer was cleared
  const runsItemCount = actualRuns.reduce((acc, r) => acc + (r.totalQuestions || 0), 0)
  const effectiveClicks = Math.max(totalClicks, runsItemCount)
  const totalSessions = actualRuns.length

  const frictionCount = rageClicks * 3 + deadClicks * 2 + excessiveScrolls + quickBacks
  const totalInteractions = effectiveClicks + frictionCount
  const frictionIndex = totalInteractions > 0 ? Math.min(100, Math.round((frictionCount / totalInteractions) * 100)) : 0

  return {
    totalSessions,
    totalClicks: effectiveClicks,
    rageClicks,
    deadClicks,
    excessiveScrolls,
    quickBacks,
    frictionIndex,
  }
}
