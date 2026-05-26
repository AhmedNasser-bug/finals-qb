import { cn } from "@/lib/utils"
import type { FullSubjectData } from "@/lib/mold-types"
import type { ValidationResult } from "@/lib/subject-persistence"
import type { DragEvent, ChangeEvent } from "react"

export function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono rounded border border-border bg-background px-2.5 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-semibold">{value}</span>
    </div>
  )
}

export function CloseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

interface ImporterHeaderProps {
  onCancel: () => void;
}

export function ImporterHeader({ onCancel }: ImporterHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background">
      <div>
        <h2 className="text-sm font-mono font-semibold tracking-widest uppercase text-foreground">
          Import Subject
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Paste JSON or drop a .json file below
        </p>
      </div>
      <button
        onClick={onCancel}
        className="w-8 h-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

interface AIPromptSectionProps {
  promptCopied: boolean;
  onCopyPrompt: () => void;
}

export function AIPromptSection({ promptCopied, onCopyPrompt }: AIPromptSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          Step 1 — Generate with AI
        </p>
        <button
          onClick={onCopyPrompt}
          title="Copy the AI prompt to your clipboard"
          className={cn(
            "text-xs font-mono px-3 py-1.5 rounded border transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            promptCopied
              ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
          )}
        >
          <span aria-live="polite">
            {promptCopied ? "Copied" : "Copy Prompt"}
          </span>
        </button>
      </div>
      <div className="rounded border border-border bg-background p-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Copy the prompt above and paste it into any AI assistant (ChatGPT, Claude, Gemini).
          Replace <span className="font-mono text-primary">[YOUR TOPIC HERE]</span> with your
          subject. Paste the returned JSON below.
        </p>
      </div>
    </div>
  )
}

interface PasteDropZoneProps {
  state: "idle" | "validating" | "valid" | "error" | "pasting";
  json: string;
  isDragging: boolean;
  onPaste: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function PasteDropZone({
  state,
  json,
  isDragging,
  onPaste,
  onDragOver,
  onDragLeave,
  onDrop,
  onChange,
}: PasteDropZoneProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          Step 2 — Paste JSON
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onPaste}
            disabled={state === "pasting"}
            aria-disabled={state === "pasting"}
            title={state === "pasting" ? "Currently pasting data..." : "Paste JSON from clipboard"}
            aria-busy={state === "pasting"}
            className={cn(
              "text-xs font-mono px-3 py-1.5 rounded border font-semibold tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              state === "pasting"
                ? "border-primary/50 bg-primary/10 text-primary opacity-60 cursor-wait"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {state === "pasting" ? "..." : "Paste"}
          </button>
        </div>
      </div>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative rounded border p-4 min-h-[120px] transition-colors flex flex-col items-center justify-center",
          isDragging
            ? "border-primary/60 bg-primary/5"
            : state === "valid"
            ? "border-emerald-400/40 bg-emerald-400/5"
            : state === "error"
            ? "border-destructive/40 bg-destructive/5"
            : "border-border bg-background"
        )}
      >
        {json ? (
          <textarea
            value={json}
            aria-label="Paste JSON subject data here"
            aria-invalid={state === "error"}
            onChange={onChange}
            placeholder="JSON pasted here..."
            spellCheck={false}
            className="w-full bg-transparent font-mono text-xs p-0 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 resize-none h-48"
          />
        ) : (
          <div className="text-center pointer-events-none">
            <p className="text-sm text-muted-foreground mb-2">Drop a .json file here or use the Paste button</p>
            <p className="text-xs text-muted-foreground/60">Then confirm below</p>
          </div>
        )}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded border-2 border-dashed border-primary/60 bg-primary/5 pointer-events-none">
            <span className="text-sm font-mono text-primary">Drop .json file</span>
          </div>
        )}
      </div>
    </div>
  )
}

interface ValidationFeedbackProps {
  state: "idle" | "validating" | "valid" | "error" | "pasting";
  result: ValidationResult | null;
}

export function ValidationFeedback({ state, result }: ValidationFeedbackProps) {
  const preview = result?.valid ? result.subject : null
  const questionCount = preview?.questions.length ?? 0
  const flashcardCount = preview?.flashcards?.length ?? 0
  const categories = preview
    ? Array.from(new Set(preview.questions.map((q) => q.category)))
    : []

  return (
    <div aria-live="polite">
      {state === "error" && result && (
        <div className="flex flex-col gap-2 rounded border border-destructive/30 bg-destructive/5 p-3 animate-slide-up">
          <p className="text-xs font-mono font-semibold text-destructive tracking-wide uppercase">
            Validation Failed — {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}
          </p>
          <ul className="flex flex-col gap-1">
            {result.errors.map((err, i) => (
              <li key={i} className="text-xs text-destructive/80 leading-relaxed flex gap-2">
                <span className="font-mono shrink-0 text-destructive/50">{i + 1}.</span>
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result?.warnings && result.warnings.length > 0 && (
        <div className="flex flex-col gap-1 rounded border border-amber-400/30 bg-amber-400/5 p-3">
          <p className="text-xs font-mono font-semibold text-amber-400 tracking-wide uppercase">
            {result.warnings.length} Warning{result.warnings.length !== 1 ? "s" : ""}
          </p>
          {result.warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-400/70 leading-relaxed">{w}</p>
          ))}
        </div>
      )}

      {/* Preview card */}
      {state === "valid" && preview && (
        <div className="flex flex-col gap-3 rounded border border-emerald-400/30 bg-emerald-400/5 p-4 animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-1">
                Valid — Ready to import
              </p>
              <p className="text-base font-semibold text-foreground">{preview.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{preview.config.description}</p>
            </div>
            <span className="shrink-0 font-mono text-xs px-2 py-1 rounded border border-emerald-400/40 text-emerald-400 bg-emerald-400/10">
              {preview.id}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatChip label="Questions" value={questionCount} />
            <StatChip label="Flashcards" value={flashcardCount} />
            <StatChip label="Categories" value={categories.length} />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-border text-muted-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface ImporterFooterProps {
  state: "idle" | "validating" | "valid" | "error" | "pasting";
  onCancel: () => void;
  onConfirm: () => void;
}

export function ImporterFooter({ state, onCancel, onConfirm }: ImporterFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border bg-background">
      <button
        onClick={onCancel}
        aria-label="Cancel import"
        className="text-xs font-mono px-4 py-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={state !== "valid"}
        aria-disabled={state !== "valid"}
        title={state !== "valid" ? "Subject data must be valid to import" : undefined}
        className={cn(
          "text-xs font-mono px-5 py-2 rounded border font-semibold tracking-widest uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          state === "valid"
            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            : "border-border text-muted-foreground cursor-not-allowed opacity-40"
        )}
      >
        Add Subject
      </button>
    </div>
  )
}
