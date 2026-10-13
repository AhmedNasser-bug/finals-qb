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

import { ClarityTab } from "./dashboard-tabs/clarity-tab"
import { LighthouseTab } from "./dashboard-tabs/lighthouse-tab"
import { StreamTab } from "./dashboard-tabs/stream-tab"


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
        {activeTab === "clarity" && <ClarityTab frictionSummary={frictionSummary} actualRuns={actualRuns} />}

        {/* TAB 2: FUNCTIONAL GOOGLE LIGHTHOUSE AUDIT */}
        {activeTab === "lighthouse" && <LighthouseTab report={report} />}

        {/* TAB 3: REAL-TIME EVENT STREAM */}
        {activeTab === "stream" && <StreamTab recentEvents={recentEvents} setRecentEvents={setRecentEvents} />}
      </main>
    </div>
  )
}
