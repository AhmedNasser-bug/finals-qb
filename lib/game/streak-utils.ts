// ─── Deterministic Day Streak Calculation from Run Records ───────────────────
export function calculateDayStreak(runs: Array<{ date: string }>): number {
  if (runs.length === 0) return 0

  // 1. Extract unique YYYY-MM-DD local dates, sorted ascending
  const uniqueDates = Array.from(new Set(
    runs.map((r) => {
      try {
        return new Date(r.date).toISOString().split("T")[0]
      } catch {
        return ""
      }
    }).filter(Boolean)
  )).sort()

  if (uniqueDates.length === 0) return 0

  // 2. Resolve Today and Yesterday date strings
  const todayStr = new Date().toISOString().split("T")[0]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  // 3. Find the most recent active run date
  const lastActiveDate = uniqueDates[uniqueDates.length - 1]

  // If the last study run was older than yesterday, the streak is completely broken
  if (lastActiveDate !== todayStr && lastActiveDate !== yesterdayStr) {
    return 0
  }

  // 4. Trace backwards day-by-day and count consecutive occurrences
  let streak = 1
  let currentDate = new Date(lastActiveDate)

  for (let i = uniqueDates.length - 2; i >= 0; i--) {
    currentDate.setDate(currentDate.getDate() - 1)
    const expectedStr = currentDate.toISOString().split("T")[0]

    if (uniqueDates[i] === expectedStr) {
      streak++
    } else {
      break
    }
  }

  return streak
}
