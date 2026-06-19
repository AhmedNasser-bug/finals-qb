import React from "react"
import { Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface WizardHeaderProps {
  step: number
  steps: { num: number; label: string }[]
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
          Step {step} of 5 — {steps[step - 1]?.label || ""}
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

export interface WizardBreadcrumbsProps {
  step: number
  steps: { num: number; label: string }[]
}

export function WizardBreadcrumbs({ step, steps }: WizardBreadcrumbsProps) {
  return (
    <div className="px-8 py-4 border-b border-border/50 bg-[#0d0e11] flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4 w-full justify-between sm:justify-start">
        {steps.map((s, idx) => {
          const isActive = step === s.num
          const isPast = step > s.num
          return (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-colors",
                  isActive
                    ? "border-primary bg-primary text-black border-glow"
                    : isPast
                    ? "border-zinc-500 bg-zinc-800 text-zinc-200"
                    : "border-border text-zinc-600 bg-transparent"
                )}>
                  {s.num}
                </span>
                <span className={cn(
                  "text-[9px] font-mono uppercase hidden md:inline-block tracking-wider",
                  isActive
                    ? "text-white font-bold"
                    : isPast
                    ? "text-zinc-400 font-semibold"
                    : "text-zinc-600 font-medium"
                )}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <span className={cn(
                  "text-[10px] font-mono select-none hidden md:inline-block",
                  isPast ? "text-zinc-500" : "text-zinc-800"
                )}>➔</span>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export interface WizardFooterProps {
  step: number
  onCancel: () => void
  onBack: () => void
  onContinue: () => void
  onMerge: () => void
  isNextDisabled: boolean
}

export function WizardFooter({ step, onCancel, onBack, onContinue, onMerge, isNextDisabled }: WizardFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-8 py-5 border-t border-border bg-panel">
      {step === 1 ? (
        <button
          onClick={onCancel}
          className="text-xs font-mono px-5 py-2.5 rounded border border-border text-[#a4acba] hover:text-white hover:border-zinc-500 transition-colors focus-visible:outline-none min-h-[40px] cursor-pointer"
        >
          Cancel
        </button>
      ) : (
        <button
          onClick={onBack}
          className="text-xs font-mono px-5 py-2.5 rounded border border-border text-[#a4acba] hover:text-white hover:border-zinc-500 transition-colors focus-visible:outline-none min-h-[40px] cursor-pointer"
        >
          ← BACK
        </button>
      )}

      {step < 5 ? (
        <button
          onClick={onContinue}
          disabled={isNextDisabled}
          className={cn(
            "text-xs font-mono px-6 py-2.5 border font-bold tracking-widest uppercase transition-all focus-visible:outline-none min-h-[40px] cursor-pointer rounded-none",
            isNextDisabled
              ? "border-border text-zinc-600 cursor-not-allowed opacity-40 bg-transparent"
              : "border-primary bg-primary text-black hover:bg-primary/90 border-glow"
          )}
        >
          CONTINUE →
        </button>
      ) : (
        <button
          onClick={onMerge}
          disabled={isNextDisabled}
          className={cn(
            "text-xs font-mono px-6 py-2.5 border font-bold tracking-widest uppercase transition-all focus-visible:outline-none min-h-[40px] cursor-pointer rounded-none",
            isNextDisabled
              ? "border-border text-zinc-600 cursor-not-allowed opacity-40 bg-transparent"
              : "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 border-glow-success"
          )}
        >
          MERGE & SAVE
        </button>
      )}
    </div>
  )
}
