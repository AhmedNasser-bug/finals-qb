'use client'

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import type { ColorThemeSpec, ColorThemeTokens } from './theme-types'
import { COLOR_THEMES, DEFAULT_THEME_ID, getThemeById } from './theme-registry'

const STORAGE_KEY = 'mold_v2_color_theme'

interface ColorThemeContextValue {
  activeTheme: ColorThemeSpec
  activeThemeId: string
  setThemeId: (themeId: string) => void
  availableThemes: ColorThemeSpec[]
}

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null)

function applyThemeTokensToDom(tokens: ColorThemeTokens) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  root.style.setProperty('--background', tokens.background)
  root.style.setProperty('--foreground', tokens.foreground)
  root.style.setProperty('--card', tokens.card)
  root.style.setProperty('--card-foreground', tokens.cardForeground)
  root.style.setProperty('--popover', tokens.popover)
  root.style.setProperty('--popover-foreground', tokens.popoverForeground)
  root.style.setProperty('--primary', tokens.primary)
  root.style.setProperty('--primary-foreground', tokens.primaryForeground)
  root.style.setProperty('--secondary', tokens.secondary)
  root.style.setProperty('--secondary-foreground', tokens.secondaryForeground)
  root.style.setProperty('--muted', tokens.muted)
  root.style.setProperty('--muted-foreground', tokens.mutedForeground)
  root.style.setProperty('--accent', tokens.accent)
  root.style.setProperty('--accent-foreground', tokens.accentForeground)
  root.style.setProperty('--destructive', tokens.destructive)
  root.style.setProperty('--destructive-foreground', tokens.destructiveForeground)
  root.style.setProperty('--border', tokens.border)
  root.style.setProperty('--input', tokens.input)
  root.style.setProperty('--ring', tokens.ring)
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(DEFAULT_THEME_ID)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setThemeIdState(saved)
        const theme = getThemeById(saved)
        applyThemeTokensToDom(theme.tokens)
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, [])

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id)
    const theme = getThemeById(id)
    applyThemeTokensToDom(theme.tokens)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // Ignore localStorage write error
    }
  }, [])

  const activeTheme = useMemo(() => getThemeById(themeId), [themeId])

  const contextValue = useMemo<ColorThemeContextValue>(
    () => ({
      activeTheme,
      activeThemeId: themeId,
      setThemeId,
      availableThemes: COLOR_THEMES,
    }),
    [activeTheme, themeId, setThemeId]
  )

  return (
    <ColorThemeContext.Provider value={contextValue}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme(): ColorThemeContextValue {
  const ctx = useContext(ColorThemeContext)
  if (!ctx) {
    return {
      activeTheme: getThemeById(DEFAULT_THEME_ID),
      activeThemeId: DEFAULT_THEME_ID,
      setThemeId: () => {},
      availableThemes: COLOR_THEMES,
    }
  }
  return ctx
}
