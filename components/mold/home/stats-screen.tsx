"use client"

import { useState, useMemo } from "react"
import { 
  ArrowLeft, 
  Trophy, 
  Zap, 
  Target, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Trash2, 
  Flame,
  AlertTriangle
} from "lucide-react"

import { useStats } from "@/lib/game/stats-context"
import { StreakAscent } from "./streak-ascent"
import { calculateGrade, gradeColor, gradeBgColor, formatTime, formatLabel } from "@/lib/mold-types"
import { getActiveSubject } from "@/lib/active-subject-store"
import { loadRetentionMap, calculateRetrievability } from "@/lib/telemetry/retention-kernel"
import { cn } from "@/lib/utils"

interface StatsScreenProps {
  onReturnHome: () => void
}

export function StatsScreen({ onReturnHome }: StatsScreenProps) {
  const { 
    runs, 
    dayStreak, 
    peakQuestionStreak, 
    stats, 
    missions, 
    milestones, 
    resetAllStats 
  } = useStats()

  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const activeSubject = getActiveSubject()
  const retentionMap = activeSubject ? loadRetentionMap(activeSubject.id) : {}

  // Compute category retrievability
  const categoryStats = useMemo(() => {
    if (!activeSubject) return []
    const catMap: Record<string, { total: number; sumR: number }> = {}

    activeSubject.questions.forEach((q) => {
      const cat = q.category || "general"
      if (!catMap[cat]) catMap[cat] = { total: 0, sumR: 0 }
      catMap[cat].total += 1
      const itemState = retentionMap[q.id]
      if (itemState && itemState.lastReviewedAt) {
        const daysElapsed = (Date.now() - new Date(itemState.lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24)
        catMap[cat].sumR += calculateRetrievability(itemState.stability, daysElapsed)
      } else {
        catMap[cat].sumR += 0.5 // Default unreviewed retrievability estimate
      }
    })

    return Object.entries(catMap)
      .map(([cat, val]) => ({
        category: cat,
        retrievabilityPct: Math.round((val.sumR / Math.max(1, val.total)) * 100),
        totalQuestions: val.total,
      }))
      .sort((a, b) => a.retrievabilityPct - b.retrievabilityPct) // Sort lowest (needs review) first
  }, [activeSubject, retentionMap])

  // Compute Cramming Readiness Index
  const avgScore = stats.averageScore || 0
  const avgRetrievability = categoryStats.length > 0
    ? Math.round(categoryStats.reduce((acc, c) => acc + c.retrievabilityPct, 0) / categoryStats.length)
    : 50

  const cramScore = Math.min(
    99,
    Math.max(15, Math.round(avgScore * 0.55 + avgRetrievability * 0.35 + Math.min(10, stats.totalRuns * 2)))
  )

  let cramVerdict = {
    title: "COGNITIVE SPEEDRUN READY",
    badge: "S-TIER CRAMMER",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    text: "You'll speedrun this exam while the professor is still handing out papers. Go touch some grass.",
  }

  if (cramScore < 50) {
    cramVerdict = {
      title: "HIGH-RISK PANIC ZONE",
      badge: "COFFEE OVERDOSE",
      badgeColor: "text-red-400 border-red-500/30 bg-red-500/10",
      text: "The exam will humble you. Stop doom-scrolling, chug water, and run a Survival session immediately.",
    }
  } else if (cramScore < 75) {
    cramVerdict = {
      title: "COIN-TOSS PROBABILITY",
      badge: "BORDERLINE PASS",
      badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      text: "50% chance of an A, 50% chance of staring blankly at the ceiling on Question 4. Re-drill your red categories.",
    }
  } else if (cramScore < 90) {
    cramVerdict = {
      title: "SOLID EXAM PASS",
      badge: "SECURE GRADE",
      badgeColor: "text-primary border-primary/30 bg-primary/10",
      text: "You're passing comfortably, but that lowest-ranked category below will show up. Quick-drill it once.",
    }
  }

  const avgGrade = calculateGrade(stats.averageScore || 0)

  const handleReset = () => {
    resetAllStats()
    setShowConfirmReset(false)
  }

  return (
    <div className="space-y-8 select-none animate-fade-in pb-16">
      
      {/* ─── SCREEN HEADER ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <button 
            type="button"
            aria-label="Return to core dashboard"
            onClick={onReturnHome}
            className="flex items-center gap-2 text-zinc-400 hover:text-[#fecc17] transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to core</span>
          </button>
          <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-3">
            STUDY STATISTICS <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/5 border border-primary/20">LIVE</span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">REAL-TIME ACADEMIC PROGRESS AND STUDY STATS.</p>
        </div>
      </div>

      {/* ─── HUD METRICS GRID STRIP ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Runs Card */}
        <div className="p-5 border border-border bg-[#101115] rounded relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <Trophy className="w-5 h-5" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 font-bold">QUIZZES COMPLETED</p>
          <p className="text-3xl font-mono font-bold tracking-tight text-white mt-2 tabular-nums">
            {stats.totalRuns}
          </p>
          <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] text-[#fecc17] bg-[#fecc17]/5 border border-[#fecc17]/10 px-2 py-1 rounded w-fit">
            <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
            <span>DAY STREAK: {dayStreak}</span>
          </div>
        </div>

        {/* Average Score (Accuracy) Card */}
        <div className="p-5 border border-border bg-[#101115] rounded relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <Target className="w-5 h-5" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 font-bold">AVERAGE ACCURACY</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-mono font-bold text-white tabular-nums">
              {stats.averageScore}%
            </span>
            {stats.totalRuns > 0 && (
              <span className={cn("font-mono text-sm font-black px-1.5 py-0.5 rounded border border-glow", gradeBgColor(avgGrade))}>
                {avgGrade}
              </span>
            )}
          </div>
          <p className="text-[9px] text-zinc-500 font-mono mt-3">BEST SINGLE ATTEMPT: {stats.bestScore}%</p>
        </div>

        {/* Peak Correctness Streak Card */}
        <div className="p-5 border border-border bg-[#101115] rounded relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 font-bold">BEST ANSWER STREAK</p>
          <p className="text-3xl font-mono font-bold tracking-tight text-white mt-2 tabular-nums">
            ×{peakQuestionStreak}
          </p>
          <p className="text-[9px] text-zinc-500 font-mono mt-3">BEST IN-QUIZ FOCUS CHAIN</p>
        </div>

        {/* Average Response Time Card */}
        <div className="p-5 border border-border bg-[#101115] rounded relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-zinc-700 transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 font-bold">AVERAGE ANSWER SPEED</p>
          <p className="text-3xl font-mono font-bold tracking-tight text-white mt-2 tabular-nums">
            {formatTime(Math.round((stats.averageResponseTimeMs || 0) / 1000))}
          </p>
          <p className="text-[9px] text-zinc-500 font-mono mt-3">
            {stats.averageResponseTimeMs ? `${Math.round(stats.averageResponseTimeMs)}ms per question` : "untimed"}
          </p>
        </div>

      </div>

      {/* ─── CRAMMING EXAM READINESS INDEX (FEATURE 4) ────────────────────── */}
      <div className="border border-border bg-gradient-to-r from-panel via-[#101115] to-panel p-6 rounded-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                DIAGNOSTIC TELEMETRY // 24-HOUR FORECAST
              </span>
              <span className={cn("font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border", cramVerdict.badgeColor)}>
                {cramVerdict.badge}
              </span>
            </div>
            <h2 className="text-lg font-display font-black text-foreground tracking-tight flex items-center gap-2">
              <span>EXAM CRAM READINESS:</span>
              <span className="text-primary font-mono text-xl tabular-nums">{cramScore}%</span>
            </h2>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
              {cramVerdict.text}
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-6">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
              ESTIMATED DECAY
            </span>
            <span className="font-mono text-2xl font-black text-foreground tabular-nums mt-0.5">
              {avgRetrievability}%
            </span>
            <span className="font-mono text-[9px] text-muted-foreground/80 mt-0.5">
              AVERAGE RETRIEVABILITY (DSR)
            </span>
          </div>
        </div>
      </div>

      {/* ─── DUAL GRID COLUMN SPLIT ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Streak Ascent & Category Retrievability Ranking */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
                01 // STUDY STREAK PROGRESS
              </h2>
            </div>
            <StreakAscent 
              currentStreak={dayStreak} 
              bestStreak={stats.bestStreak || dayStreak}
              className="w-full bg-panel"
            />
          </div>

          {/* Clean Ranked Category Retrievability List */}
          <div className="space-y-4">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
                02 // TOPIC RETENTION RANKING (SM-2 DSR)
              </h2>
              <span className="font-mono text-[9px] text-muted-foreground uppercase">
                LOWEST FIRST
              </span>
            </div>

            {categoryStats.length === 0 ? (
              <div className="p-4 border border-dashed border-border/60 rounded text-center text-xs font-mono text-muted-foreground">
                No active subject telemetry recorded yet.
              </div>
            ) : (
              <div className="border border-border bg-[#101115] rounded divide-y divide-zinc-800/60 overflow-hidden">
                {categoryStats.map((item, idx) => {
                  const isCritical = item.retrievabilityPct < 60
                  const isDueSoon = item.retrievabilityPct >= 60 && item.retrievabilityPct < 85
                  return (
                    <div key={item.category} className="p-3.5 flex items-center justify-between gap-3 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] text-muted-foreground/60 w-4 tabular-nums">
                          {idx + 1}.
                        </span>
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-bold text-foreground truncate">
                            {formatLabel(item.category)}
                          </p>
                          <p className="font-mono text-[9px] text-muted-foreground">
                            {item.totalQuestions} questions in pool
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn(
                          "font-mono text-[10px] font-bold px-2 py-0.5 rounded border",
                          isCritical
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : isDueSoon
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        )}>
                          {item.retrievabilityPct}% RETENTION
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Missions, Milestones & Settings */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Daily Missions Panel */}
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
                02 // DAILY STUDY GOALS
              </h2>
            </div>
            
            <div className="border border-border bg-[#101115] rounded p-6 divide-y divide-zinc-800/60">
              {missions.map((mission) => (
                <div key={mission.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center shrink-0 border mt-0.5",
                    mission.completed 
                      ? "border-[#fecc17] bg-[#fecc17]/10 text-primary" 
                      : "border-zinc-700 bg-zinc-900 text-zinc-600"
                  )}>
                    {mission.completed && <CheckCircle2 className="w-4 h-4 fill-current text-primary shrink-0" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "font-mono text-xs font-bold uppercase tracking-wider",
                        mission.completed ? "text-[#fecc17]" : "text-white"
                      )}>
                        {mission.title}
                      </p>
                      <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
                        {mission.current} / {mission.target}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{mission.description}</p>
                    
                    {/* Progress slider */}
                    <div className="mt-2.5 w-full h-1 bg-zinc-800 rounded overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${(mission.current / mission.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Long-Term Milestones Panel */}
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-2">
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#fecc17]">
                03 // LONG-TERM MILESTONES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {milestones.map((milestone) => (
                <div 
                  key={milestone.id} 
                  className={cn(
                    "p-4 border rounded bg-[#101115] relative overflow-hidden transition-all duration-300",
                    milestone.completed 
                      ? "border-primary/40 shadow-[0_0_15px_rgba(254,204,23,0.05)]" 
                      : "border-border hover:border-zinc-800"
                  )}
                >
                  {/* Subtle completed background check icon */}
                  {milestone.completed && (
                    <div className="absolute -bottom-2 -right-2 text-[#fecc17]/5">
                      <Trophy className="w-16 h-16" />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <div className="min-w-0">
                      <p className={cn(
                        "font-mono text-xs font-bold uppercase tracking-widest",
                        milestone.completed ? "text-primary" : "text-white"
                      )}>
                        {milestone.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-snug">{milestone.description}</p>
                    </div>

                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold",
                      milestone.completed 
                        ? "bg-primary/20 text-primary border border-primary/30" 
                        : "bg-zinc-800/40 text-zinc-500 border border-zinc-700/60"
                    )}>
                      {milestone.completed ? "★" : `${Math.round((milestone.current / milestone.target) * 100)}%`}
                    </div>
                  </div>

                  <div className="mt-4 w-full h-1 bg-zinc-800/80 rounded overflow-hidden relative z-10">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        milestone.completed ? "bg-primary" : "bg-zinc-600"
                      )} 
                      style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CAUTION / DATA MANAGEMENT PANEL */}
          <div className="space-y-4 pt-4">
            <div className="border-b border-zinc-800 pb-2">
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#fecc17]">
                04 // DATA SETTINGS
              </h2>
            </div>
            
            <div className="border border-destructive/20 bg-destructive/5 rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-mono text-xs font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span>RESET ALL STUDY DATA</span>
                </p>
                <p className="text-[10px] text-zinc-400 max-w-md">
                  This action deletes all your completed quizzes, study streaks, best streak records, and progress stats. This cannot be undone.
                </p>
              </div>

              {!showConfirmReset ? (
                <button 
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  aria-label="Wipe all local telemetry and run data"
                  className="bg-transparent hover:bg-destructive/10 text-destructive hover:text-red-400 border border-destructive/30 px-4 py-2 rounded text-xs font-mono tracking-wider cursor-pointer transition-all shrink-0 uppercase font-bold"
                >
                   RESET_DATA
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    type="button"
                    onClick={handleReset}
                    aria-label="Confirm wipe all data"
                    className="bg-destructive text-white hover:bg-red-600 px-3.5 py-2 rounded text-xs font-mono font-bold cursor-pointer transition-all uppercase"
                  >
                    CONFIRM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    aria-label="Cancel wipe all data"
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 px-3.5 py-2 rounded text-xs font-mono font-bold cursor-pointer transition-all uppercase"
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
