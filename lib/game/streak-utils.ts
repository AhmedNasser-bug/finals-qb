// ─── Deterministic Day Streak Calculation from Run Records ───────────────────
export function calculateDayStreak(runs: Array<{ date: string }>): number {
  if (runs.length === 0) return 0;

  // 1. Extract unique YYYY-MM-DD local dates, sorted ascending
  // O(N) single pass to gather unique dates without aggressive array filtering or deep date object allocation overhead
  const uniqueDatesSet = new Set<string>();
  for (let i = 0; i < runs.length; i++) {
    const r = runs[i];
    if (!r.date) continue;

    // Fast path: substring matching on expected ISO8601 datestring footprint
    if (typeof r.date === 'string' && r.date.length >= 10 && r.date[4] === '-' && r.date[7] === '-') {
        uniqueDatesSet.add(r.date.substring(0, 10));
    } else {
        // Fallback for unexpected date formats
        try {
          const d = new Date(r.date);
          if (!isNaN(d.getTime())) {
            uniqueDatesSet.add(d.toISOString().substring(0, 10));
          }
        } catch {
          // Ignore unparseable elements
        }
    }
  }

  if (uniqueDatesSet.size === 0) return 0;

  const uniqueDates = Array.from(uniqueDatesSet).sort();

  // 2. Resolve Today and Yesterday date strings
  const now = new Date();
  const todayStr = now.toISOString().substring(0, 10);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().substring(0, 10);

  // 3. Find the most recent active run date
  const lastActiveDate = uniqueDates[uniqueDates.length - 1];

  // If the last study run was older than yesterday, the streak is completely broken
  if (lastActiveDate !== todayStr && lastActiveDate !== yesterdayStr) {
    return 0;
  }

  // 4. Trace backwards day-by-day and count consecutive occurrences
  let streak = 1;
  let currentDate = new Date(lastActiveDate);

  for (let i = uniqueDates.length - 2; i >= 0; i--) {
    currentDate.setDate(currentDate.getDate() - 1);
    const expectedStr = currentDate.toISOString().substring(0, 10);

    if (uniqueDates[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
