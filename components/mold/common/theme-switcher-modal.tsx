'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useColorTheme } from '@/lib/themes/theme-context'
import { Palette, Check, X, Sun, Moon, Sparkles } from 'lucide-react'
import type { ThemeMode } from '@/lib/themes/theme-types'

interface ThemeSwitcherModalProps {
  onClose: () => void
}

type TabFilter = 'all' | 'dark' | 'light'

export function ThemeSwitcherModal({ onClose }: ThemeSwitcherModalProps) {
  const { activeThemeId, setThemeId, availableThemes } = useColorTheme()
  const modalRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<TabFilter>('all')

  const filteredThemes = useMemo(() => {
    if (filter === 'all') return availableThemes
    return availableThemes.filter((t) => t.mode === filter)
  }, [availableThemes, filter])

  const darkCount = useMemo(() => availableThemes.filter(t => t.mode === 'dark').length, [availableThemes])
  const lightCount = useMemo(() => availableThemes.filter(t => t.mode === 'light').length, [availableThemes])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if ((e.key === 'l' || e.key === 'L') && document.activeElement?.tagName !== 'INPUT') {
        setFilter('light')
      } else if ((e.key === 'd' || e.key === 'D') && document.activeElement?.tagName !== 'INPUT') {
        setFilter('dark')
      } else if ((e.key === 'a' || e.key === 'A') && document.activeElement?.tagName !== 'INPUT') {
        setFilter('all')
      } else if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-panel/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-primary/10 border border-primary/20 text-primary">
              <Palette className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="theme-modal-title"
                className="text-xs font-mono font-bold uppercase tracking-wider text-foreground"
              >
                Visual Theme Architecture
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                Switch between high-contrast terminal dark and daylight light themes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
            aria-label="Close theme selector"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Mode Filter Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-panel/30">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            ALL [{availableThemes.length}]
          </button>
          <button
            type="button"
            onClick={() => setFilter('dark')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
              filter === 'dark'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Moon className="w-3 h-3" aria-hidden="true" />
            DARK [{darkCount}]
          </button>
          <button
            type="button"
            onClick={() => setFilter('light')}
            className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
              filter === 'light'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Sun className="w-3 h-3" aria-hidden="true" />
            LIGHT [{lightCount}]
          </button>
          <span className="ml-auto text-[10px] font-mono text-muted-foreground hidden sm:inline">
            Shortcuts: [A] All • [D] Dark • [L] Light
          </span>
        </div>

        {/* Themes Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          {filteredThemes.map((theme) => {
            const isSelected = theme.id === activeThemeId
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                aria-pressed={isSelected}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-card/60 hover:bg-muted/40 hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Swatch Preview */}
                  <div
                    className="w-12 h-12 rounded border flex flex-col justify-between p-1.5 shadow-inner shrink-0"
                    style={{
                      backgroundColor: theme.preview.bg,
                      borderColor: theme.preview.border,
                    }}
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: theme.preview.accent }}
                      />
                      <div
                        className="w-2 h-2 rounded-full opacity-60"
                        style={{ backgroundColor: theme.preview.surface }}
                      />
                    </div>
                    <div
                      className="w-full h-1.5 rounded-sm"
                      style={{ backgroundColor: theme.preview.accent }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold tracking-wider text-foreground">
                        {theme.name}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                        theme.mode === 'light'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                          : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
                      }`}>
                        {theme.mode === 'light' ? <Sun className="w-2.5 h-2.5" /> : <Moon className="w-2.5 h-2.5" />}
                        {theme.mode.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                        {theme.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                      {theme.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-4">
                  {isSelected ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-primary-foreground text-[10px] font-mono font-bold">
                      <Check className="w-3 h-3" aria-hidden="true" />
                      ACTIVE
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      Apply →
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-panel/30 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>Active: {activeThemeId}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-border bg-card hover:bg-muted text-foreground text-[11px] font-mono font-bold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

