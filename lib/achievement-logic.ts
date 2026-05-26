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
type ConditionEvaluator = (
  condition: AchievementCondition,
  state: GameState,
  allRuns: RunRecord[]
) => boolean;

const CONDITION_EVALUATORS: Record<string, ConditionEvaluator> = {
  accuracy_gte: (condition, state) => {
    const accuracyPct = calculateAccuracy(state.score, state.wrongAnswers);
    return accuracyPct >= (condition.value ?? 0);
  },
  streak_gte: (condition, state) => {
    return state.bestStreak >= (condition.value ?? 0);
  },
  mode_complete: (condition, state) => {
    return state.mode === condition.mode;
  },
  speedrun_under: (condition, state) => {
    return state.mode === "speedrun" && state.elapsedSeconds <= (condition.seconds ?? Infinity);
  },
  no_hints: (condition, state) => {
    return state.mode === condition.mode && state.hintsUsedTotal === 0;
  },
  runs_gte: (condition, _state, allRuns) => {
    return allRuns.length >= (condition.value ?? 0);
  },
  all_categories: (_condition, _state, allRuns) => {
    // Check that at least one run exists for each category (via practice mode)
    // Simplified: check that the player has used practice mode for every category
    let practiceCount = 0;

    // Fallback logic for backward compatibility until full implementation tracks selectedCategory per run
    for (let i = 0; i < allRuns.length; i++) {
      if (allRuns[i].mode !== "practice") {
        continue;
      }
      practiceCount++;
      if (practiceCount >= 3) {
        return true;
      }
    }

    // For demo purposes: unlock when they have 3+ practice runs
    return false;
  },
  all_unlocked: () => {
    return false;
  },
};

export function evaluateCondition(
  condition: AchievementCondition,
  state: GameState,
  allRuns: RunRecord[]
): boolean {
  const evaluator = CONDITION_EVALUATORS[condition.type];
  if (evaluator) {
    return evaluator(condition, state, allRuns);
  }
  return false;
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

  for (let i = 0; i < achievements.length; i++) {
    const ach = achievements[i];
    if (ach.unlockedAt !== null) continue   // already unlocked — skip

    // Find raw definition to get the condition
    const condition = activeConditions[ach.id]
    if (!condition) continue

    if (evaluateCondition(condition, state, allRuns)) {
      newlyUnlocked.push(ach.id)
    }
  }

  // Check "all_unlocked" meta-achievement separately
  let allOthersLocked = true;
  let grandMaster: Achievement | undefined;

  for (let i = 0; i < achievements.length; i++) {
    const a = achievements[i];
    if (a.id === "grand-master" || a.id === "grand_master") {
      grandMaster = a;
      continue;
    }

    if (a.unlockedAt === null && !newlyUnlocked.includes(a.id)) {
      allOthersLocked = false;
    }
  }

  if (allOthersLocked && grandMaster && grandMaster.unlockedAt === null) {
    newlyUnlocked.push(grandMaster.id)
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
