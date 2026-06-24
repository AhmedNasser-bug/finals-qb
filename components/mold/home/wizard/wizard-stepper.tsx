import React from "react"
import { cn } from "@/lib/utils"

export interface WizardStepperProps {
  step: number
  steps: Array<{ num: number; label: string }>
}

export function WizardStepper({ step, steps }: WizardStepperProps) {
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
                  "w-4 h-px block",
                  isPast ? "bg-zinc-600" : "bg-zinc-800"
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
