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

// ─── Storage key ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "mold_v2_achievements"

// ─── Persistence helpers (localStorage, with IndexedDB upgrade path noted) ────
// Production upgrade: swap these two functions for an IDB-backed repository.
// The interface is intentionally kept async to make that migration transparent.

async function loadAchievements(): Promise<Achievement[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Achievement[]
  } catch {
    return []
  }
}

async function saveAchievements(achievements: Achievement[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements))
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
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [conditions, setConditions]   = useState<Record<string, AchievementCondition>>({})

  useEffect(() => {
    loadAchievements().then(setAchievements)
  }, [])

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

      // 2. Load all stored achievements (across all subjects)
      const stored = await loadAchievements()
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

      // 4. Merge into global storage: keep others, update/add current subject's
      const subjectIds = new Set(subjectAchievements.map(a => a.id))
      const others = stored.filter(a => !subjectIds.has(a.id))
      const fullMerged = [...others, ...subjectAchievements]

      await saveAchievements(fullMerged)

      // 5. Update local React state with ONLY this subject's achievements
      setAchievements(subjectAchievements)
    },
    []
  )

  const onGameComplete = useCallback(
    async (state: GameState, allRuns: RunRecord[]): Promise<Achievement[]> => {
      const current = await loadAchievements()
      // Use subject-specific conditions for evaluation
      const newIds = checkNewUnlocks(current, state, allRuns, conditions)

      if (newIds.length === 0) return []

      const now = new Date().toISOString()
      const updated = current.map((a) =>
        newIds.includes(a.id) ? { ...a, unlockedAt: now } : a
      )

      await saveAchievements(updated)

      // Sync local state: update unlockedAt for the achievements we are currently displaying
      const updatedMap = new Map(updated.map((u) => [u.id, u]))
      setAchievements((prev) =>
        prev.map((a) => {
          const match = updatedMap.get(a.id)
          return match ? { ...a, unlockedAt: match.unlockedAt } : a
        })
      )

      // Return the newly unlocked Achievement objects for the toast
      return updated.filter((a) => newIds.includes(a.id))
    },
    [conditions]
  )

  const reset = useCallback(async () => {
    const cleared = (await loadAchievements()).map((a) => ({ ...a, unlockedAt: null }))
    await saveAchievements(cleared)
    setAchievements(cleared)
  }, [])

  return (
    <AchievementContext.Provider value={{ achievements, syncSubjectAchievements, onGameComplete, reset }}>
      {children}
    </AchievementContext.Provider>
  )
}
