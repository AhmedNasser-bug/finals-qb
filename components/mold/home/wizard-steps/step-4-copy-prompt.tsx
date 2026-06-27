import React from "react"
import { cn } from "@/lib/utils"
import { Copy, Check, FileText, Info } from "lucide-react"

interface Step4CopyPromptProps {
  compiledPrompt: string
  promptCopied: boolean
  handleCopyPrompt: () => void
}

export function Step4CopyPrompt({
  compiledPrompt,
  promptCopied,
  handleCopyPrompt,
}: Step4CopyPromptProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
          STEP 04 // PROMPT_GENERATION
        </span>
        <h3 className="text-lg font-bold font-mono text-white tracking-tight">
          Generate & Copy Socratic AI Prompt
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Below is the dynamically constructed prompt guiding the AI to output valid, structured questions that match your choices. Copy this prompt and paste it into Gemini, Claude, or ChatGPT.
        </p>
      </div>

      <div className="border border-border rounded bg-[#101115] overflow-hidden">
        <div className="p-4 bg-black/40 border-b border-border flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>SYSTEM PROMPT INSTRUCTION BUNDLE</span>
          </span>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className={cn(
              "text-xs font-mono px-4 py-1.5 border transition-all duration-150 cursor-pointer flex items-center gap-1.5",
              promptCopied
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-primary bg-primary/5 text-primary hover:bg-primary/10"
            )}
          >
            {promptCopied ? (
              <>
                <Check className="w-3 h-3" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>COPY PROMPT</span>
              </>
            )}
          </button>
        </div>
        <textarea
          readOnly
          value={compiledPrompt}
          aria-label="Compiled AI Prompt"
          className="w-full bg-[#07080a] border-0 font-mono text-[11px] leading-relaxed p-4 text-zinc-400 focus:outline-none resize-none h-64 cursor-default"
        />
      </div>

      <div className="p-4 border border-primary/20 bg-primary/5 rounded-none flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed font-sans text-zinc-300">
          <span className="font-bold text-white uppercase block">Next Steps:</span>
          <ol className="list-decimal list-inside space-y-1 mt-1 text-zinc-400">
            <li>Copy the prompt above.</li>
            <li>Paste it into your favorite LLM (Claude-3.5-Sonnet or Gemini-1.5-Pro recommended).</li>
            <li>Wait for the LLM to output the raw JSON block.</li>
            <li>Copy the JSON and click <b>CONTINUE</b> to paste and merge.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
