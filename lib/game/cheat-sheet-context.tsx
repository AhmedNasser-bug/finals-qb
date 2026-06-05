"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { CheatSheetQuestion, Question } from "@/lib/mold-types"
import { useSafeAuth } from "@/lib/user-storage"
import { loadCheatSheet, addToCheatSheet, clearCheatSheet } from "./cheat-sheet-store"

interface CheatSheetContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleCheatSheet: () => void
  entries: CheatSheetQuestion[]
  addEntry: (q: Question, metadata: { gotWrong: boolean; hintUsed: boolean }) => void
  clearEntries: () => void
}

const CheatSheetContext = createContext<CheatSheetContextValue | null>(null)

export function useCheatSheet() {
  const ctx = useContext(CheatSheetContext)
  if (!ctx) {
    throw new Error("useCheatSheet must be used inside a <CheatSheetProvider>")
  }
  return ctx
}

interface CheatSheetProviderProps {
  subjectId: string
  children: React.ReactNode
}

export function CheatSheetProvider({ subjectId, children }: CheatSheetProviderProps) {
  const { userId } = useSafeAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [entries, setEntries] = useState<CheatSheetQuestion[]>([])

  // Load entries when subjectId or userId changes
  useEffect(() => {
    const loaded = loadCheatSheet(subjectId, userId)
    setEntries(loaded)
  }, [subjectId, userId])

  const toggleCheatSheet = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const addEntry = useCallback(
    (q: Question, metadata: { gotWrong: boolean; hintUsed: boolean }) => {
      setEntries((prev) => {
        return addToCheatSheet(subjectId, q, metadata, userId)
      })
    },
    [subjectId, userId]
  )

  const clearEntries = useCallback(() => {
    clearCheatSheet(subjectId, userId)
    setEntries([])
  }, [subjectId, userId])

  return (
    <CheatSheetContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleCheatSheet,
        entries,
        addEntry,
        clearEntries,
      }}
    >
      {children}
    </CheatSheetContext.Provider>
  )
}
