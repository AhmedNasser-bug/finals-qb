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
type Evaluator = (condition: AchievementCondition, state: GameState, allRuns: RunRecord[], accuracyPct: number) => boolean;

const conditionEvaluators: Record<string, Evaluator> = {
  "accuracy_gte": (c, s, _, acc) => acc >= (c.value ?? 0),
  "streak_gte": (c, s) => s.bestStreak >= (c.value ?? 0),
  "mode_complete": (c, s) => s.mode === c.mode,
  "speedrun_under": (c, s) => s.mode === "speedrun" && s.elapsedSeconds <= (c.seconds ?? Infinity),
  "no_hints": (c, s) => s.mode === c.mode && s.hintsUsedTotal === 0,
  "runs_gte": (c, _, runs) => runs.length >= (c.value ?? 0),
  "all_categories": (_, __, runs) => runs.filter((r) => r.mode === "practice").length >= 3,
  "all_unlocked": () => false,
};

export function evaluateCondition(
  condition: AchievementCondition,
  state: GameState,
  allRuns: RunRecord[]
): boolean {
  const accuracyPct = calculateAccuracy(state.score, state.wrongAnswers)
  const evaluator = conditionEvaluators[condition.type]
  return evaluator ? evaluator(condition, state, allRuns, accuracyPct) : false
}

/**
 * Given a completed game state + run history, return the ids of newly unlocked
 * achievements. Does not mutate the achievements array.
 */
export function checkNewUnlocks(
  achievements: Achievement[],
  state: GameState,
  allRuns: RunRecord[],
  conditionMap?: Record<string, AchievementCondition>
): string[] {
  const newlyUnlocked: string[] = []
  const activeConditions = conditionMap ?? ACHIEVEMENT_CONDITIONS

  for (const ach of achievements) {
    if (ach.unlockedAt !== null) continue   // already unlocked — skip

    // Find raw definition to get the condition
    const condition = activeConditions[ach.id]
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
