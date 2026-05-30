import { useAuth as useClerkAuth } from "@clerk/nextjs"

export const RUNS_STORAGE_KEY = "mold_v2_runs"
export const ACHIEVEMENTS_STORAGE_KEY = "mold_v2_achievements"

/**
 * Global feature flag to determine if Clerk is enabled in the environment.
 * If true, Clerk Provider is mounted and auth flows are active.
 * If false, the app gracefully falls back to local/anonymous state.
 */
export const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

/**
 * Returns a namespaced key if a userId is provided.
 * Otherwise, falls back to the legacy anonymous key.
 */
export function getNamespacedKey(baseKey: string, userId: string | null | undefined): string {
  if (!userId) return baseKey
  return `${baseKey}_${userId}`
}

/**
 * A safe authentication hook wrapper.
 * Returns empty/anonymous auth state if Clerk is not enabled in the environment,
 * preventing any "useAuth must be used inside <ClerkProvider>" crashes.
 */
export function useSafeAuth() {
  if (!hasClerk) {
    return { userId: null, isSignedIn: false }
  }
  try {
    return useClerkAuth()
  } catch {
    return { userId: null, isSignedIn: false }
  }
}
