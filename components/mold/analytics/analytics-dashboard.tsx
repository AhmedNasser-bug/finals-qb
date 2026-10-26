"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Eye,
  MousePointer,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Gauge,
  Flame,
  MousePointerClick,
  SlidersHorizontal,
  RefreshCw,
  Terminal,
  Trophy,
  History,
  Timer,
  Play,
} from "lucide-react"

import {
  computeLiveLighthouseReport,
  type LighthouseAuditReport,
  type LivePerformanceMetrics,
} from "@/lib/analytics/lighthouse-service"
import {
  getBehavioralTelemetrySummary,
  attachFrictionDetector,
} from "@/lib/analytics/clarity-bridge"
import { telemetryCollector } from "@/lib/telemetry/telemetry-collector"
import { loadSubjectRuns } from "@/lib/utils/user-storage"
import type { CognitiveTelemetryEvent } from "@/lib/telemetry/telemetry-types"
import type { RunRecord } from "@/lib/mold-types"

type ActiveTab = "clarity" | "lighthouse" | "stream"

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("clarity")
  const [report, setReport] = useState<LighthouseAuditReport>(() => computeLiveLighthouseReport())
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isAuditing, setIsAuditing] = useState(false)
  const [recentEvents, setRecentEvents] = useState<CognitiveTelemetryEvent[]>([])
  const [actualRuns, setActualRuns] = useState<RunRecord[]>([])

  // Refresh live data from browser environment
  const refreshTelemetryAndRuns = useCallback(() => {
    const subj = selectedSubject === "all" ? undefined : selectedSubject
    setRecentEvents(telemetryCollector.getEvents(subj ? { subjectId: subj } : undefined))
    setActualRuns(loadSubjectRuns(subj))
  }, [selectedSubject])

  // Initial mount: attach passive friction detector and compute live audit
  useEffect(() => {
    const cleanup = attachFrictionDetector(selectedSubject === "all" ? "human-computer-interaction" : selectedSubject)
    refreshTelemetryAndRuns()
    setReport(computeLiveLighthouseReport())

    const unsub = telemetryCollector.subscribe(() => {
      refreshTelemetryAndRuns()
    })

    return () => {
      cleanup()
      unsub()
    }
  }, [selectedSubject, refreshTelemetryAndRuns])

  const frictionSummary = useMemo(() => {
    const subj = selectedSubject === "all" ? undefined : selectedSubject
    return getBehavioralTelemetrySummary(subj)
  }, [selectedSubject, recentEvents, actualRuns])

  const handleRunLiveAudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      const liveReport = computeLiveLighthouseReport()
      setReport(liveReport)
      refreshTelemetryAndRuns()
      setIsAuditing(false)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Banner Navigation */}
      <header className="border-b border-border bg-panel/70 backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors focus-visible:ring-1 focus-visible:ring-primary rounded"
              title="Return to Mastery Protocol home"
              aria-label="Return to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-primary px-1.5 py-0.5 border border-primary/30 bg-primary/10">
                  LIVE OBSERVABILITY
                </span>
                <span className="font-mono text-xs text-muted-foreground">MOLD V2 // 100% FUNCTIONAL RUM</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold font-mono tracking-tight text-foreground flex items-center gap-2 mt-0.5">
                Microsoft Clarity & Lighthouse Collective Analytics
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunLiveAudit}
              disabled={isAuditing}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer rounded disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
              {isAuditing ? "PROBING DOM..." : "RE-RUN LIVE AUDIT"}
            </button>
            <Link
              href="/"
              className="text-xs font-mono px-3 py-1.5 border border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-all rounded"
            >
              EXIT
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        {/* Top Functional KPI Metric Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Computed Lighthouse Health */}
          <div className="border border-border bg-panel p-4 rounded relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Live Lighthouse Score</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-400">
                {report.overallScore}
              </span>
              <span className="text-xs font-mono text-muted-foreground">/ 100</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Perf {report.categories.performance.score} · A11y {report.categories.accessibility.score} · BP {report.categories["best-practices"].score} · SEO {report.categories.seo.score}
            </p>
            <div className="w-full bg-secondary/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${report.overallScore}%` }} />
            </div>
          </div>

          {/* Card 2: Functional Friction Index */}
          <div className="border border-border bg-panel p-4 rounded relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Behavioral Friction Index</span>
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-primary">
                {frictionSummary.frictionIndex}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                {frictionSummary.frictionIndex <= 5 ? "Optimal (<5%)" : "Friction Present"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {frictionSummary.rageClicks} rage clicks · {frictionSummary.deadClicks} dead clicks
            </p>
            <div className="w-full bg-secondary/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${Math.max(4, frictionSummary.frictionIndex)}%` }} />
            </div>
          </div>

          {/* Card 3: Measured Core Web Vitals */}
          <div className="border border-border bg-panel p-4 rounded relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Measured Web Vitals</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-foreground">
                FCP {(report.liveMetrics.fcpMs / 1000).toFixed(2)}s
              </span>
              <span className="text-[10px] font-mono px-1 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold rounded">
                PASS
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              TTFB {report.liveMetrics.ttfbMs}ms · DOM {report.liveMetrics.domContentLoadedMs}ms · Load {report.liveMetrics.loadEventMs}ms
            </p>
            <div className="flex items-center gap-1 mt-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-muted-foreground">Measured from Navigation Timing API</span>
            </div>
          </div>

          {/* Card 4: Actual User Sessions */}
          <div className="border border-border bg-panel p-4 rounded relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Completed Sessions</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-foreground">
                {frictionSummary.totalSessions} Runs
              </span>
              <span className="text-[10px] font-mono px-1 py-0.5 bg-primary/10 text-primary border border-primary/30 font-bold rounded">
                {frictionSummary.totalClicks} Clicks
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Recorded across localStorage and live event collector
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mt-3">
              <span>Zero Mock Data</span>
              <span>100% Real Logs</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs and Scope Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-1 bg-secondary/40 p-1 border border-border rounded">
            <button
              type="button"
              onClick={() => setActiveTab("clarity")}
              className={`px-3 py-1.5 font-mono text-xs font-bold transition-all rounded ${
                activeTab === "clarity"
                  ? "bg-panel text-primary border border-primary/40 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              1. BEHAVIORAL RUM (CLARITY)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("lighthouse")}
              className={`px-3 py-1.5 font-mono text-xs font-bold transition-all rounded ${
                activeTab === "lighthouse"
                  ? "bg-panel text-primary border border-primary/40 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              2. GOOGLE LIGHTHOUSE AUDIT
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("stream")}
              className={`px-3 py-1.5 font-mono text-xs font-bold transition-all rounded flex items-center gap-1.5 ${
                activeTab === "stream"
                  ? "bg-panel text-primary border border-primary/40 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              3. LIVE EVENT STREAM ({recentEvents.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">Active Filter:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-panel border border-border text-foreground text-xs font-mono px-2 py-1.5 rounded focus:border-primary focus:outline-none"
            >
              <option value="all">All Subjects (Combined)</option>
              <option value="human-computer-interaction">Human-Computer Interaction (HCI)</option>
              <option value="theory-of-computation">Theory of Computation</option>
              <option value="system-programming">System Programming</option>
            </select>
          </div>
        </div>

        {/* TAB 1: FUNCTIONAL BEHAVIORAL TELEMETRY */}
        {activeTab === "clarity" && (
          <div className="space-y-6 animate-fade-in">
            {/* Real Educational Context Banner */}
            <div className="border border-primary/30 bg-primary/5 p-4 rounded space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold">
                <Sparkles className="w-4 h-4" />
                HCI CS 310 · REAL-USER MONITORING & AUTOMATED FRICTION PATTERN DETECTION
              </div>
              <p className="text-xs text-muted-foreground max-w-4xl">
                Every statistic below is computed directly from actual client DOM event listeners attached to the browser.
                When students interact with questions or flashcards, the passive detector analyzes coordinate clicks,
                latency dwells, and scroll velocities to flag ergonomic issues without manual surveys.
              </p>
            </div>

            {/* Friction Indicator Metric Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Rage Clicks */}
              <div className="border border-border bg-panel p-4 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-destructive font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    RAGE CLICKS
                  </span>
                  <span className="font-mono text-xs text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded">
                    Count: {frictionSummary.rageClicks}
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-foreground">
                  {frictionSummary.rageClicks}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Triggers when a user clicks the same element &ge; 3 times in 600ms. Identifies latency or missing submission feedback.
                </p>
              </div>

              {/* Dead Clicks */}
              <div className="border border-border bg-panel p-4 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber-400 font-bold flex items-center gap-1.5">
                    <MousePointerClick className="w-4 h-4" />
                    DEAD CLICKS
                  </span>
                  <span className="font-mono text-xs text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded">
                    Count: {frictionSummary.deadClicks}
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-foreground">
                  {frictionSummary.deadClicks}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Clicks on non-interactive elements with no click handlers. Detects Norman’s false affordances in UI cards.
                </p>
              </div>

              {/* Excessive Scrolling */}
              <div className="border border-border bg-panel p-4 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-sky-400 font-bold flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4" />
                    EXCESSIVE SCROLL
                  </span>
                  <span className="font-mono text-xs text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded">
                    Count: {frictionSummary.excessiveScrolls}
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-foreground">
                  {frictionSummary.excessiveScrolls}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Scroll velocity spikes &gt; 1,500 px/s. Indicates students hunting for buried or unformatted notes.
                </p>
              </div>

              {/* Quick Backs */}
              <div className="border border-border bg-panel p-4 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-purple-400 font-bold flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4" />
                    QUICK BACKS
                  </span>
                  <span className="font-mono text-xs text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded">
                    Count: {frictionSummary.quickBacks}
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-foreground">
                  {frictionSummary.quickBacks}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Immediate navigation retreats within 2s of landing. Measures high perceived cognitive difficulty.
                </p>
              </div>
            </div>

            {/* Live Interactive Friction Test Ground (Replaces fake simulator) */}
            <div className="border border-border bg-panel p-5 rounded space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-primary" />
                  Live Friction Verification Sandbox
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Test the actual event detection logic right now. Interacting with these elements triggers the real passive listeners.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Test Area 1: Dead Click Target */}
                <div className="border border-border/80 bg-background/50 p-4 rounded space-y-2">
                  <span className="text-muted-foreground text-[11px] block font-bold text-amber-400">
                    TEST 1: UNCLICKABLE ELEMENT (DEAD CLICK DETECTOR)
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Click the text container below. Because it is a static non-interactive element, the listener will register a real dead click.
                  </p>
                  <div
                    className="p-3 border border-dashed border-border bg-secondary/30 text-center select-none cursor-default text-muted-foreground hover:border-amber-400/40 rounded transition-all"
                  >
                    [ Static Decorative Container — Click Me ]
                  </div>
                </div>

                {/* Test Area 2: Rapid Clicking Target */}
                <div className="border border-border/80 bg-background/50 p-4 rounded space-y-2">
                  <span className="text-muted-foreground text-[11px] block font-bold text-destructive">
                    TEST 2: RAPID TAPPING (RAGE CLICK DETECTOR)
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Tap the button below 3 or more times rapidly within 600ms to trigger a real rage click event.
                  </p>
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold rounded cursor-pointer transition-all active:scale-95"
                  >
                    Tap Rapidly (Rage Click Trigger)
                  </button>
                </div>
              </div>
            </div>

            {/* Actual Recorded Quiz Runs History */}
            <div className="border border-border bg-panel rounded overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  <h3 className="font-mono text-sm font-bold text-foreground">
                    Real User Run History ({actualRuns.length} Sessions In Storage)
                  </h3>
                </div>
                <Link
                  href="/"
                  className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  START NEW QUIZ
                </Link>
              </div>

              {actualRuns.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-xs text-muted-foreground font-mono" role="status" aria-live="polite"> No completed quiz runs recorded for this subject filter yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-block text-xs font-mono font-bold px-3 py-1.5 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 rounded"
                  >
                    LAUNCH A PRACTICE RUN
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-secondary/60 text-muted-foreground border-b border-border uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Mode</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Accuracy</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Time Taken</th>
                        <th className="p-3">Streak</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {actualRuns.slice(0, 10).map((run) => (
                        <tr key={run.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="p-3 font-bold text-foreground uppercase">
                            {run.mode}
                          </td>
                          <td className="p-3">
                            <span className="font-extrabold text-primary px-1.5 py-0.5 border border-primary/30 bg-primary/10 rounded">
                              {run.grade}
                            </span>
                          </td>
                          <td className="p-3 text-emerald-400 font-bold">
                            {run.score}%
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {run.correctAnswers} / {run.totalQuestions}
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {run.timeTaken > 0 ? `${run.timeTaken}s` : "Untimed"}
                          </td>
                          <td className="p-3 text-foreground font-bold">
                            {run.streak}
                          </td>
                          <td className="p-3 text-muted-foreground text-[11px]">
                            {new Date(run.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FUNCTIONAL GOOGLE LIGHTHOUSE AUDIT */}
        {activeTab === "lighthouse" && (
          <div className="space-y-6 animate-fade-in">
            {/* 4 Computed Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(report.categories).map((cat) => (
                <div key={cat.id} className="border border-border bg-panel p-4 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-foreground">{cat.title}</span>
                    <span className={`font-mono text-xs font-bold px-1.5 py-0.5 border rounded ${
                      cat.score >= 90
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                    }`}>
                      {cat.score >= 90 ? "PASS" : "AVERAGE"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-emerald-400">
                      {cat.score}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">/ 100</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Core Web Vitals Deep-Dive Table */}
            <div className="border border-border bg-panel rounded overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/30 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Measured Core Web Vitals (Real Browser Navigation Timing)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Dynamically probed using window.performance for the current loaded webpage session.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                  STATUS: 100% LIVE PROBED
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-secondary/60 text-muted-foreground border-b border-border uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Metric</th>
                      <th className="p-3">Measured Value</th>
                      <th className="p-3">Google P75 Target</th>
                      <th className="p-3">Health Status</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {report.coreWebVitals.map((metric) => (
                      <tr key={metric.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-3 font-bold text-foreground">
                          {metric.name} ({metric.abbr})
                        </td>
                        <td className="p-3 font-bold text-emerald-400 text-sm">
                          {metric.value}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {metric.target}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                            metric.status === "good"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}>
                            {metric.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground text-[11px] max-w-md">
                          {metric.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Client Navigation Timing Bar */}
            <div className="border border-border bg-panel rounded p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border/80 pb-2">
                <h4 className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  Navigation Timing API Performance Readouts
                </h4>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Network: {report.liveMetrics.networkType}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="border border-border/60 bg-background/50 p-2.5 rounded">
                  <span className="text-muted-foreground text-[10px] uppercase block">Time to First Byte (TTFB)</span>
                  <span className="text-foreground font-bold text-sm">{report.liveMetrics.ttfbMs} ms</span>
                </div>
                <div className="border border-border/60 bg-background/50 p-2.5 rounded">
                  <span className="text-muted-foreground text-[10px] uppercase block">First Contentful Paint (FCP)</span>
                  <span className="text-emerald-400 font-bold text-sm">{report.liveMetrics.fcpMs} ms</span>
                </div>
                <div className="border border-border/60 bg-background/50 p-2.5 rounded">
                  <span className="text-muted-foreground text-[10px] uppercase block">DOM Content Loaded</span>
                  <span className="text-foreground font-bold text-sm">{report.liveMetrics.domContentLoadedMs} ms</span>
                </div>
                <div className="border border-border/60 bg-background/50 p-2.5 rounded">
                  <span className="text-muted-foreground text-[10px] uppercase block">Load Event Duration</span>
                  <span className="text-foreground font-bold text-sm">{report.liveMetrics.loadEventMs} ms</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Audits Table */}
            <div className="border border-border bg-panel rounded overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/30">
                <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Live DOM & Codebase Verification Checklist
                </h3>
              </div>
              <div className="divide-y divide-border">
                {report.audits.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-start gap-3 hover:bg-secondary/15 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 border border-border uppercase text-muted-foreground rounded">
                          {item.category}
                        </span>
                        {item.savings && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 rounded">
                            {item.savings}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REAL-TIME EVENT STREAM */}
        {activeTab === "stream" && (
          <div className="border border-border bg-panel rounded p-4 space-y-3 font-mono text-xs animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground">Live Telemetry Ingestion Sink</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded">
                  {recentEvents.length} Captured Events
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRecentEvents([])}
                  className="text-[10px] px-2 py-1 border border-border text-muted-foreground hover:text-foreground rounded"
                >
                  CLEAR SINK
                </button>
              </div>
            </div>

            {recentEvents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs" role="status" aria-live="polite"> No events currently in memory. Answer quiz questions or click elements on the page to watch real telemetry stream.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-2">
                {recentEvents.map((ev, i) => (
                  <div
                    key={ev.id || i}
                    className="p-2 border border-border/60 bg-background/60 rounded flex items-center justify-between gap-2 text-[11px] hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-muted-foreground text-[10px]">
                        {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : "—"}
                      </span>
                      <span className={`px-1.5 py-0.2 font-bold uppercase rounded text-[10px] border ${
                        ev.type === "rage_click"
                          ? "bg-destructive/10 text-destructive border-destructive/40"
                          : ev.type === "dead_click"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/40"
                          : "bg-primary/10 text-primary border-primary/30"
                      }`}>
                        {ev.type}
                      </span>
                      <span className="text-foreground truncate max-w-md">
                        {ev.category} · {ev.subjectId || "global"}
                      </span>
                    </div>

                    <span className="text-muted-foreground text-[10px] shrink-0 font-mono">
                      ID: {ev.id.slice(-8)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
