"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type {
  Achievement,
  AchievementCondition,
  GameState,
  RunRecord,
} from "@/lib/mold-types"
import {
  checkNewUnlocks,
  loadConditionsFromSubject,
} from "@/lib/achievement-logic"

// Re-export logic for backward compatibility
export {
  evaluateCondition,
  checkNewUnlocks,
  loadConditionsFromSubject,
  ACHIEVEMENT_CONDITIONS,
} from "./achievement-logic"

import { useAuth } from "@clerk/nextjs"
import { getNamespacedKey, ACHIEVEMENTS_STORAGE_KEY } from "@/lib/user-storage"

// ─── Persistence helpers (localStorage, namespaced by Clerk User ID) ────

async function loadAchievements(userId?: string | null): Promise<Achievement[]> {
  try {
    const key = getNamespacedKey(ACHIEVEMENTS_STORAGE_KEY, userId)
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as Achievement[]
  } catch {
    return []
  }
}

async function saveAchievements(achievements: Achievement[], userId?: string | null): Promise<void> {
  try {
    const key = getNamespacedKey(ACHIEVEMENTS_STORAGE_KEY, userId)
    localStorage.setItem(key, JSON.stringify(achievements))
  } catch {
    // quota exceeded — silently ignore in demo; surface in prod via Sentry
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AchievementContextValue {
  achievements: Achievement[]
  /** Call when a subject is loaded to seed/merge its achievement definitions. */
  syncSubjectAchievements: (subject: import("@/lib/mold-types").FullSubjectData) => Promise<void>
  /** Call after a game completes to evaluate + persist any new unlocks */
  onGameComplete: (state: GameState, allRuns: RunRecord[]) => Promise<Achievement[]>
  /** Reset all achievements to locked (dev/debug use only) */
  reset: () => Promise<void>
}

const AchievementContext = createContext<AchievementContextValue | null>(null)

export function useAchievements(): AchievementContextValue {
  const ctx = useContext(AchievementContext)
  if (!ctx) throw new Error("useAchievements must be used inside <AchievementProvider>")
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [conditions, setConditions]   = useState<Record<string, AchievementCondition>>({})

  // Reload achievements when Clerk user session changes (log in / out / switch)
  useEffect(() => {
    loadAchievements(userId).then(setAchievements)
  }, [userId])

  /**
   * Merge the active subject's achievement definitions into the stored list.
   * - New entries (not in storage yet) are added as locked (unlockedAt: null).
   * - Existing entries keep their current unlockedAt value.
   * - Entries from the same subject that no longer exist are removed.
   * This is the root cause fix for 0/0: without this, localStorage is always
   * empty on first load and achievements never appear in the gallery.
   */
  const syncSubjectAchievements = useCallback(
    async (subject: import("@/lib/mold-types").FullSubjectData): Promise<void> => {
      // 1. Extract and store conditions for this subject
      const subjectConditions = loadConditionsFromSubject(subject)
      setConditions(subjectConditions)

      // 2. Load all stored achievements (across all subjects) for this user
      const stored = await loadAchievements(userId)
      const storedMap = new Map(stored.map((a) => [a.id, a]))

      // 3. Prepare achievements for this subject
      const subjectAchievements: Achievement[] = subject.achievements.map((raw) => ({
        id:          raw.id,
        title:       raw.title,
        description: raw.description,
        icon:        raw.icon,
        // Preserve unlock state if this achievement was already stored
        unlockedAt:  storedMap.get(raw.id)?.unlockedAt ?? null,
      }))

      // 4. Merge into user storage: keep others, update/add current subject's
      const subjectIds = new Set(subjectAchievements.map(a => a.id))
      const others = stored.filter(a => !subjectIds.has(a.id))
      const fullMerged = [...others, ...subjectAchievements]

      await saveAchievements(fullMerged, userId)

      // 5. Update local React state with ONLY this subject's achievements
      setAchievements(subjectAchievements)
    },
    [userId]
  )

  const onGameComplete = useCallback(
    async (state: GameState, allRuns: RunRecord[]): Promise<Achievement[]> => {
      const current = await loadAchievements(userId)
      // Use subject-specific conditions for evaluation
      const newIds = checkNewUnlocks(current, state, allRuns, conditions)

      if (newIds.length === 0) return []

      const now = new Date().toISOString()
      const newIdsSet = new Set(newIds)
      const updated = current.map((a) =>
        newIdsSet.has(a.id) ? { ...a, unlockedAt: now } : a
      )

      await saveAchievements(updated, userId)

      // Sync local state: update unlockedAt for the achievements we are currently displaying
      const updatedMap = new Map(updated.map((u) => [u.id, u]))
      setAchievements((prev) =>
        prev.map((a) => {
          const match = updatedMap.get(a.id)
          return match ? { ...a, unlockedAt: match.unlockedAt } : a
        })
      )

      // Return the newly unlocked Achievement objects for the toast
      return updated.filter((a) => newIdsSet.has(a.id))
    },
    [conditions, userId]
  )

  const reset = useCallback(async () => {
    const cleared = (await loadAchievements(userId)).map((a) => ({ ...a, unlockedAt: null }))
    await saveAchievements(cleared, userId)
    setAchievements(cleared)
  }, [userId])

  return (
    <AchievementContext.Provider value={{ achievements, syncSubjectAchievements, onGameComplete, reset }}>
      {children}
    </AchievementContext.Provider>
  )
}
