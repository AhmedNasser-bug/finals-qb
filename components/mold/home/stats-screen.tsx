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
import { computeCategoryRecallabilities } from "@/lib/game/recallability"
import { cn } from "@/lib/utils"
import { CramReadinessPanel, CategoryRecallPanel, DailyMissionsPanel, LongTermMilestonesPanel, DataSettingsPanel } from "./stats-screen-components"

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

  // Compute category retrievability
  const categoryStats = useMemo(() => {
    if (!activeSubject) return []
    const recallMap = computeCategoryRecallabilities(
      activeSubject.questions,
      activeSubject.id
    )
    const counts: Record<string, number> = {}
    activeSubject.questions.forEach((q) => {
      const cat = q.category || "_general"
      counts[cat] = (counts[cat] || 0) + 1
    })

    return Object.entries(recallMap)
      .map(([cat, retrievabilityPct]) => ({
        category: cat,
        retrievabilityPct,
        totalQuestions: counts[cat] || 0,
      }))
      .sort((a, b) => a.retrievabilityPct - b.retrievabilityPct) // Sort lowest (needs review) first
  }, [activeSubject])

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <button 
            onClick={onReturnHome}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to core</span>
          </button>
          <h1 className="text-3xl font-display font-black tracking-tight text-foreground flex items-center gap-3">
            STUDY STATISTICS <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/30">LIVE</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">REAL-TIME ACADEMIC PROGRESS AND STUDY STATS.</p>
        </div>
      </div>

      {/* ─── HUD METRICS GRID STRIP ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Runs Card */}
        <div className="p-5 border border-border bg-panel rounded relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm">
          <div className="absolute top-4 right-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
            <Trophy className="w-5 h-5" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-bold">QUIZZES COMPLETED</p>
          <p className="text-3xl font-mono font-bold tracking-tight text-foreground mt-2 tabular-nums">
            {stats.totalRuns}
          </p>
          <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded w-fit">
            <Flame className="w-3 h-3 text-amber-500 animate-pulse" />
            <span>DAY STREAK: {dayStreak}</span>
          </div>
        </div>

        {/* Average Score (Accuracy) Card */}
        <div className="p-5 border border-border bg-panel rounded relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm">
          <div className="absolute top-4 right-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
            <Target className="w-5 h-5" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-bold">AVERAGE ACCURACY</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-mono font-bold text-foreground tabular-nums">
              {stats.averageScore}%
            </span>
            {stats.totalRuns > 0 && (
              <span className={cn("font-mono text-sm font-black px-1.5 py-0.5 rounded border border-glow", gradeBgColor(avgGrade))}>
                {avgGrade}
              </span>
            )}
          </div>
          <p className="text-[9px] text-muted-foreground font-mono mt-3">BEST SINGLE ATTEMPT: {stats.bestScore}%</p>
        </div>

        {/* Peak Correctness Streak Card */}
        <div className="p-5 border border-border bg-panel rounded relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm">
          <div className="absolute top-4 right-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-bold">BEST ANSWER STREAK</p>
          <p className="text-3xl font-mono font-bold tracking-tight text-foreground mt-2 tabular-nums">
            ×{peakQuestionStreak}
          </p>
          <p className="text-[9px] text-muted-foreground font-mono mt-3">BEST IN-QUIZ FOCUS CHAIN</p>
        </div>

        {/* Average Response Time Card */}
        <div className="p-5 border border-border bg-panel rounded relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm">
          <div className="absolute top-4 right-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-bold">AVERAGE ANSWER SPEED</p>
          <p className="text-3xl font-mono font-bold tracking-tight text-foreground mt-2 tabular-nums">
            {formatTime(Math.round((stats.averageResponseTimeMs || 0) / 1000))}
          </p>
          <p className="text-[9px] text-muted-foreground font-mono mt-3">
            {stats.averageResponseTimeMs ? `${Math.round(stats.averageResponseTimeMs)}ms per question` : "untimed"}
          </p>
        </div>

      </div>

      {/* ─── CRAMMING EXAM READINESS INDEX (FEATURE 4) ────────────────────── */}
      <CramReadinessPanel cramVerdict={cramVerdict} cramScore={cramScore} avgRetrievability={avgRetrievability} />

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
          <CategoryRecallPanel categoryStats={categoryStats} />
        </div>

        {/* RIGHT COLUMN: Missions, Milestones & Settings */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Daily Missions Panel */}
          <DailyMissionsPanel missions={missions} />

          {/* Long-Term Milestones Panel */}
          <LongTermMilestonesPanel milestones={milestones} />

          {/* CAUTION / DATA MANAGEMENT PANEL */}
          <DataSettingsPanel
            handleReset={handleReset}
            showConfirmReset={showConfirmReset}
            setShowConfirmReset={setShowConfirmReset}
          />

        </div>

      </div>

    </div>
  )
}
