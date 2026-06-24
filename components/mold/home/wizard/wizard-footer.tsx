import React from "react"
import { cn } from "@/lib/utils"

export interface WizardFooterProps {
  step: number
  isNextDisabled: boolean
  onCancel: () => void
  onBack: () => void
  onNext: () => void
  onConfirm: () => void
}

export function WizardFooter({
  step,
  isNextDisabled,
  onCancel,
  onBack,
  onNext,
  onConfirm,
}: WizardFooterProps) {
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
          onClick={onNext}
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
          onClick={onConfirm}
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
