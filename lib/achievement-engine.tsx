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
import { calculateGrade } from "@/lib/mold-types"

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

// ─── Condition Evaluator ──────────────────────────────────────────────────────

/**
 * Evaluate a single achievement condition against the completed game state.
 * Returns true when the condition is met for the first time (unlock trigger).
 *
 * @param condition  - The condition definition from the achievement JSON
 * @param state      - The completed GameState
 * @param allRuns    - Full run history (including the just-completed run)
 */
export function evaluateCondition(
  condition: AchievementCondition,
  state: GameState,
  allRuns: RunRecord[]
): boolean {
  const total = state.questions.length
  const accuracyPct = total > 0 ? Math.round((state.score / total) * 100) : 0

  switch (condition.type) {
    case "accuracy_gte":
      return accuracyPct >= (condition.value ?? 0)

    case "streak_gte":
      return state.bestStreak >= (condition.value ?? 0)

    case "mode_complete":
      return state.mode === condition.mode

    case "speedrun_under":
      return (
        state.mode === "speedrun" &&
        state.elapsedSeconds <= (condition.seconds ?? Infinity)
      )

    case "no_hints":
      return (
        state.mode === condition.mode &&
        state.hintsUsedTotal === 0
      )

    case "runs_gte":
      return allRuns.length >= (condition.value ?? 0)

    case "all_categories": {
      // Check that at least one run exists for each category (via practice mode)
      // Simplified: check that the player has used practice mode for every category
      const practicedCategories = new Set(
        allRuns
          .filter((r) => r.mode === "practice")
          .map((r) => r.mode)  // In full impl this would track selectedCategory per run
      )
      // For demo purposes: unlock when they have 3+ practice runs
      return allRuns.filter((r) => r.mode === "practice").length >= 3
    }

    case "all_unlocked":
      // Meta-achievement — evaluated separately after all others
      return false

    default:
      return false
  }
}

/**
 * Given a completed game state + run history, return the ids of newly unlocked
 * achievements. Does not mutate the achievements array.
 */
export function checkNewUnlocks(
  achievements: Achievement[],
  state: GameState,
  allRuns: RunRecord[]
): string[] {
  const newlyUnlocked: string[] = []

  for (const ach of achievements) {
    if (ach.unlockedAt !== null) continue   // already unlocked — skip

    // Find raw definition to get the condition (demo achievements use a map)
    const condition = ACHIEVEMENT_CONDITIONS[ach.id]
    if (!condition) continue

    if (evaluateCondition(condition, state, allRuns)) {
      newlyUnlocked.push(ach.id)
    }
  }

  // Check "all_unlocked" meta-achievement separately
  const allOthersLocked = achievements
    .filter((a) => a.id !== "grand-master" && a.id !== "grand_master")
    .every((a) => a.unlockedAt !== null || newlyUnlocked.includes(a.id))

  if (allOthersLocked) {
    const grandMaster = achievements.find(
      (a) => a.id === "grand-master" || a.id === "grand_master"
    )
    if (grandMaster && grandMaster.unlockedAt === null) {
      newlyUnlocked.push(grandMaster.id)
    }
  }

  return newlyUnlocked
}

// ─── Condition registry (maps achievement id → condition) ─────────────────────
/**
 * DEMO FALLBACK — used when a FullSubjectData's achievements[] array is absent
 * or does not supply condition definitions.
 *
 * Production usage: call loadConditionsFromSubject(subject) to build this
 * registry from the live data instead.
 */
const DEMO_ACHIEVEMENT_CONDITIONS: Record<string, AchievementCondition> = {
  "first-blood":   { type: "runs_gte",       value: 1 },
  "perfect-run":   { type: "accuracy_gte",   value: 97 },
  "survivor":      { type: "mode_complete",  mode: "survival" },
  "speedster":     { type: "speedrun_under", mode: "speedrun", seconds: 180 },
  "streak-15":     { type: "streak_gte",     value: 15 },
  "hardcore-ace":  { type: "accuracy_gte",   value: 90 },
  "blitz-master":  { type: "runs_gte",       value: 10 },
  "full-revision": { type: "mode_complete",  mode: "full-revision" },
  "all-categories":{ type: "all_categories" },
  "no-hints":      { type: "no_hints",       mode: "hardcore" },
  "daily-3":       { type: "runs_gte",       value: 3 },
  "grand-master":  { type: "all_unlocked" },
}

/**
 * Build a condition registry from a FullSubjectData's achievements array.
 * Use this in production to replace the DEMO_ACHIEVEMENT_CONDITIONS fallback.
 *
 * @example
 *   const conditionMap = loadConditionsFromSubject(mySubject)
 *   // pass conditionMap into checkNewUnlocks (future overload)
 */
export function loadConditionsFromSubject(
  subject: import("@/lib/mold-types").FullSubjectData
): Record<string, AchievementCondition> {
  return Object.fromEntries(
    subject.achievements
      .filter((a) => a.condition != null)
      .map((a) => [a.id, a.condition as AchievementCondition])
  )
}

/** Active condition registry — swap to loadConditionsFromSubject() for prod. */
const ACHIEVEMENT_CONDITIONS: Record<string, AchievementCondition> =
  DEMO_ACHIEVEMENT_CONDITIONS

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

// ─── Provider ──────────────────────────��──────────────────────────────────────

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
