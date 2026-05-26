"use client"

import { useState, useCallback, useMemo, DragEvent } from "react"
import { cn } from "@/lib/utils"
import { validateSubjectData, parseSubjectJson, type ValidationResult } from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"
import {
  ImporterHeader,
  AIPromptSection,
  PasteDropZone,
  ValidationFeedback,
  ImporterFooter,
} from "./subject-importer-components"

// ─── Static AI Prompt ─────────────────────────────────────────────────────────

const AI_PROMPT = `You are an expert curriculum designer and JSON data engineer.
Your task is to generate a comprehensive study module (flashcards and questions) to test knowledge and deepen metacognition.
Theme: [YOUR TOPIC HERE]
Structure: Generate ONLY a single raw JSON object. No markdown, no code fences, no explanation — just the JSON.

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
      "question": "The question text (HTML supported — see FORMATTING RULES below).",
      "diagram": "Optional. Raw Mermaid diagram source code string (see DIAGRAM RULES below). Omit field entirely if no diagram.",
      "diagramPosition": "right",
      "options": [
        { "label": "A", "text": "Option A" },
        { "label": "B", "text": "Option B" },
        { "label": "C", "text": "Option C" },
        { "label": "D", "text": "Option D" }
      ],
      "answer": "A",
      "explanation": "Why A is correct. Deepen metacognition by explaining the 'how' and 'why', surfacing common misconceptions if applicable.",
      "hint": "A guiding nudge. Stimulate curiosity and manage cognitive load by breaking down complexity without giving away the answer directly."
    }
  ],
  "flashcards": [
    {
      "id": "f1",
      "term": "Key Concept",
      "definition": "Clear, concise definition. Make sure the definition is digestible to manage cognitive load.",
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
- MCQ questions: exactly 4 options (A, B, C, D)
- TrueFalse questions: exactly 2 options (A=True, B=False)
- Include a substantial amount of questions, flashcards, and achievements to provide thorough practice.
- Ensure varying levels of difficulty (Easy, Medium, Hard).
- Include TrueFalse questions.
- Spread questions across distinct categories.
- All ids must be unique and kebab-case
- No duplicate question text
- Every category slug used in questions must exist in terminology
- All questions MUST have both explanation and hint fields populated. Explanations must adapt to the learner and deepen understanding.

FORMATTING RULES (question field):
- The "question" field supports HTML for rich text formatting.
- You MAY use inline styles (color, font-weight), <br>, <i>, <b>, <code>, <pre>, and HTML tables to format question text.
- DO NOT embed Mermaid diagrams inside the "question" field. Use the dedicated "diagram" field instead (see DIAGRAM RULES).
- Keep the "question" field focused on prose — it appears in the LEFT column of the split layout.

DIAGRAM RULES (diagram field — NEW ARCHITECTURE):
- To include a visual diagram with a question, add a "diagram" field containing raw Mermaid source code as a plain string.
- Supported diagram types: graph, flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, erDiagram, gantt, pie, gitGraph, mindmap, timeline.
- When "diagram" is present, the question card enters a two-column split layout:
    LEFT column (40%): question text + answer options
    RIGHT column (60%): the rendered diagram
- "diagramPosition" controls layout: "right" (default, side-by-side) or "below" (stacked under question text).
- The diagram string must be valid Mermaid syntax. Do not wrap it in code fences or quotes — write the raw syntax directly as the field value.
- Use \\n for line breaks within the diagram string value in JSON.
- SECURITY: Do not include <script>, javascript:, onerror=, onclick=, onload=, or data:text/html in diagram code.
- Strongly encouraged for topics involving: state machines, automata, flowcharts, decision trees, class hierarchies, sequence flows, network topologies, data structures, algorithms, circuit diagrams (use flowchart), timelines, and any concept better understood visually.

DIAGRAM EXAMPLE (stateDiagram):
"diagram": "stateDiagram-v2\\n    [*] --> q0\\n    q0 --> q1 : a\\n    q1 --> q2 : b\\n    q2 --> [*]"

DIAGRAM EXAMPLE (flowchart):
"diagram": "graph TD\\n    A[Start] --> B{Condition?}\\n    B -->|Yes| C[Do X]\\n    B -->|No| D[Do Y]\\n    C --> E[End]\\n    D --> E"

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
  // Convert existingIds array to a Set once to optimize O(1) lookups during validation,
  // avoiding O(N) Array.includes calls that scale poorly with large subject libraries.
  const existingIdsSet = useMemo(() => new Set(existingIds), [existingIds])

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
      if (validation.valid && validation.subject && existingIdsSet.has(validation.subject.id)) {
        validation.warnings.push(
          `A subject with id "${validation.subject.id}" already exists — importing will replace it.`
        )
      }

      setResult(validation)
      setState(validation.valid ? "valid" : "error")
    })
  }, [existingIdsSet])

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
      // fallback: ignore
    }
  }

  function handleConfirm() {
    if (result?.valid && result.subject) {
      onImport(result.subject)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl h-[95vh] flex flex-col gap-0 border border-border bg-panel rounded overflow-hidden">

        <ImporterHeader onCancel={onCancel} />

        <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1 min-h-0">
          <AIPromptSection promptCopied={promptCopied} onCopyPrompt={handleCopyPrompt} />

          <PasteDropZone
            state={state}
            json={json}
            isDragging={isDragging}
            onPaste={handlePaste}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onChange={(e) => { setJson(e.target.value); validate(e.target.value) }}
          />

          <ValidationFeedback state={state} result={result} />
        </div>

        <ImporterFooter state={state} onCancel={onCancel} onConfirm={handleConfirm} />
      </div>
    </div>
  )
}
