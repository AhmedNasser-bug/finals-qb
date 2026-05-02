import { calculateAccuracy } from "@/lib/mold-types"
import type {
  Achievement,
  AchievementCondition,
  GameState,
  RunRecord,
} from "@/lib/mold-types"

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
  const accuracyPct = calculateAccuracy(state.score, state.wrongAnswers)

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

/** Active condition registry — swap to loadConditionsFromSubject() for prod. */
export const ACHIEVEMENT_CONDITIONS: Record<string, AchievementCondition> =
  DEMO_ACHIEVEMENT_CONDITIONS
