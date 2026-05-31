import type { FullSubjectData, CategoryData } from "@/lib/mold-types"

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
      const name = q.category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
      map.set(q.category, { name, count: 1 })
    }
  }

  return Array.from(map.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    questionCount: count,
  }))
}
