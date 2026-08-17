import React from "react"
import { cn } from "@/lib/utils"

export interface WizardStepTwoProps {
  styleBias: "theoretical" | "technical" | "balanced"
  setStyleBias: (bias: "theoretical" | "technical" | "balanced") => void
}

export function WizardStepTwo({ styleBias, setStyleBias }: WizardStepTwoProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
          STEP 02 // STYLE_PROFILE_BIAS
        </span>
        <h3 className="text-lg font-bold font-mono text-white tracking-tight">
          Calibrate Pedagogical Output Bias
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Select the structural flavor of the questions. Technical profiles generate code elements, trace data, and visual state diagrams, while theoretical sets focus on core logic and terms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Theoretical */}
        <button
          type="button"
          onClick={() => setStyleBias("theoretical")}
          className={cn(
            "p-6 border text-left flex flex-col justify-between gap-4 transition-all duration-150 cursor-pointer rounded-none min-h-[170px]",
            styleBias === "theoretical"
              ? "border-[#4ae176] bg-[#4ae176]/5 border-glow-success"
              : "border-border bg-[#101115] text-zinc-400 hover:text-white"
          )}
        >
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">BIAS: THEORETICAL</span>
            <h4 className={cn("text-sm font-bold font-mono tracking-tight", styleBias === "theoretical" ? "text-[#4ae176]" : "text-white")}>
              Theoretical & Conceptual
            </h4>
            <p className="text-[11px] text-zinc-400 leading-normal font-sans">
              Ideal for definitions, logical relationships, historical context, and explaining "how" and "why" through explanatory prose.
            </p>
          </div>
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold block border-t border-border/30 pt-2 text-[#4ae176]">
            {styleBias === "theoretical" ? "✓ SELECTED" : "SELECT"}
          </span>
        </button>

        {/* Technical */}
        <button
          type="button"
          onClick={() => setStyleBias("technical")}
          className={cn(
            "p-6 border text-left flex flex-col justify-between gap-4 transition-all duration-150 cursor-pointer rounded-none min-h-[170px]",
            styleBias === "technical"
              ? "border-primary bg-primary/5 border-glow"
              : "border-border bg-[#101115] text-zinc-400 hover:text-white"
          )}
        >
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">BIAS: ANALYTICAL_CODE</span>
            <h4 className={cn("text-sm font-bold font-mono tracking-tight", styleBias === "technical" ? "text-primary" : "text-white")}>
              Technical & Applied Code
            </h4>
            <p className="text-[11px] text-zinc-400 leading-normal font-sans">
              Instructs the AI to embed programming syntax, HTML trace tables, calculations, and Mermaid flowcharts or sequence diagrams.
            </p>
          </div>
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold block border-t border-border/30 pt-2 text-primary">
            {styleBias === "technical" ? "✓ SELECTED" : "SELECT"}
          </span>
        </button>

        {/* Balanced */}
        <button
          type="button"
          onClick={() => setStyleBias("balanced")}
          className={cn(
            "p-6 border text-left flex flex-col justify-between gap-4 transition-all duration-150 cursor-pointer rounded-none min-h-[170px]",
            styleBias === "balanced"
              ? "border-primary bg-primary/5 border-glow"
              : "border-border bg-[#101115] text-zinc-400 hover:text-white"
          )}
        >
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">BIAS: BALANCED_MIX</span>
            <h4 className={cn("text-sm font-bold font-mono tracking-tight", styleBias === "balanced" ? "text-primary" : "text-white")}>
              Balanced Distribution
            </h4>
            <p className="text-[11px] text-zinc-400 leading-normal font-sans">
              A uniform mixture of algorithmic application, code blocks, visual flowcharts, and theoretical/prose concepts.
            </p>
          </div>
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold block border-t border-border/30 pt-2 text-primary">
            {styleBias === "balanced" ? "✓ SELECTED" : "SELECT"}
          </span>
        </button>
      </div>
    </div>
  )
}
