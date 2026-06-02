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
      const parts = q.category.split("-")
      const formattedParts = new Array(parts.length)
      for (let i = 0; i < parts.length; i++) {
        formattedParts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1)
      }
      const name = formattedParts.join(" ")
      map.set(q.category, { name, count: 1 })
    }
  }

  const entries = Array.from(map.entries())
  const result = new Array(entries.length)
  for (let i = 0; i < entries.length; i++) {
    const [id, { name, count }] = entries[i]
    result[i] = { id, name, questionCount: count }
  }
  return result
}
