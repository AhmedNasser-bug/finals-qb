"use client";

import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import { useStats } from "@/lib/game/stats-context";
import { StreakAscent } from "./streak-ascent";
import { calculateGrade } from "@/lib/mold-types";
import { getActiveSubject } from "@/lib/active-subject-store";
import {
  loadRetentionMap,
  calculateRetrievability,
} from "@/lib/telemetry/retention-kernel";

import { HUDMetrics } from "./stats/hud-metrics";
import { CramReadiness } from "./stats/cram-readiness";
import { CategoryRetrievability } from "./stats/category-retrievability";
import { DailyMissions } from "./stats/daily-missions";
import { LongTermMilestones } from "./stats/long-term-milestones";
import { DataManagement } from "./stats/data-management";

interface StatsScreenProps {
  onReturnHome: () => void;
}

export function StatsScreen({ onReturnHome }: StatsScreenProps) {
  const {
    runs,
    dayStreak,
    peakQuestionStreak,
    stats,
    missions,
    milestones,
    resetAllStats,
  } = useStats();

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const activeSubject = getActiveSubject();
  const retentionMap = activeSubject ? loadRetentionMap(activeSubject.id) : {};

  // Compute category retrievability
  const categoryStats = useMemo(() => {
    if (!activeSubject) return [];
    const catMap: Record<string, { total: number; sumR: number }> = {};

    activeSubject.questions.forEach((q) => {
      const cat = q.category || "general";
      if (!catMap[cat]) catMap[cat] = { total: 0, sumR: 0 };
      catMap[cat].total += 1;
      const itemState = retentionMap[q.id];
      if (itemState && itemState.lastReviewedAt) {
        const daysElapsed =
          (Date.now() - new Date(itemState.lastReviewedAt).getTime()) /
          (1000 * 60 * 60 * 24);
        catMap[cat].sumR += calculateRetrievability(
          itemState.stability,
          daysElapsed,
        );
      } else {
        catMap[cat].sumR += 0.5; // Default unreviewed retrievability estimate
      }
    });

    return Object.entries(catMap)
      .map(([cat, val]) => ({
        category: cat,
        retrievabilityPct: Math.round(
          (val.sumR / Math.max(1, val.total)) * 100,
        ),
        totalQuestions: val.total,
      }))
      .sort((a, b) => a.retrievabilityPct - b.retrievabilityPct); // Sort lowest (needs review) first
  }, [activeSubject, retentionMap]);

  // Compute Cramming Readiness Index
  const avgScore = stats.averageScore || 0;
  const avgRetrievability =
    categoryStats.length > 0
      ? Math.round(
          categoryStats.reduce((acc, c) => acc + c.retrievabilityPct, 0) /
            categoryStats.length,
        )
      : 50;

  const cramScore = Math.min(
    99,
    Math.max(
      15,
      Math.round(
        avgScore * 0.55 +
          avgRetrievability * 0.35 +
          Math.min(10, stats.totalRuns * 2),
      ),
    ),
  );

  let cramVerdict = {
    title: "COGNITIVE SPEEDRUN READY",
    badge: "S-TIER CRAMMER",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    text: "You'll speedrun this exam while the professor is still handing out papers. Go touch some grass.",
  };

  if (cramScore < 50) {
    cramVerdict = {
      title: "HIGH-RISK PANIC ZONE",
      badge: "COFFEE OVERDOSE",
      badgeColor: "text-red-400 border-red-500/30 bg-red-500/10",
      text: "The exam will humble you. Stop doom-scrolling, chug water, and run a Survival session immediately.",
    };
  } else if (cramScore < 75) {
    cramVerdict = {
      title: "COIN-TOSS PROBABILITY",
      badge: "BORDERLINE PASS",
      badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      text: "50% chance of an A, 50% chance of staring blankly at the ceiling on Question 4. Re-drill your red categories.",
    };
  } else if (cramScore < 90) {
    cramVerdict = {
      title: "SOLID EXAM PASS",
      badge: "SECURE GRADE",
      badgeColor: "text-primary border-primary/30 bg-primary/10",
      text: "You're passing comfortably, but that lowest-ranked category below will show up. Quick-drill it once.",
    };
  }

  const avgGrade = calculateGrade(stats.averageScore || 0);

  const handleReset = () => {
    resetAllStats();
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-8 select-none animate-fade-in pb-16">
      {/* ─── SCREEN HEADER ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <button
            onClick={onReturnHome}
            className="flex items-center gap-2 text-zinc-400 hover:text-[#fecc17] transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to core</span>
          </button>
          <h1 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-3">
            STUDY STATISTICS{" "}
            <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-primary/5 border border-primary/20">
              LIVE
            </span>
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            REAL-TIME ACADEMIC PROGRESS AND STUDY STATS.
          </p>
        </div>
      </div>

      {/* ─── HUD METRICS GRID STRIP ────────────────────────────────────────── */}
      <HUDMetrics
        stats={stats}
        dayStreak={dayStreak}
        peakQuestionStreak={peakQuestionStreak}
        avgGrade={avgGrade}
      />

      {/* ─── CRAMMING EXAM READINESS INDEX (FEATURE 4) ────────────────────── */}
      <CramReadiness
        cramVerdict={cramVerdict}
        cramScore={cramScore}
        avgRetrievability={avgRetrievability}
      />

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

          <CategoryRetrievability categoryStats={categoryStats} />
        </div>

        {/* RIGHT COLUMN: Missions, Milestones & Settings */}
        <div className="lg:col-span-7 space-y-8">
          <DailyMissions missions={missions} />

          <LongTermMilestones milestones={milestones} />

          <DataManagement
            showConfirmReset={showConfirmReset}
            setShowConfirmReset={setShowConfirmReset}
            handleReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
