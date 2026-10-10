import { test, describe } from "node:test"
import assert from "node:assert"
import {
  BASELINE_LIGHTHOUSE_REPORT,
  measureClientPerformance,
} from "./lighthouse-service"

describe("Google Lighthouse & Core Web Vitals Service", () => {
  test("BASELINE_LIGHTHOUSE_REPORT has valid overall score and categories", () => {
    assert.ok(BASELINE_LIGHTHOUSE_REPORT.overallScore >= 95)
    assert.strictEqual(BASELINE_LIGHTHOUSE_REPORT.categories.performance.score, 98)
    assert.strictEqual(BASELINE_LIGHTHOUSE_REPORT.categories.accessibility.score, 100)
    assert.strictEqual(BASELINE_LIGHTHOUSE_REPORT.categories["best-practices"].score, 100)
    assert.strictEqual(BASELINE_LIGHTHOUSE_REPORT.categories.seo.score, 100)
  })

  test("Core Web Vitals include all critical metrics (LCP, INP, CLS, FCP, TBT)", () => {
    const metrics = BASELINE_LIGHTHOUSE_REPORT.coreWebVitals
    const ids = metrics.map((m) => m.id)

    assert.ok(ids.includes("lcp"), "Should include LCP")
    assert.ok(ids.includes("inp"), "Should include INP")
    assert.ok(ids.includes("cls"), "Should include CLS")
    assert.ok(ids.includes("fcp"), "Should include FCP")
    assert.ok(ids.includes("tbt"), "Should include TBT")

    for (const m of metrics) {
      assert.strictEqual(m.status, "good")
      assert.ok(m.value.length > 0)
    }
  })

  test("measureClientPerformance returns valid fallback values in SSR / Node environment", () => {
    const live = measureClientPerformance()
    assert.ok(typeof live.ttfbMs === "number" && live.ttfbMs > 0)
    assert.ok(typeof live.fcpMs === "number" && live.fcpMs > 0)
    assert.ok(typeof live.domContentLoadedMs === "number" && live.domContentLoadedMs > 0)
    assert.ok(typeof live.networkType === "string")
  })
})
