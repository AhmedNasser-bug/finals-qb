import type { CheatSheetQuestion } from "@/lib/mold-types"
import { getNamespacedKey } from "@/lib/user-storage"

export const CHEAT_SHEET_BASE_KEY = "mold_v2_cheatsheet"

export function getCheatSheetKey(subjectId: string, userId?: string | null): string {
  const baseKey = `${CHEAT_SHEET_BASE_KEY}_${subjectId}`
  return getNamespacedKey(baseKey, userId)
}

export function loadCheatSheet(subjectId: string, userId?: string | null): CheatSheetQuestion[] {
  if (typeof window === "undefined") return []
  try {
    const key = getCheatSheetKey(subjectId, userId)
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as CheatSheetQuestion[]
  } catch {
    return []
  }
}

export function saveCheatSheet(subjectId: string, entries: CheatSheetQuestion[], userId?: string | null): void {
  if (typeof window === "undefined") return
  try {
    const key = getCheatSheetKey(subjectId, userId)
    localStorage.setItem(key, JSON.stringify(entries))
  } catch {
    // ignore quota errors
  }
}

export function addToCheatSheet(
  subjectId: string,
  question: any,
  metadata: { gotWrong: boolean; hintUsed: boolean },
  userId?: string | null
): CheatSheetQuestion[] {
  const entries = loadCheatSheet(subjectId, userId)
  const existingIdx = entries.findIndex((e) => e.id === question.id)

  const newEntry: CheatSheetQuestion = {
    ...question,
    gotWrong: metadata.gotWrong || (existingIdx !== -1 ? entries[existingIdx].gotWrong : false),
    hintUsed: metadata.hintUsed || (existingIdx !== -1 ? entries[existingIdx].hintUsed : false),
    timestamp: Date.now(),
  }

  if (existingIdx !== -1) {
    entries[existingIdx] = newEntry
  } else {
    entries.push(newEntry)
  }

  // Cap at 100 entries to prevent localStorage bloat
  const trimmed = entries.slice(-100)
  saveCheatSheet(subjectId, trimmed, userId)
  return trimmed
}

export function clearCheatSheet(subjectId: string, userId?: string | null): void {
  if (typeof window === "undefined") return
  try {
    const key = getCheatSheetKey(subjectId, userId)
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
