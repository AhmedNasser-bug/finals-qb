'use client'

import React, { useEffect, useRef } from 'react'
import { usePageLayout } from '@/lib/layouts/layout-context'
import { LayoutGrid, Check, X, PanelLeft, Minimize2, Columns, Sparkles } from 'lucide-react'

interface LayoutSwitcherModalProps {
  onClose: () => void
}

function getLayoutIcon(name: string) {
  switch (name) {
    case 'Sparkles':
      return <Sparkles className="w-5 h-5" aria-hidden="true" />
    case 'Minimize2':
      return <Minimize2 className="w-5 h-5" aria-hidden="true" />
    case 'Columns':
      return <Columns className="w-5 h-5" aria-hidden="true" />
    case 'Sidebar':
    default:
      return <PanelLeft className="w-5 h-5" aria-hidden="true" />
  }
}

export function LayoutSwitcherModal({ onClose }: LayoutSwitcherModalProps) {
  const { activeLayoutId, setLayoutId, availableLayouts } = usePageLayout()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
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
      aria-labelledby="layout-modal-title"
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
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="layout-modal-title"
                className="text-xs font-mono font-bold uppercase tracking-wider text-foreground"
              >
                Page Layout Architecture
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                Switch workspace ergonomics and structural presentation modes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
            aria-label="Close layout selector"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Layouts Grid */}
        <div className="p-6 overflow-y-auto space-y-3">
          {availableLayouts.map((layout) => {
            const isSelected = layout.id === activeLayoutId
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => setLayoutId(layout.id)}
                aria-pressed={isSelected}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card/60 hover:bg-muted/40 hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded border border-border bg-panel flex items-center justify-center text-primary shrink-0">
                    {getLayoutIcon(layout.iconName)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold tracking-wider text-foreground">
                        {layout.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                        {layout.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-sm line-clamp-1">
                      {layout.description}
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
                      Select →
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-panel/30 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>Active: {activeLayoutId}</span>
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
