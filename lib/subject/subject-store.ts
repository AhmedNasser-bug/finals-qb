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
      const words = q.category.split("-");
      const nameWords = new Array(words.length);
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        nameWords[i] = w.charAt(0).toUpperCase() + w.slice(1);
      }
      const name = nameWords.join(" ");
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
