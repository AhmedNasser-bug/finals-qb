import React from "react"
import { Sparkles, X } from "lucide-react"

export interface WizardHeaderProps {
  step: number
  steps: Array<{ num: number; label: string }>
  onCancel: () => void
}

export function WizardHeader({ step, steps, onCancel }: WizardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-panel">
      <div>
        <h2 className="text-sm font-mono font-bold tracking-wider uppercase text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" aria-hidden="true" />
          <span>Add Questions to Subject Wizard</span>
        </h2>
        <p className="text-[10px] font-mono text-zinc-500 mt-0.5 tracking-wider uppercase">
          Step {step} of 5 — {steps[step - 1].label}
        </p>
      </div>
      <button
        onClick={onCancel}
        className="w-8 h-8 flex items-center justify-center border border-border text-[#a4acba] hover:text-white hover:border-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
        aria-label="Close wizard"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
