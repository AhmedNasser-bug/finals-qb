import React from "react"
import { cn } from "@/lib/utils"
import { formatLabel } from "@/lib/mold-types"
import type { WizardStepProps } from "./types"

interface Step5Props extends WizardStepProps {
  handleJsonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function Step5PasteMerge({
  jsonInput,
  validationState,
  validationResult,
  parsedPreview,
  handleJsonChange
}: Step5Props) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
          STEP 05 // PASTE_AND_MERGE_DATA
        </span>
        <h3 className="text-lg font-bold font-mono text-white tracking-tight">
          Paste & Validate AI Output
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Paste the generated JSON block here. We will validate it, automatically repair syntax/escape flaws, and preview the parsed questions and flashcards before merging.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="ai-json-input" className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
          Paste AI Generated JSON
        </label>
        <textarea
          id="ai-json-input"
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder="Paste your JSON here (e.g. { 'questions': [ ... ] })"
          className={cn(
            "w-full bg-[#07080a] border px-4 py-3 font-mono text-xs text-zinc-300 placeholder:text-zinc-700 focus-visible:outline-none transition-all min-h-[160px] resize-y",
            validationState === "valid" ? "border-emerald-500/50 focus-visible:ring-1 focus-visible:ring-emerald-500" :
            validationState === "error" ? "border-red-500/50 focus-visible:ring-1 focus-visible:ring-red-500" : "border-border focus-visible:ring-1 focus-visible:ring-primary"
          )}
        />
      </div>

      {/* Validation FeedbackHUD */}
      {validationState !== "idle" && (
        <div className="border border-border bg-[#101115] p-5 rounded space-y-4">
          <div className="flex items-center gap-3">
            <span className={cn(
              "w-2.5 h-2.5 rounded-full shrink-0",
              validationState === "validating" ? "bg-primary animate-pulse" :
              validationState === "valid" ? "bg-emerald-500" : "bg-red-500"
            )} />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {validationState === "validating" ? "Validating data..." :
               validationState === "valid" ? "Data Completely Validated" : "Validation Errors Detected"}
            </span>
          </div>

          {validationResult && (
            <div className="text-xs font-sans space-y-2 leading-relaxed">
              {/* Errors list */}
              {validationResult.errors.length > 0 && (
                <div className="text-red-400 font-mono text-[11px] space-y-1 bg-red-950/20 border border-red-500/10 p-3">
                  <p className="font-bold uppercase mb-1">Errors ({validationResult.errors.length}):</p>
                  {validationResult.errors.map((err, idx) => (
                    <p key={idx}>• {err}</p>
                  ))}
                </div>
              )}

              {/* Warnings list */}
              {validationResult.warnings.length > 0 && (
                <div className="text-amber-400 font-mono text-[11px] space-y-1 bg-amber-950/20 border border-amber-500/10 p-3">
                  <p className="font-bold uppercase mb-1">Auto-Fix Warnings ({validationResult.warnings.length}):</p>
                  {validationResult.warnings.map((warn, idx) => (
                    <p key={idx}>• {warn}</p>
                  ))}
                </div>
              )}

              {/* Successful preview stats */}
              {validationState === "valid" && parsedPreview && (
                <div className="grid grid-cols-3 gap-4 bg-zinc-950/50 p-4 border border-zinc-900 text-zinc-300 font-mono text-[11px]">
                  <div>
                    <span className="text-zinc-500 block uppercase">Parsed Questions:</span>
                    <span className="text-lg font-bold text-white">
                      {parsedPreview.questions.filter(q => q.id !== "q-default-1").length}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase">Parsed Flashcards:</span>
                    <span className="text-lg font-bold text-white">
                      {parsedPreview.flashcards?.length ?? 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase">Target Categories:</span>
                    <span className="text-xs font-bold text-white truncate block">
                      {Array.from(new Set(parsedPreview.questions.filter(q => q.id !== "q-default-1").map(q => q.category))).map(cat => formatLabel(cat)).join(", ") || "—"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
