import { formatLabel, type FullSubjectData, type CategoryData } from "../types/mold-types"

/**
 * Derive CategoryData[] from a FullSubjectData by counting questions per category.
 * Used by SetupPanel / TargetSector grid and subject-persistence.toSubjectData().
 */
export function deriveCategoriesFromSubject(subject: FullSubjectData): CategoryData[] {
  const map = new Map<string, { name: string; count: number }>()

  for (const q of subject.questions) {
    const existing = map.get(q.category)
    if (existing) {
      existing.count++
    } else {
      const name = formatLabel(q.category)
      map.set(q.category, { name, count: 1 })
    }
  }

  const result = new Array(map.size);
  let i = 0;
  for (const [id, { name, count }] of map.entries()) {
    result[i] = {
      id,
      name,
      questionCount: count,
    };
    i++;
  }
  return result;
}
