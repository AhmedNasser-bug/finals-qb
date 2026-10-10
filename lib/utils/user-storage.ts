"use client"

import React, { createContext, useContext } from "react"
import type { RunRecord } from "../types/mold-types"

export const RUNS_STORAGE_KEY = "mold_v2_runs"
export const ACHIEVEMENTS_STORAGE_KEY = "mold_v2_achievements"
export const Q_STREAK_STORAGE_KEY = "mold_v2_current_q_streak"
export const PEAK_Q_STREAK_STORAGE_KEY = "mold_v2_peak_q_streak"

/**
 * Feature flag for auth provider readiness.
 * Primed for Firebase Auth integration.
 */
export const hasClerk = false

export interface SafeAuthState {
  userId: string | null
  isSignedIn: boolean
}

const DEFAULT_AUTH_STATE: SafeAuthState = {
  userId: null,
  isSignedIn: false,
}

const SafeAuthContext = createContext<SafeAuthState>(DEFAULT_AUTH_STATE)

export function SafeAuthProvider({
  children,
  value = DEFAULT_AUTH_STATE
}: {
  children: React.ReactNode
  value?: SafeAuthState
}) {
  return React.createElement(SafeAuthContext.Provider, { value }, children)
}

/**
 * Returns a namespaced key if a userId is provided.
 * Otherwise, falls back to the anonymous key.
 */
export function getNamespacedKey(baseKey: string, userId: string | null | undefined): string {
  if (!userId) return baseKey
  return `${baseKey}_${userId}`
}

/**
 * Returns a storage key scoped to both subjectId and userId.
 * Example: mold_v2_runs_theory-of-computation_user_123
 */
export function getSubjectStorageKey(
  baseKey: string,
  subjectId?: string | null,
  userId?: string | null
): string {
  const scopedBase = subjectId ? `${baseKey}_${subjectId}` : baseKey
  return getNamespacedKey(scopedBase, userId)
}

/**
 * A safe authentication hook wrapper adhering to React 19 Rules of Hooks.
 * Reads from SafeAuthContext unconditionally with no external auth vendor dependencies.
 */
export function useSafeAuth(): SafeAuthState {
  return useContext(SafeAuthContext)
}

/**
 * Subject-scoped run loader with transparent legacy migration.
 */
export function loadSubjectRuns(
  subjectId?: string | null,
  userId?: string | null
): RunRecord[] {
  if (typeof window === "undefined" && typeof (globalThis as any).localStorage === "undefined") {
    return []
  }
  try {
    const scopedKey = getSubjectStorageKey(RUNS_STORAGE_KEY, subjectId, userId)
    const raw = localStorage.getItem(scopedKey)
    if (raw) {
      return JSON.parse(raw) as RunRecord[]
    }

    // Transparent legacy migration: check un-scoped runs
    const legacyKey = getNamespacedKey(RUNS_STORAGE_KEY, userId)
    const legacyRaw = localStorage.getItem(legacyKey)
    if (legacyRaw) {
      try {
        const legacyRuns = JSON.parse(legacyRaw) as RunRecord[]
        if (Array.isArray(legacyRuns) && legacyRuns.length > 0) {
          if (!subjectId) {
            return legacyRuns
          }
          const matched = legacyRuns.filter(
            (r) => r.subjectId === subjectId || (!r.subjectId && subjectId === "theory-of-computation")
          )
          if (matched.length > 0) {
            saveSubjectRuns(matched, subjectId, userId)
            return matched
          }
        }
      } catch {
        // ignore legacy parsing error
      }
    }

    return []
  } catch {
    return []
  }
}

/**
 * Subject-scoped run saver. Tags all runs with subjectId and enforces 50-run cap.
 */
export function saveSubjectRuns(
  runs: RunRecord[],
  subjectId?: string | null,
  userId?: string | null
): void {
  if (typeof window === "undefined" && typeof (globalThis as any).localStorage === "undefined") {
    return
  }
  try {
    const scopedKey = getSubjectStorageKey(RUNS_STORAGE_KEY, subjectId, userId)
    const taggedRuns = runs.map((r) => ({
      ...r,
      subjectId: r.subjectId || subjectId || "theory-of-computation",
    }))
    localStorage.setItem(scopedKey, JSON.stringify(taggedRuns.slice(-50)))
  } catch {
    // ignore quota errors
  }
}

