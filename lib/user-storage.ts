/**
 * User storage utility
 * Namespaces localStorage keys based on the authenticated Clerk user ID.
 * This guarantees proper isolation between users on the same device
 * and makes future database sync/device sync seamless.
 */

export const RUNS_STORAGE_KEY = "mold_v2_runs"
export const ACHIEVEMENTS_STORAGE_KEY = "mold_v2_achievements"

/**
 * Returns a namespaced key if a userId is provided.
 * Otherwise, falls back to the legacy anonymous key to preserve existing local data.
 */
export function getNamespacedKey(baseKey: string, userId: string | null | undefined): string {
  if (!userId) return baseKey
  return `${baseKey}_${userId}`
}
