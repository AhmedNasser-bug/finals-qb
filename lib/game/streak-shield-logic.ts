export interface StreakShieldState {
  streak: number
  streakShieldActive: boolean
  streakShieldTriggeredThisQuestion: boolean
}

/**
 * Calculates the next streak and shield states based on question correctness.
 * - Earning: Activated automatically at a 5-streak if not already active.
 * - Mistake Absorption: Protects the active streak from one mistake, resetting the shield instead of the streak.
 */
export function evaluateStreakAndShield(
  isCorrect: boolean,
  currentStreak: number,
  isShieldActive: boolean
): StreakShieldState {
  let newStreak = currentStreak
  let streakShieldActive = isShieldActive
  let streakShieldTriggeredThisQuestion = false

  if (isCorrect) {
    newStreak = currentStreak + 1
    if (newStreak >= 5 && !streakShieldActive) {
      streakShieldActive = true
    }
  } else {
    if (streakShieldActive) {
      streakShieldActive = false
      streakShieldTriggeredThisQuestion = true
    } else {
      newStreak = 0
    }
  }

  return {
    streak: newStreak,
    streakShieldActive,
    streakShieldTriggeredThisQuestion,
  }
}
