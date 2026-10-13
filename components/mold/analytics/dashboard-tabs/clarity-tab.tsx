import * as React from 'react'
import Link from "next/link"
import { Sparkles, Flame, MousePointerClick, SlidersHorizontal, RotateCcw, MousePointer, History, Play } from 'lucide-react'
import type { RunRecord } from "@/lib/mold-types"
import type { BehavioralTelemetrySummary } from "@/lib/analytics/clarity-bridge"

export interface ClarityTabProps {
  frictionSummary: BehavioralTelemetrySummary
  actualRuns: RunRecord[]
}

export function ClarityTab({ frictionSummary, actualRuns }: ClarityTabProps) {
  return (
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
          <p className="text-xs text-muted-foreground font-mono">
            No completed quiz runs recorded for this subject filter yet.
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
  )
}
