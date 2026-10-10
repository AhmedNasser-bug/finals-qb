"use client"

import React, { createContext, useContext } from "react"
import { useAuth as useClerkAuth } from "@clerk/nextjs"
import type { RunRecord } from "../types/mold-types"

export const RUNS_STORAGE_KEY = "mold_v2_runs"
export const ACHIEVEMENTS_STORAGE_KEY = "mold_v2_achievements"

/**
 * Global feature flag to determine if Clerk is enabled in the environment.
 * If true, Clerk Provider is mounted and auth flows are active.
 * If false, the app gracefully falls back to local/anonymous state.
 */
export const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export interface SafeAuthState {
  userId: string | null
  isSignedIn: boolean
}

const DEFAULT_AUTH_STATE: SafeAuthState = {
  userId: null,
  isSignedIn: false,
}

const SafeAuthContext = createContext<SafeAuthState>(DEFAULT_AUTH_STATE)

function ClerkAuthConsumer({ children }: { children: React.ReactNode }) {
  const clerkAuth = useClerkAuth()
  const value: SafeAuthState = {
    userId: clerkAuth.userId ?? null,
    isSignedIn: !!clerkAuth.isSignedIn,
  }
  return React.createElement(SafeAuthContext.Provider, { value }, children)
}

export function SafeAuthProvider({ children }: { children: React.ReactNode }) {
  if (hasClerk) {
    return React.createElement(ClerkAuthConsumer, null, children)
  }
  return React.createElement(SafeAuthContext.Provider, { value: DEFAULT_AUTH_STATE }, children)
}

/**
 * Returns a namespaced key if a userId is provided.
 * Otherwise, falls back to the legacy anonymous key.
 */
export function getNamespacedKey(baseKey: string, userId: string | null | undefined): string {
  if (!userId) return baseKey
  return `${baseKey}_${userId}`
}

/**
 * A safe authentication hook wrapper adhering to React 19 Rules of Hooks.
 * Reads from SafeAuthContext unconditionally with no conditional calls or try/catch.
 */
export function useSafeAuth(): SafeAuthState {
  return useContext(SafeAuthContext)
}

export function loadRuns(userId?: string | null): RunRecord[] {
  try {
    const key = getNamespacedKey(RUNS_STORAGE_KEY, userId)
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as RunRecord[]
  } catch {
    return []
  }
}

export function saveRuns(runs: RunRecord[], userId?: string | null): void {
  try {
    const key = getNamespacedKey(RUNS_STORAGE_KEY, userId)
    localStorage.setItem(key, JSON.stringify(runs.slice(-50)))
  } catch {
    // ignore quota errors
  }
}

