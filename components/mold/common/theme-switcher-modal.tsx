'use client'

import React, { useEffect, useRef } from 'react'
import { useColorTheme } from '@/lib/themes/theme-context'
import { Palette, Check, X } from 'lucide-react'

interface ThemeSwitcherModalProps {
  onClose: () => void
}

export function ThemeSwitcherModal({ onClose }: ThemeSwitcherModalProps) {
  const { activeThemeId, setThemeId, availableThemes } = useColorTheme()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && (document.activeElement === first || document.activeElement === modalRef.current)) {
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
        className="w-full max-w-xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
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
                Color Theme Selector
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                Select a visual phosphor palette for all interfaces
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

        {/* Themes Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          {availableThemes.map((theme) => {
            const isSelected = theme.id === activeThemeId
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                aria-pressed={isSelected}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card/60 hover:bg-muted/40 hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-4">
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

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold tracking-wider text-foreground">
                        {theme.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                        {theme.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-sm line-clamp-1">
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
