"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
  useSafeAuth,
  loadSubjectRuns,
  saveSubjectRuns,
  loadSubjectStreaks,
  saveSubjectStreaks,
  getSubjectStorageKey,
  Q_STREAK_STORAGE_KEY,
  PEAK_Q_STREAK_STORAGE_KEY,
} from "../utils/user-storage"
import type { RunRecord, AggregateStats } from "../types/mold-types"
import { calculateDayStreak } from "./streak-utils"
import { computeAggregateStats } from "../types/mold-types"
import { evaluateDailyMissions, evaluateMilestones } from "./stats-utils"
import type { DailyMission, Milestone } from "./stats-utils"

export interface StatsContextValue {
  subjectId: string | null
  setSubjectId: (id: string) => void
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
  const [subjectId, setSubjectIdState] = useState<string | null>("theory-of-computation")
  const subjectIdRef = useRef<string | null>(subjectId)
  subjectIdRef.current = subjectId

  const setSubjectId = useCallback((id: string) => {
    setSubjectIdState((prev) => (prev === id ? prev : id))
  }, [])

  // Vercel Best Practices: rerender-lazy-state-init (avoid disk read waterfall on render mount)
  const [runs, setRuns] = useState<RunRecord[]>(() => loadSubjectRuns(subjectId, userId))

  const initialStreaks = useMemo(() => loadSubjectStreaks(subjectId, userId), [subjectId, userId])
  const [currentQuestionStreak, setCurrentQuestionStreak] = useState<number>(initialStreaks.currentStreak)
  const [peakQuestionStreak, setPeakQuestionStreak] = useState<number>(initialStreaks.peakStreak)

  // Synchronize state when subjectId or userId changes (Vercel best-practices: js-cache-storage)
  const prevScopeRef = useRef(`${subjectId}_${userId}`)
  useEffect(() => {
    const currentScope = `${subjectId}_${userId}`
    if (prevScopeRef.current !== currentScope) {
      prevScopeRef.current = currentScope
      const loadedRuns = loadSubjectRuns(subjectId, userId)
      setRuns(loadedRuns)

      const streaks = loadSubjectStreaks(subjectId, userId)
      setCurrentQuestionStreak(streaks.currentStreak)
      setPeakQuestionStreak(streaks.peakStreak)
    }
  }, [subjectId, userId])

  // Vercel Best Practices: rerender-derived-state-no-effect (pure derived state using useMemo)
  const dayStreak = useMemo(() => calculateDayStreak(runs), [runs])

  // 2. Computed aggregate statistics scoped to active subject
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

  // 5. Action: update active question streak on answer submission for current subject
  const updateQuestionStreak = useCallback((isCorrect: boolean) => {
    const activeSubj = subjectIdRef.current
    setCurrentQuestionStreak((prev) => {
      const next = isCorrect ? prev + 1 : 0

      setPeakQuestionStreak((currentPeak) => {
        const nextPeak = next > currentPeak ? next : currentPeak
        saveSubjectStreaks(next, nextPeak, activeSubj, userId)
        return nextPeak
      })

      return next
    })
  }, [userId])

  // 6. Action: commit completed run records to storage & sync state
  const recordSession = useCallback((run: RunRecord) => {
    const activeSubj = run.subjectId || subjectIdRef.current || "theory-of-computation"
    const taggedRun: RunRecord = {
      ...run,
      subjectId: activeSubj,
    }

    setRuns((prev) => {
      const hasCurrentRun = prev.some((r) => r.id === taggedRun.id)
      const nextRuns = hasCurrentRun ? prev : [...prev, taggedRun]
      const trimmedRuns = nextRuns.slice(-50)
      
      saveSubjectRuns(trimmedRuns, activeSubj, userId)
      return trimmedRuns
    })
  }, [userId])

  // 7. Action: clear all stats logs & caches for current subject
  const resetAllStats = useCallback(() => {
    const activeSubj = subjectIdRef.current
    if (typeof window !== "undefined") {
      const qKey = getSubjectStorageKey(Q_STREAK_STORAGE_KEY, activeSubj, userId)
      const peakKey = getSubjectStorageKey(PEAK_Q_STREAK_STORAGE_KEY, activeSubj, userId)
      localStorage.removeItem(qKey)
      localStorage.removeItem(peakKey)
    }
    
    saveSubjectRuns([], activeSubj, userId)
    setRuns([])
    setCurrentQuestionStreak(0)
    setPeakQuestionStreak(0)
  }, [userId])

  return (
    <StatsContext.Provider
      value={{
        subjectId,
        setSubjectId,
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
