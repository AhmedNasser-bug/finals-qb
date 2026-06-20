"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useSafeAuth, loadRuns, saveRuns, getNamespacedKey } from "../utils/user-storage"
import type { RunRecord, AggregateStats } from "../types/mold-types"
import { calculateDayStreak } from "./streak-utils"
import { computeAggregateStats } from "../types/mold-types"
import { evaluateDailyMissions, evaluateMilestones } from "./stats-utils"
import type { DailyMission, Milestone } from "./stats-utils"

export interface StatsContextValue {
  runs: RunRecord[]
  dayStreak: number
  currentQuestionStreak: number
  peakQuestionStreak: number
  stats: AggregateStats
  missions: DailyMission[]
  milestones: Milestone[]
  updateQuestionStreak: (isCorrect: boolean) => void
  recordSession: (run: RunRecord) => void
  resetAllStats: () => void
}

const StatsContext = createContext<StatsContextValue | null>(null)

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useSafeAuth()

  // LocalStorage storage keys namespaced to user if signed in
  const qStreakKey = useMemo(() => getNamespacedKey("mold_v2_current_q_streak", userId), [userId])
  const peakQStreakKey = useMemo(() => getNamespacedKey("mold_v2_peak_q_streak", userId), [userId])

  // Vercel Best Practices: rerender-lazy-state-init (avoid disk read waterfall on render mount)
  const [runs, setRuns] = useState<RunRecord[]>(() => loadRuns(userId))

  // Vercel Best Practices: rerender-derived-state-no-effect (pure derived state using useMemo)
  const dayStreak = useMemo(() => calculateDayStreak(runs), [runs])

  const [currentQuestionStreak, setCurrentQuestionStreak] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedQ = localStorage.getItem(getNamespacedKey("mold_v2_current_q_streak", userId))
      return savedQ ? parseInt(savedQ, 10) : 0
    }
    return 0
  })

  const [peakQuestionStreak, setPeakQuestionStreak] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedPeak = localStorage.getItem(getNamespacedKey("mold_v2_peak_q_streak", userId))
      return savedPeak ? parseInt(savedPeak, 10) : 0
    }
    return 0
  })

  // Synchronize state when userId changes (Vercel best-practices: js-cache-storage)
  const prevUserRef = useRef(userId)
  useEffect(() => {
    if (prevUserRef.current !== userId) {
      prevUserRef.current = userId
      const loadedRuns = loadRuns(userId)
      setRuns(loadedRuns)

      if (typeof window !== "undefined") {
        const savedQ = localStorage.getItem(qStreakKey)
        const savedPeak = localStorage.getItem(peakQStreakKey)

        setCurrentQuestionStreak(savedQ ? parseInt(savedQ, 10) : 0)
        setPeakQuestionStreak(savedPeak ? parseInt(savedPeak, 10) : 0)
      }
    }
  }, [userId, qStreakKey, peakQStreakKey])

  // 2. Computed aggregate statistics
  const stats = useMemo(() => {
    return computeAggregateStats(runs)
  }, [runs])

  // 3. Computed deterministic daily missions
  const missions = useMemo<DailyMission[]>(() => {
    return evaluateDailyMissions(runs)
  }, [runs])

  // 4. Computed deterministic milestones
  const milestones = useMemo<Milestone[]>(() => {
    return evaluateMilestones(runs, dayStreak, peakQuestionStreak)
  }, [runs, dayStreak, peakQuestionStreak])

  // 5. Action: update active question streak on answer submission
  const updateQuestionStreak = useCallback((isCorrect: boolean) => {
    setCurrentQuestionStreak((prev) => {
      const next = isCorrect ? prev + 1 : 0

      if (typeof window !== "undefined") {
        localStorage.setItem(qStreakKey, next.toString())
      }

      setPeakQuestionStreak((currentPeak) => {
        if (next <= currentPeak) return currentPeak;

        if (typeof window !== "undefined") {
          localStorage.setItem(peakQStreakKey, next.toString())
        }
        return next
      })

      return next
    })
  }, [qStreakKey, peakQStreakKey])

  // 6. Action: commit completed run records to storage & sync state
  const recordSession = useCallback((run: RunRecord) => {
    setRuns((prev) => {
      const hasCurrentRun = prev.some((r) => r.id === run.id)
      const nextRuns = hasCurrentRun ? prev : [...prev, run]
      const trimmedRuns = nextRuns.slice(-50)
      
      saveRuns(trimmedRuns, userId)
      return trimmedRuns
    })
  }, [userId])

  // 7. Action: clear all stats logs & caches
  const resetAllStats = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(qStreakKey)
      localStorage.removeItem(peakQStreakKey)
    }
    
    saveRuns([], userId)
    setRuns([])
    setCurrentQuestionStreak(0)
    setPeakQuestionStreak(0)
  }, [qStreakKey, peakQStreakKey, userId])

  return (
    <StatsContext.Provider
      value={{
        runs,
        dayStreak,
        currentQuestionStreak,
        peakQuestionStreak,
        stats,
        missions,
        milestones,
        updateQuestionStreak,
        recordSession,
        resetAllStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  const ctx = useContext(StatsContext)
  if (!ctx) {
    throw new Error("useStats must be used inside a <StatsProvider>")
  }
  return ctx
}

// ─── Backward Compatibility Wrappers for useStreak/StreakProvider ─────────────
export const StreakProvider = StatsProvider
export function useStreak() {
  const {
    dayStreak,
    currentQuestionStreak,
    peakQuestionStreak,
    updateQuestionStreak,
    recordSession,
  } = useStats()

  return {
    dayStreak,
    currentQuestionStreak,
    peakQuestionStreak,
    updateQuestionStreak,
    recordSession,
    resetAllStreaks: useStats().resetAllStats,
  }
}
