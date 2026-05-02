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
  GameState,
  RunRecord,
} from "@/lib/mold-types"
import {
  checkNewUnlocks,
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

  useEffect(() => {
    loadAchievements().then(setAchievements)
  }, [])

  /**
   * Merge the active subject's achievement definitions into the stored list.
   * - New entries (not in storage yet) are added as locked (unlockedAt: null).
   * - Existing entries keep their current unlockedAt value.
   * - Entries from old subjects that no longer exist are removed.
   * This is the root cause fix for 0/0: without this, localStorage is always
   * empty on first load and achievements never appear in the gallery.
   */
  const syncSubjectAchievements = useCallback(
    async (subject: import("@/lib/mold-types").FullSubjectData): Promise<void> => {
      const stored = await loadAchievements()
      const storedMap = Object.fromEntries(stored.map((a) => [a.id, a]))

      const merged: Achievement[] = subject.achievements.map((raw) => ({
        id:          raw.id,
        title:       raw.title,
        description: raw.description,
        icon:        raw.icon,
        // Preserve unlock state if this achievement was already stored
        unlockedAt:  storedMap[raw.id]?.unlockedAt ?? null,
      }))

      await saveAchievements(merged)
      setAchievements(merged)
    },
    []
  )

  const onGameComplete = useCallback(
    async (state: GameState, allRuns: RunRecord[]): Promise<Achievement[]> => {
      const current = await loadAchievements()
      const newIds = checkNewUnlocks(current, state, allRuns)

      if (newIds.length === 0) return []

      const now = new Date().toISOString()
      const updated = current.map((a) =>
        newIds.includes(a.id) ? { ...a, unlockedAt: now } : a
      )

      await saveAchievements(updated)
      setAchievements(updated)

      // Return the newly unlocked Achievement objects for the toast
      return updated.filter((a) => newIds.includes(a.id))
    },
    []
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
