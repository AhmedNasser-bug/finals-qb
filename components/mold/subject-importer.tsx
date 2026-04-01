"use client"

import { useState, useRef, useCallback, type DragEvent } from "react"
import { cn } from "@/lib/utils"
import { parseSubjectJson, validateSubjectData, type ValidationResult } from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"

// ─── AI prompt the user can copy to generate a valid JSON ─────────────────────
const AI_PROMPT = `You are a curriculum designer. Generate a complete MOLD V2 subject dataset for: [YOUR TOPIC HERE]

Return ONLY a single raw JSON object. No markdown, no code fences, no explanation — just the JSON.

The JSON structure:
{
  "id": "kebab-case-id",
  "name": "Human Readable Name",
  "config": {
    "title": "Subject Title",
    "description": "One sentence summary.",
    "version": "1.0"
  },
  "questions": [
    {
      "id": "q1",
      "type": "MCQ" or "TrueFalse",
      "difficulty": "Easy" or "Medium" or "Hard",
      "category": "category-slug",
      "question": "The question text?",
      "options": [
        { "label": "A", "text": "Option A" },
        { "label": "B", "text": "Option B" },
        { "label": "C", "text": "Option C" },
        { "label": "D", "text": "Option D" }
      ],
      "answer": "A",
      "explanation": "Why A is correct.",
      "hint": "A brief nudge without the answer."
    }
  ],
  "flashcards": [
    {
      "id": "f1",
      "term": "Key Concept",
      "definition": "Clear, concise definition (1-2 sentences).",
      "category": "category-slug"
    }
  ],
  "terminology": {
    "category-slug": [
      { "term": "Term", "definition": "Definition of the term." }
    ]
  },
  "achievements": [
    {
      "id": "achievement-id",
      "title": "Achievement Title",
      "description": "How to unlock this achievement.",
      "icon": "Zap",
      "condition": { "type": "runs_gte", "value": 5 }
    }
  ]
}

REQUIREMENTS:
- MINIMUM 100 questions (Easy: 30+, Medium: 40+, Hard: 30+)
- MCQ questions: exactly 4 options (A, B, C, D)
- TrueFalse questions: exactly 2 options (A=True, B=False)
- Include at least 15 TrueFalse questions
- MINIMUM 40 flashcards (at least 6 per category)
- MINIMUM 10 achievements (last one must have "all_unlocked" condition)
- Spread questions across 4-6 distinct categories
- All ids must be unique and kebab-case
- No duplicate question text
- Every category slug used in questions must exist in terminology
- All questions MUST have both explanation and hint fields populated

ACHIEVEMENT CONDITION TYPES:
- "runs_gte": { "type": "runs_gte", "value": N } — Complete N runs
- "accuracy_gte": { "type": "accuracy_gte", "value": 85 } — Score 85%+ accuracy
- "streak_gte": { "type": "streak_gte", "value": 15 } — 15-question streak
- "mode_complete": { "type": "mode_complete", "mode": "speedrun" } — Complete this mode
- "speedrun_under": { "type": "speedrun_under", "mode": "speedrun", "seconds": 300 } — Under time limit
- "no_hints": { "type": "no_hints", "mode": "hardcore" } — Mode without hints
- "all_categories": { "type": "all_categories" } — Practice every category
- "all_unlocked": { "type": "all_unlocked" } — Unlock all other achievements

CRITICAL — OUTPUT COMPACTNESS:
The JSON output will be encoded into shareable URLs. To maximize shareability, generate the JSON with:
- NO extra whitespace or indentation — output single-line, no spaces between tokens
- NO unnecessary fields or null values
- Short but descriptive strings (concise terminology definitions, brief hints)
- This will significantly reduce URL length for offline sharing

Output the complete JSON object on a single line (no formatting).`

// ─── Types ────────────────────────────────────────────────────────────────────

type ImporterState = "idle" | "validating" | "valid" | "error" | "pasting"

interface SubjectImporterProps {
  onImport: (subject: FullSubjectData) => void
  onCancel: () => void
  existingIds?: string[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SubjectImporter({ onImport, onCancel, existingIds = [] }: SubjectImporterProps) {
  const [json, setJson] = useState("")
  const [state, setState] = useState<ImporterState>("idle")
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)

  // ── Paste from clipboard ───────────────────────────────────────────────
  async function handlePaste() {
    setState("pasting")
    try {
      const text = await navigator.clipboard.readText()
      setJson(text)
      validate(text)
    } catch {
      setResult({ valid: false, errors: ["Failed to read clipboard. Try pasting manually."], warnings: [] })
      setState("error")
    }
  }

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = useCallback((raw: string) => {
    if (!raw.trim()) {
      setState("idle")
      setResult(null)
      return
    }
    setState("validating")
    // Use rAF so the "validating" state actually renders before the (sync) work
    requestAnimationFrame(() => {
      const parsed = parseSubjectJson(raw)
      if (parsed.parseError) {
        setResult({ valid: false, errors: [parsed.parseError], warnings: [] })
        setState("error")
        return
      }
      const validation = validateSubjectData(parsed.data)

      // Duplicate id check
      if (validation.valid && validation.subject && existingIds.includes(validation.subject.id)) {
        validation.warnings.push(
          `A subject with id "${validation.subject.id}" already exists — importing will replace it.`
        )
      }

      setResult(validation)
      setState(validation.valid ? "valid" : "error")
    })
  }, [existingIds])

  function handleChange(value: string) {
    setJson(value)
    validate(value)
  }

  // ── Drag and drop ───────────────────────────────────────────────────────
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }
  function handleDragLeave() { setIsDragging(false) }
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (!file.name.endsWith(".json")) {
      setResult({ valid: false, errors: ["Only .json files are accepted."], warnings: [] })
      setState("error")
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) ?? ""
      setJson(text)
      validate(text)
    }
    reader.readAsText(file)
  }

  // ── Copy AI prompt ──────────────────────────────────────────────────────
  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(AI_PROMPT)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2500)
    } catch {
      // fallback: select the text
      // textareaRef.current?.focus()
    }
  }

  function handleConfirm() {
    if (result?.valid && result.subject) {
      onImport(result.subject)
    }
  }

  // ── Preview card (shown when valid) ────────────────────────────────────
  const preview = result?.valid ? result.subject : null
  const questionCount = preview?.questions.length ?? 0
  const flashcardCount = preview?.flashcards?.length ?? 0
  const categories = preview
    ? Array.from(new Set(preview.questions.map((q) => q.category)))
    : []

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl h-[95vh] flex flex-col gap-0 border border-border bg-panel rounded overflow-hidden">

        {/* Header */}
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

        <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1 min-h-0">

          {/* AI Prompt section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                Step 1 — Generate with AI
              </p>
              <button
                onClick={handleCopyPrompt}
                className={cn(
                  "text-xs font-mono px-3 py-1.5 rounded border transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  promptCopied
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                {promptCopied ? "Copied" : "Copy Prompt"}
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

          {/* Drop zone */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                Step 2 — Paste JSON
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  disabled={state === "pasting"}
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
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
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
                  onChange={(e) => { setJson(e.target.value); validate(e.target.value) }}
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

          {/* Validation feedback */}
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

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border bg-background">
          <button
            onClick={onCancel}
            className="text-xs font-mono px-4 py-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={state !== "valid"}
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
      </div>
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono rounded border border-border bg-background px-2.5 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-semibold">{value}</span>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
