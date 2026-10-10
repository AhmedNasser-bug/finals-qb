import { test, describe } from "node:test"
import assert from "node:assert"
import {
  computeLiveLighthouseReport,
  measureClientPerformance,
} from "./lighthouse-service"

describe("Google Lighthouse & Core Web Vitals Service", () => {
  test("computeLiveLighthouseReport produces a complete and valid audit report", () => {
    const report = computeLiveLighthouseReport()
    assert.ok(report.overallScore >= 80, "Overall score should be high")
    assert.ok(report.categories.performance.score >= 80)
    assert.ok(report.categories.accessibility.score >= 80)
    assert.ok(report.categories["best-practices"].score >= 80)
    assert.ok(report.categories.seo.score >= 80)
    assert.ok(report.audits.length >= 5, "Report should contain detailed audit items")
  })

  test("Core Web Vitals include all critical metrics (LCP, INP, CLS, FCP, TBT)", () => {
    const report = computeLiveLighthouseReport()
    const metrics = report.coreWebVitals
    const ids = metrics.map((m) => m.id)

    assert.ok(ids.includes("lcp"), "Should include LCP")
    assert.ok(ids.includes("inp"), "Should include INP")
    assert.ok(ids.includes("cls"), "Should include CLS")
    assert.ok(ids.includes("fcp"), "Should include FCP")
    assert.ok(ids.includes("tbt"), "Should include TBT")

    for (const m of metrics) {
      assert.ok(["good", "needs-improvement", "poor"].includes(m.status))
      assert.ok(m.value.length > 0)
    }
  })

  test("measureClientPerformance returns valid timing values in SSR / Node environment", () => {
    const live = measureClientPerformance()
    assert.ok(typeof live.ttfbMs === "number" && live.ttfbMs > 0)
    assert.ok(typeof live.fcpMs === "number" && live.fcpMs > 0)
    assert.ok(typeof live.domContentLoadedMs === "number" && live.domContentLoadedMs > 0)
    assert.ok(typeof live.networkType === "string")
  })
})
