"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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

import {
  getSubjectStorageKey,
  ACHIEVEMENTS_STORAGE_KEY,
  useSafeAuth,
} from "@/lib/user-storage"

// ─── Persistence helpers (localStorage, namespaced by subjectId and userId) ────

export async function loadSubjectAchievements(
  subjectId: string,
  userId?: string | null
): Promise<Achievement[]> {
  if (typeof window === "undefined" && typeof (globalThis as any).localStorage === "undefined") {
    return []
  }
  try {
    const key = getSubjectStorageKey(ACHIEVEMENTS_STORAGE_KEY, subjectId, userId)
    const raw = localStorage.getItem(key)
    if (raw) {
      return JSON.parse(raw) as Achievement[]
    }

    // Transparent legacy migration fallback: check unscoped achievements
    const legacyKey = getSubjectStorageKey(ACHIEVEMENTS_STORAGE_KEY, null, userId)
    const legacyRaw = localStorage.getItem(legacyKey)
    if (legacyRaw && subjectId === "theory-of-computation") {
      try {
        const legacy = JSON.parse(legacyRaw) as Achievement[]
        if (Array.isArray(legacy) && legacy.length > 0) {
          await saveSubjectAchievements(legacy, subjectId, userId)
          return legacy
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

export async function saveSubjectAchievements(
  achievements: Achievement[],
  subjectId: string,
  userId?: string | null
): Promise<void> {
  if (typeof window === "undefined" && typeof (globalThis as any).localStorage === "undefined") {
    return
  }
  try {
    const key = getSubjectStorageKey(ACHIEVEMENTS_STORAGE_KEY, subjectId, userId)
    localStorage.setItem(key, JSON.stringify(achievements))
  } catch {
    // quota exceeded — silently ignore in demo; surface in prod via telemetry
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AchievementContextValue {
  achievements: Achievement[]
  /** Call when a subject is loaded to seed/merge its achievement definitions. */
  syncSubjectAchievements: (subject: import("@/lib/mold-types").FullSubjectData) => Promise<void>
  /** Call after a game completes to evaluate + persist any new unlocks */
  onGameComplete: (state: GameState, allRuns: RunRecord[]) => Promise<Achievement[]>
  /** Reset all achievements for current subject to locked (dev/debug use only) */
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
  const { userId } = useSafeAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [conditions, setConditions] = useState<Record<string, AchievementCondition>>({})
  const activeSubjectIdRef = useRef<string>("theory-of-computation")

  // Reload achievements when user session changes
  useEffect(() => {
    loadSubjectAchievements(activeSubjectIdRef.current, userId).then((loaded) => {
      if (loaded.length > 0) {
        setAchievements(loaded)
      }
    })
  }, [userId])

  /**
   * Sync the active subject's achievement definitions strictly into that subject's storage namespace.
   * Completely eliminates cross-subject ID collision and state corruption.
   */
  const syncSubjectAchievements = useCallback(
    async (subject: import("@/lib/mold-types").FullSubjectData): Promise<void> => {
      activeSubjectIdRef.current = subject.id

      // 1. Extract and store conditions for this subject
      const subjectConditions = loadConditionsFromSubject(subject)
      setConditions(subjectConditions)

      // 2. Load stored achievements specifically for THIS subject
      const stored = await loadSubjectAchievements(subject.id, userId)
      const storedMap = new Map(stored.map((a) => [a.id, a]))

      // 3. Prepare achievements for this subject
      const subjectAchievements: Achievement[] = subject.achievements.map((raw) => ({
        id:          raw.id,
        title:       raw.title,
        description: raw.description,
        icon:        raw.icon,
        // Preserve unlock state if this achievement was already unlocked in THIS subject
        unlockedAt:  storedMap.get(raw.id)?.unlockedAt ?? null,
      }))

      // 4. Save specifically to this subject's storage namespace
      await saveSubjectAchievements(subjectAchievements, subject.id, userId)

      // 5. Update local React state with this subject's achievements
      setAchievements(subjectAchievements)
    },
    [userId]
  )

  const onGameComplete = useCallback(
    async (state: GameState, allRuns: RunRecord[]): Promise<Achievement[]> => {
      const activeSubjectId = state.config.subjectId || activeSubjectIdRef.current || "theory-of-computation"
      const current = await loadSubjectAchievements(activeSubjectId, userId)

      // Strictly evaluate only against runs belonging to the active subject
      const subjectRuns = allRuns.filter(
        (r) => !r.subjectId || r.subjectId === activeSubjectId
      )

      // Use subject-specific conditions for evaluation
      const newIds = checkNewUnlocks(current, state, subjectRuns, conditions)

      if (newIds.length === 0) return []

      const now = new Date().toISOString()
      const newIdsSet = new Set(newIds)
      const updated = current.map((a) =>
        newIdsSet.has(a.id) ? { ...a, unlockedAt: now } : a
      )

      await saveSubjectAchievements(updated, activeSubjectId, userId)

      // Sync local state: update unlockedAt for achievements currently displayed
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
    const activeSubjectId = activeSubjectIdRef.current || "theory-of-computation"
    const current = await loadSubjectAchievements(activeSubjectId, userId)
    const cleared = current.map((a) => ({ ...a, unlockedAt: null }))
    await saveSubjectAchievements(cleared, activeSubjectId, userId)
    setAchievements(cleared)
  }, [userId])

  return (
    <AchievementContext.Provider
      value={{ achievements, syncSubjectAchievements, onGameComplete, reset }}
    >
      {children}
    </AchievementContext.Provider>
  )
}
