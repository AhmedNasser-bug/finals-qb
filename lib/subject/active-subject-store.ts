import type { FullSubjectData } from "@/lib/mold-types"

/**
 * Lightweight sessionStorage bridge used to pass a selected subject from the
 * /subjects page to the root page (HomeScreen) without persisting it to
 * localStorage and without requiring a full router state solution.
 *
 * Lifecycle:
 *   /subjects — user picks a subject → setActiveSubject(s) → router.push("/")
 *   /         — root page reads getActiveSubject() → mounts HomeScreen → clearActiveSubject()
 *
 * Survives router.push() navigations but NOT a full page reload — which is
 * acceptable since a reload on the game screen would lose GameState anyway.
 */

const SESSION_KEY = "mold_v2_active_subject"

/** Write the selected subject into sessionStorage. */
export function setActiveSubject(subject: FullSubjectData): void {
  if (typeof sessionStorage === "undefined") return
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(subject))
  } catch {
    // Quota exceeded — silently fail; root page will redirect back to /subjects
  }
}

/**
 * Read the active subject from sessionStorage.
 * Returns null if nothing is stored or if the value cannot be parsed.
 */
export function getActiveSubject(): FullSubjectData | null {
  if (typeof sessionStorage === "undefined") return null
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as FullSubjectData
  } catch {
    return null
  }
}

/** Remove the active subject from sessionStorage after it has been consumed. */
export function clearActiveSubject(): void {
  if (typeof sessionStorage === "undefined") return
  sessionStorage.removeItem(SESSION_KEY)
}
