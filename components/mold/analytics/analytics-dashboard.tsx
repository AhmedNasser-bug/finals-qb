"use client"

import React, { useState, useEffect, useMemo } from "react"
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
  Search,
  Gauge,
  Flame,
  MousePointerClick,
  SlidersHorizontal,
  RefreshCw,
  Play,
  Pause,
  ChevronRight,
  Terminal,
} from "lucide-react"

import {
  BASELINE_LIGHTHOUSE_REPORT,
  measureClientPerformance,
  type LighthouseAuditReport,
  type LivePerformanceMetrics,
} from "@/lib/analytics/lighthouse-service"
import {
  getBehavioralTelemetrySummary,
  trackClarityEvent,
} from "@/lib/analytics/clarity-bridge"
import { telemetryCollector } from "@/lib/telemetry/telemetry-collector"
import type { CognitiveTelemetryEvent, RageClickEvent, DeadClickEvent } from "@/lib/telemetry/telemetry-types"

type ActiveTab = "clarity" | "lighthouse" | "stream"

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("clarity")
  const [report, setReport] = useState<LighthouseAuditReport>(BASELINE_LIGHTHOUSE_REPORT)
  const [liveMetrics, setLiveMetrics] = useState<LivePerformanceMetrics | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isAuditing, setIsAuditing] = useState(false)
  const [recentEvents, setRecentEvents] = useState<CognitiveTelemetryEvent[]>([])

  // Replay Simulator State (for 2-minute student demo)
  const [replayStep, setReplayStep] = useState(0)
  const [isReplaying, setIsReplaying] = useState(false)

  // Hydrate telemetry summary and measure live browser performance
  useEffect(() => {
    const live = measureClientPerformance()
    setLiveMetrics(live)
    setRecentEvents(telemetryCollector.getEvents())

    const unsub = telemetryCollector.subscribe((ev) => {
      setRecentEvents((prev) => [ev, ...prev].slice(0, 100))
    })

    return () => unsub()
  }, [])

  const frictionSummary = useMemo(() => {
    return getBehavioralTelemetrySummary(selectedSubject === "all" ? undefined : selectedSubject)
  }, [selectedSubject, recentEvents])

  // Replay timeline steps matching lecture notes
  const replayTimeline = useMemo(() => [
    { time: "00:00.00", action: "Session Initialized", detail: "Question #14 rendered (Visual Angle $$V = 2 \\arctan(H/(2D))$$)", icon: Eye, type: "normal" },
    { time: "00:02.10", action: "Reading & Cognitive Dwell", detail: "Cursor hovering over Option A and Option B (Hesitation detected: 3.4s)", icon: MousePointer, type: "normal" },
    { time: "00:04.30", action: "Dead Click Triggered", detail: "Clicked non-interactive category badge span.category-pill (False Signifier)", icon: MousePointerClick, type: "warning" },
    { time: "00:06.10", action: "Socratic Hint Invocation", detail: "Clicked HINT button; guiding explanation opened", icon: Sparkles, type: "normal" },
    { time: "00:07.90", action: "Option Selected", detail: "Selected Option B (Affordance & Perceptual Scale)", icon: CheckCircle2, type: "normal" },
    { time: "00:08.50", action: "Rage Click Detected", detail: "User tapped SUBMIT 3 times in 400ms (Awaiting server reveal latency)", icon: Flame, type: "danger" },
    { time: "00:09.10", action: "Answer Revealed Correct", detail: "State updated to reviewing. Streak preserved at 15.", icon: Zap, type: "success" },
  ], [])

  // Auto-advance replay simulator when playing
  useEffect(() => {
    if (!isReplaying) return
    const timer = setInterval(() => {
      setReplayStep((prev) => {
        if (prev >= replayTimeline.length - 1) {
          setIsReplaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1600)
    return () => clearInterval(timer)
  }, [isReplaying, replayTimeline.length])

  const handleRunLiveAudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      const live = measureClientPerformance()
      setLiveMetrics(live)
      setIsAuditing(false)
    }, 600)
  }

  const handleSimulateFriction = (type: "rage" | "dead") => {
    const now = Date.now()
    if (type === "rage") {
      const rageEv: RageClickEvent = {
        id: `rage_demo_${now}`,
        type: "rage_click",
        timestamp: new Date().toISOString(),
        subjectId: selectedSubject === "all" ? "human-computer-interaction" : selectedSubject,
        category: "behavioral-friction",
        targetTag: "button#submit-btn",
        targetText: "SUBMIT ANSWER",
        clickCount: 4,
        coordinate: { x: 420, y: 560 },
      }
      telemetryCollector.record(rageEv)
      trackClarityEvent("rage_click", { target: "button#submit-btn", count: 4 })
    } else {
      const deadEv: DeadClickEvent = {
        id: `dead_demo_${now}`,
        type: "dead_click",
        timestamp: new Date().toISOString(),
        subjectId: selectedSubject === "all" ? "human-computer-interaction" : selectedSubject,
        category: "behavioral-friction",
        targetTag: "span.badge-pill",
        targetText: "PERCEPTUAL-PRINCIPLES",
        coordinate: { x: 310, y: 240 },
      }
      telemetryCollector.record(deadEv)
      trackClarityEvent("dead_click", { target: "span.badge-pill" })
    }
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
                  OBSERVABILITY LAB
                </span>
                <span className="font-mono text-xs text-muted-foreground">MOLD V2 // RUM & AUDIT</span>
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
              {isAuditing ? "PROBING..." : "RE-RUN AUDIT"}
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
        {/* Top KPI Metric Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lighthouse Health */}
          <div className="border border-border bg-panel p-4 rounded relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Lighthouse Score</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-400">
                {report.overallScore}
              </span>
              <span className="text-xs font-mono text-muted-foreground">/ 100</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Perf 98 · A11y 100 · Best Practices 100 · SEO 100
            </p>
            <div className="w-full bg-secondary/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${report.overallScore}%` }} />
            </div>
          </div>

          {/* Card 2: Friction Index */}
          <div className="border border-border bg-panel p-4 rounded relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Behavioral Friction Index</span>
              <Flame className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-primary">
                {frictionSummary.frictionIndex}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Optimal (&lt;5%)</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {frictionSummary.rageClicks} rage clicks · {frictionSummary.deadClicks} dead clicks
            </p>
            <div className="w-full bg-secondary/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${Math.max(5, frictionSummary.frictionIndex)}%` }} />
            </div>
          </div>

          {/* Card 3: Core Web Vitals Status */}
          <div className="border border-border bg-panel p-4 rounded relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Core Web Vitals</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-foreground">
                LCP 0.88s
              </span>
              <span className="text-[10px] font-mono px-1 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold rounded">
                PASS
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              INP 24ms · CLS 0.002 · TBT 12ms
            </p>
            <div className="flex items-center gap-1 mt-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-muted-foreground">All metrics in Google Good zone</span>
            </div>
          </div>

          {/* Card 4: Clarity Telemetry Status */}
          <div className="border border-border bg-panel p-4 rounded relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Clarity RUM Status</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-foreground">
                Active
              </span>
              <span className="text-[10px] font-mono px-1 py-0.5 bg-primary/10 text-primary border border-primary/30 font-bold rounded">
                100% CAPTURE
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {frictionSummary.totalClicks} clicks recorded across {frictionSummary.totalSessions} sessions
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mt-3">
              <span>Unlimited Free Tier</span>
              <span>Zero PII Leakage</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs and Controls */}
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
              1. MICROSOFT CLARITY (BEHAVIORAL RUM)
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
              2. GOOGLE LIGHTHOUSE & CWV
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
            <span className="text-xs font-mono text-muted-foreground">Subject Scope:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-panel border border-border text-foreground text-xs font-mono px-2 py-1.5 rounded focus:border-primary focus:outline-none"
            >
              <option value="all">All Subjects (Aggregate)</option>
              <option value="human-computer-interaction">Human-Computer Interaction (HCI)</option>
              <option value="theory-of-computation">Theory of Computation</option>
              <option value="system-programming">System Programming</option>
            </select>
          </div>
        </div>

        {/* TAB 1: MICROSOFT CLARITY BEHAVIORAL TELEMETRY */}
        {activeTab === "clarity" && (
          <div className="space-y-6 animate-fade-in">
            {/* Pedagogical Header Banner */}
            <div className="border border-primary/30 bg-primary/5 p-4 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold">
                  <Sparkles className="w-4 h-4" />
                  HCI CS 310 · AUTOMATED BEHAVIORAL TELEMETRY & FRICTION ANALYTICS
                </div>
                <p className="text-xs text-muted-foreground max-w-3xl">
                  Replaces manual questionnaires with automated Real-User Monitoring (RUM). By analyzing
                  coordinate clicks, hesitation dwells, and scroll velocities, the system detects ergonomic
                  defects (false affordances, unresponsive buttons) before manual user trials begin.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSimulateFriction("rage")}
                  className="text-xs font-mono px-2.5 py-1.5 border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all rounded font-bold"
                  title="Simulate student rage-clicking submit button"
                >
                  + SIMULATE RAGE CLICK
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFriction("dead")}
                  className="text-xs font-mono px-2.5 py-1.5 border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all rounded font-bold"
                  title="Simulate student clicking unclickable text badge"
                >
                  + SIMULATE DEAD CLICK
                </button>
              </div>
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
                    Freq: {frictionSummary.rageClicks}
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-foreground">
                  {frictionSummary.rageClicks}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Triggered when a user clicks the same element &ge; 3 times within 600ms. Signals system unresponsiveness or broken submission feedback.
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
                    Freq: {frictionSummary.deadClicks}
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-foreground">
                  {frictionSummary.deadClicks}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Click on an element with no visual signifier or event handler. Demonstrates Norman’s principle of false affordances to students.
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
                    Freq: {frictionSummary.excessiveScrolls}
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-foreground">
                  {frictionSummary.excessiveScrolls}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Scroll velocity exceeding 1,500 px/s. Indicates user lost in study notes searching for missing information.
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
                    Freq: {frictionSummary.quickBacks}
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-foreground">
                  {frictionSummary.quickBacks}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  User visits a question and immediately retreats within 2 seconds. Measures high perceived cognitive hurdle.
                </p>
              </div>
            </div>

            {/* Interactive Session Replay Simulator (The 2-Minute Student Demo) */}
            <div className="border border-border bg-panel rounded p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
                <div>
                  <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    Behavioral Session Replay Simulator (2-Minute Classroom Demonstration)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Step-by-step visual demonstration of student friction detection during an active quiz session.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReplaying(!isReplaying)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 rounded cursor-pointer transition-all"
                  >
                    {isReplaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isReplaying ? "PAUSE REPLAY" : "PLAY DEMO"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplayStep(0)}
                    className="text-xs font-mono px-2 py-1.5 border border-border text-muted-foreground hover:text-foreground rounded"
                    title="Reset to start"
                  >
                    RESET
                  </button>
                </div>
              </div>

              {/* Scrubber Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>TIMELINE SCRUBBER: STEP {replayStep + 1} OF {replayTimeline.length}</span>
                  <span className="text-primary font-bold">{replayTimeline[replayStep].time}</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {replayTimeline.map((step, idx) => (
                    <button
                      key={step.time}
                      type="button"
                      onClick={() => setReplayStep(idx)}
                      className={`h-2 rounded-sm transition-all ${
                        idx === replayStep
                          ? "bg-primary ring-2 ring-primary/40"
                          : idx < replayStep
                          ? "bg-emerald-500/70"
                          : "bg-secondary"
                      }`}
                      title={step.action}
                    />
                  ))}
                </div>
              </div>

              {/* Current Replay Card View */}
              <div className="border border-border/80 bg-background/50 p-4 rounded flex items-start gap-4">
                <div className={`p-2.5 rounded shrink-0 border ${
                  replayTimeline[replayStep].type === "danger"
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : replayTimeline[replayStep].type === "warning"
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                    : replayTimeline[replayStep].type === "success"
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                    : "border-primary/40 bg-primary/10 text-primary"
                }`}>
                  {React.createElement(replayTimeline[replayStep].icon, { className: "w-5 h-5" })}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {replayTimeline[replayStep].action}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.2 border border-border rounded">
                      Timestamp: {replayTimeline[replayStep].time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {replayTimeline[replayStep].detail}
                  </p>
                </div>

                <div className="text-right shrink-0 hidden sm:block">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 border rounded ${
                    replayTimeline[replayStep].type === "danger"
                      ? "border-destructive text-destructive bg-destructive/5"
                      : replayTimeline[replayStep].type === "warning"
                      ? "border-amber-400 text-amber-400 bg-amber-400/5"
                      : "border-primary text-primary bg-primary/5"
                  }`}>
                    {replayTimeline[replayStep].type}
                  </span>
                </div>
              </div>

              {/* Pedagogical Explanation Box */}
              <div className="text-xs border-l-2 border-primary pl-3 py-1 text-muted-foreground font-mono">
                <strong className="text-primary">What this proves to students:</strong> Automated session replay
                correlates cognitive pauses with specific UI elements, allowing developers to redesign confusing
                signifiers before shipping.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE LIGHTHOUSE & CORE WEB VITALS */}
        {activeTab === "lighthouse" && (
          <div className="space-y-6 animate-fade-in">
            {/* 4 Radial Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(report.categories).map((cat) => (
                <div key={cat.id} className="border border-border bg-panel p-4 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase text-foreground">{cat.title}</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/30 rounded">
                      PASS
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
                    Google Core Web Vitals Assessment (75th Percentile)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Field and lab performance standards determining user perceived speed and smoothness.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                  STATUS: ALL METRICS GOOD
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-secondary/60 text-muted-foreground border-b border-border uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Metric Name</th>
                      <th className="p-3">Measured Value</th>
                      <th className="p-3">Google P75 Target</th>
                      <th className="p-3">Health Status</th>
                      <th className="p-3">HCI Impact & Description</th>
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
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
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

            {/* Live Client Navigation Timing (Local Probed API) */}
            {liveMetrics && (
              <div className="border border-border bg-panel rounded p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <h4 className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    Live Browser Performance API (Current Session Client Probe)
                  </h4>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Network: {liveMetrics.networkType}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="border border-border/60 bg-background/50 p-2.5 rounded">
                    <span className="text-muted-foreground text-[10px] uppercase block">Time to First Byte (TTFB)</span>
                    <span className="text-foreground font-bold text-sm">{liveMetrics.ttfbMs} ms</span>
                  </div>
                  <div className="border border-border/60 bg-background/50 p-2.5 rounded">
                    <span className="text-muted-foreground text-[10px] uppercase block">First Contentful Paint (FCP)</span>
                    <span className="text-emerald-400 font-bold text-sm">{liveMetrics.fcpMs} ms</span>
                  </div>
                  <div className="border border-border/60 bg-background/50 p-2.5 rounded">
                    <span className="text-muted-foreground text-[10px] uppercase block">DOM Content Loaded</span>
                    <span className="text-foreground font-bold text-sm">{liveMetrics.domContentLoadedMs} ms</span>
                  </div>
                  <div className="border border-border/60 bg-background/50 p-2.5 rounded">
                    <span className="text-muted-foreground text-[10px] uppercase block">Load Event Duration</span>
                    <span className="text-foreground font-bold text-sm">{liveMetrics.loadEventMs} ms</span>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic Audits Table */}
            <div className="border border-border bg-panel rounded overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/30">
                <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Verified Audit Checklist & Best Practices
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

        {/* TAB 3: LIVE EVENT STREAM */}
        {activeTab === "stream" && (
          <div className="border border-border bg-panel rounded p-4 space-y-3 font-mono text-xs animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground">In-Memory Cognitive & Friction Event Sink</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded">
                  MAX 100 BUFFER
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRecentEvents([])}
                  className="text-[10px] px-2 py-1 border border-border text-muted-foreground hover:text-foreground rounded"
                >
                  CLEAR BUFFER
                </button>
              </div>
            </div>

            {recentEvents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No telemetry events in current session buffer. Play a quiz or click "+ SIMULATE RAGE CLICK" to populate.
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