/**
 * Backwards-compatible loadRuns supporting both:
 * - loadRuns(subjectId, userId)
 * - loadRuns(userId) [legacy]
 */
export function loadRuns(
  subjectIdOrUserId?: string | null,
  userId?: string | null
): RunRecord[] {
  let resolvedSubjectId: string | null = null
  let resolvedUserId: string | null = null

  if (userId !== undefined) {
    resolvedSubjectId = subjectIdOrUserId ?? null
    resolvedUserId = userId ?? null
  } else if (subjectIdOrUserId) {
    if (subjectIdOrUserId.startsWith("user_")) {
      resolvedUserId = subjectIdOrUserId
    } else {
      resolvedSubjectId = subjectIdOrUserId
    }
  }

  return loadSubjectRuns(resolvedSubjectId, resolvedUserId)
}

/**
 * Backwards-compatible saveRuns supporting both:
 * - saveRuns(runs, subjectId, userId)
 * - saveRuns(runs, userId) [legacy]
 */
export function saveRuns(
  runs: RunRecord[],
  subjectIdOrUserId?: string | null,
  userId?: string | null
): void {
  let resolvedSubjectId: string | null = null
  let resolvedUserId: string | null = null

  if (userId !== undefined) {
    resolvedSubjectId = subjectIdOrUserId ?? null
    resolvedUserId = userId ?? null
  } else if (subjectIdOrUserId) {
    if (subjectIdOrUserId.startsWith("user_")) {
      resolvedUserId = subjectIdOrUserId
    } else {
      resolvedSubjectId = subjectIdOrUserId
    }
  }

  saveSubjectRuns(runs, resolvedSubjectId, resolvedUserId)
}

/**
 * Scoped streaks loader and saver.
 */
export function loadSubjectStreaks(
  subjectId?: string | null,
  userId?: string | null
): { currentStreak: number; peakStreak: number } {
  if (typeof window === "undefined" && typeof (globalThis as any).localStorage === "undefined") {
    return { currentStreak: 0, peakStreak: 0 }
  }
  try {
    const qKey = getSubjectStorageKey(Q_STREAK_STORAGE_KEY, subjectId, userId)
    const peakKey = getSubjectStorageKey(PEAK_Q_STREAK_STORAGE_KEY, subjectId, userId)
    const savedQ = localStorage.getItem(qKey)
    const savedPeak = localStorage.getItem(peakKey)
    return {
      currentStreak: savedQ ? parseInt(savedQ, 10) : 0,
      peakStreak: savedPeak ? parseInt(savedPeak, 10) : 0,
    }
  } catch {
    return { currentStreak: 0, peakStreak: 0 }
  }
}

export function saveSubjectStreaks(
  currentStreak: number,
  peakStreak: number,
  subjectId?: string | null,
  userId?: string | null
): void {
  if (typeof window === "undefined" && typeof (globalThis as any).localStorage === "undefined") {
    return
  }
  try {
    const qKey = getSubjectStorageKey(Q_STREAK_STORAGE_KEY, subjectId, userId)
    const peakKey = getSubjectStorageKey(PEAK_Q_STREAK_STORAGE_KEY, subjectId, userId)
    localStorage.setItem(qKey, currentStreak.toString())
    localStorage.setItem(peakKey, peakStreak.toString())
  } catch {
    // ignore quota error
  }
}

/**
 * StorageAdapter interface priming for Firebase Firestore.
 */
export interface StorageAdapter {
  getRuns(subjectId: string, userId?: string | null): Promise<RunRecord[]> | RunRecord[]
  saveRuns(runs: RunRecord[], subjectId: string, userId?: string | null): Promise<void> | void
  getStreaks(subjectId: string, userId?: string | null): Promise<{ currentStreak: number; peakStreak: number }> | { currentStreak: number; peakStreak: number }
  saveStreaks(currentStreak: number, peakStreak: number, subjectId: string, userId?: string | null): Promise<void> | void
}
