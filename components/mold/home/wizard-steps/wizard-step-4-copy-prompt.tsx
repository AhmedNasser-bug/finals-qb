import React from "react"
import { Copy, Check, Info, FileText } from "lucide-react"

interface Props {
  compiledPrompt: string
  promptCopied: boolean
  onCopyPrompt: () => void
}

export function WizardStep4CopyPrompt({
  compiledPrompt,
  promptCopied,
  onCopyPrompt,
}: Props) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1 flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
            STEP 04 // PROMPT_COMPILATION
          </span>
          <h3 className="text-lg font-bold font-mono text-white tracking-tight">
            Copy Compiled AI Prompt
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            We have compiled a strict, context-aware prompt based on your current subject data and selected parameters.
          </p>
        </div>
      </div>

      <div className="border border-border/60 bg-[#101115] relative group">
        <div className="flex items-center justify-between p-3 border-b border-border/50 bg-[#0a0b0d]">
          <div className="flex items-center gap-2 text-zinc-500">
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">System Prompt</span>
          </div>
          <button type="button"
            onClick={onCopyPrompt}
            className="flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary transition-all rounded-none cursor-pointer focus-ring"
          >
            {promptCopied ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-[10px] font-mono font-bold uppercase">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-[10px] font-mono font-bold uppercase">Copy to Clipboard</span>
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
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
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
