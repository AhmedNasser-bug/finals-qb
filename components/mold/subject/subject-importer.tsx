"use client"

import React, { useState, useCallback, useMemo, type DragEvent } from "react"
import { cn } from "@/lib/utils"
import { parseSubjectJson, validateSubjectData, type ValidationResult } from "@/lib/subject-persistence"
import type { FullSubjectData } from "@/lib/mold-types"
import { CloseIcon } from "@/components/mold/subject/subject-importer-components"
import { PEDAGOGICAL_PRESETS } from "@/lib/prompt-builder"
import {
  Step1PresetTopic,
  Step2SubjectType,
  Step3QuestionCount,
  Step4PromptBuild,
  Step5LoadData,
} from "./subject-importer-steps"

// ─── Wizard Types ─────────────────────────────────────────────────────────────
export type ImporterState = "idle" | "validating" | "valid" | "error" | "pasting" | "importing"
export type SubjectTypeBias = "theoretical" | "technical"

interface SubjectImporterProps {
  onImport: (subject: FullSubjectData) => void
  onCancel: () => void
  existingIds?: string[]
}

export function SubjectImporter({ onImport, onCancel, existingIds = [] }: SubjectImporterProps) {
  const existingIdsSet = useMemo(() => new Set(existingIds), [existingIds])

  // ─── Wizard States ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<number>(1)
  const [topic, setTopic] = useState("")
  const [useReferenceBank, setUseReferenceBank] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState<string>("finals_prep")
  const [subjectType, setSubjectType] = useState<SubjectTypeBias>("technical")
  const [questionCount, setQuestionCount] = useState<number>(30)
  const [json, setJson] = useState("")
  const [state, setState] = useState<ImporterState>("idle")
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const [userMaterial, setUserMaterial] = useState("")
  const [convertedMaterial, setConvertedMaterial] = useState("")

  // ─── Auto-update question count when preset changes ──────────────────────────
  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId)
    const preset = PEDAGOGICAL_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setQuestionCount(preset.config.questionCount)
    } else if (presetId === "custom") {
      setQuestionCount(20) // Custom default
    }
  }

  // ─── Socratic preset justification builder ────────────────────────────────────
  const presetJustification = useMemo(() => {
    switch (selectedPreset) {
      case "finals_prep":
        return "30 questions is preset because it offers the optimal balance between scenario complexity, categorization sectors, and comprehensive final exam coverage."
      case "concept_journey":
        return "20 questions is pre-set because it manages your cognitive load while exploring all core theories through analogies."
      case "quick_drill":
        return "10 questions is optimal to enable rapid Socratic active recall drills without burning out your concentration."
      case "full_revision":
        return "120 questions is pre-configured to guarantee exhaustive, bulletproof coverage of your entire curriculum."
      default:
        return "Custom volume: choose any threshold from 1 to 500 questions based on your custom study rules."
    }
  }, [selectedPreset])

  // ─── Paste from clipboard ───────────────────────────────────────────────
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

  // ─── Validation ──────────────────────────────────────────────────────────
  const validate = useCallback((raw: string) => {
    if (!raw.trim()) {
      setState("idle")
      setResult(null)
      return
    }
    setState("validating")
    requestAnimationFrame(() => {
      const parsed = parseSubjectJson(raw)
      if (parsed.parseError) {
        setResult({ valid: false, errors: [parsed.parseError], warnings: [] })
        setState("error")
        return
      }
      const validation = validateSubjectData(parsed.data)

      // Inject auto-repair warnings
      if (parsed.fixedWarnings && parsed.fixedWarnings.length > 0) {
        validation.warnings.push(...parsed.fixedWarnings)
      }

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

  function handleChange(value: string) {
    setJson(value)
    validate(value)
  }

  // ─── Drag and drop ───────────────────────────────────────────────────────
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

  // ─── Copy AI prompt ──────────────────────────────────────────────────────
  async function handleCopyPrompt(promptText: string) {
    try {
      await navigator.clipboard.writeText(promptText)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2500)
    } catch {
      // ignore
    }
  }

  function handleConfirm() {
    if (result?.valid && result.subject) {
      onImport(result.subject)
    }
  }

  // ─── Build custom LearnLM Socratic Prompt Live ─────────────────────────────────
  const compiledPrompt = useMemo(() => {
    const presetConfig: { persona: string; scaffolding: string[]; formats: string[] } = selectedPreset === "finals_prep"
      ? { persona: "designer", scaffolding: ["metacognitive", "cognitive_load"], formats: ["html", "diagrams"] }
      : selectedPreset === "concept_journey"
      ? { persona: "explorer", scaffolding: ["socratic_nudge", "metacognitive"], formats: ["html", "diagrams"] }
      : selectedPreset === "quick_drill"
      ? { persona: "socratic", scaffolding: ["socratic_nudge", "cognitive_load"], formats: ["html", "diagrams"] }
      : selectedPreset === "full_revision"
      ? { persona: "designer", scaffolding: ["metacognitive", "cognitive_load"], formats: ["html", "diagrams"] }
      : { persona: "socratic", scaffolding: ["socratic_nudge"], formats: ["html", "diagrams"] }


    const personaText = presetConfig.persona === "designer"
      ? "You are a senior curriculum designer and academic assessment designer. Your tone is professional, precise, and highly analytical. You design standards-aligned question banks focused on testing critical thinking, conceptual application, and deep comprehension rather than simple rote memorization."
      : presetConfig.persona === "explorer"
      ? "You are a concept explorer and scientific communicator. Your tone is inspiring, accessible, and energetic. You specialize in demystifying abstract, complex theories using vivid, real-world analogies, practical scenarios, and relatable stories that bridge academic concepts with real-world applications."
      : "You are an Socratic tutor dedicated to building deep conceptual intuition. Your tone is warm, encouraging, supportive, and intensely curious. You never supply answers directly; instead, you scaffold learning by asking guided questions and helping students navigate their own productive struggles."

    const scaffoldingText = `PEDAGOGICAL STRATEGIES & SCAFFOLDING INSTRUCTIONS:
${presetConfig.scaffolding.includes("socratic_nudge") ? "- Socratic Guiding Nudges (Hints): For every question's \"hint\" field, formulate a gentle Socratic nudge. Break down the core complexity of the problem, but stop just short of revealing the solution. Ask a targeted, guiding question that directs the student's attention to the key underlying mechanism." : "- Question Hints: Provide a clear, supportive hint that simplifies the question without giving away the direct answer."}
${presetConfig.scaffolding.includes("metacognitive") ? "- Metacognitive Explanations: When writing question \"explanation\" fields, do not just state what the correct option is. Explicitly detail the logical reasoning process behind why it is correct and why the distractors are incorrect. Address common student misconceptions and prompt them to reflect on their own strategies." : "- Question Explanations: Explain why the correct option is the right choice clearly and directly."}
${presetConfig.scaffolding.includes("cognitive_load") ? "- Cognitive Load Management: Structure all text definitions, flashcards, and explanations to be highly digestible. Use concise bullet points, simple vocabulary, short sentences, and logical conceptual sequences to avoid overwhelming the learner." : ""}`

    const formatText = `FORMATTING & VISUAL LAYOUT GUIDELINES:
- HTML Rich Text: The "question" field supports HTML for rich text formatting. You are highly encouraged to use inline styles (color, font-weight), <br>, <i>, <b>, <code>, <pre>, and HTML tables to format question text and organize comparative data.
${presetConfig.formats.includes("diagrams") ? "- Mermaid Visual Diagrams: To include a visual diagram with a question, add a \"diagram\" field containing raw Mermaid source code as a plain string. Supported diagram types: graph, flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, erDiagram, gantt, pie, gitGraph, mindmap, timeline.\nWhen \"diagram\" is present, the question card enters a two-column split layout. The diagram string must be valid Mermaid syntax. Do not wrap it in code fences or quotes — write the raw syntax directly as the field value. Use \\n for line breaks within the diagram string value in JSON." : ""}`

    const biasText = subjectType === "technical"
      ? `TECHNICAL SUBJECT BIAS:\n- Prioritize generating rich, valid Mermaid diagrams (flowcharts, sequence diagrams, state machines, etc.) for at least 60% of the questions.\n- Embed code blocks (<code>, <pre>) and algorithmic data comparisons where helpful.\n- Terminology definitions should be precise, mathematical, and programmatic.`
      : `THEORETICAL SUBJECT BIAS:\n- Prioritize comprehensive conceptual terminology lists and deep prose explanations.\n- Focus diagrams on mindmaps, timeline graphs, or conceptual flowcharts (keep them clean and text-focused).\n- Questions should prioritize testing abstract relationships, historic or conceptual connections, and Socratic analysis.`;

    const topicSlug = (topic || "subject").toLowerCase().replace(/[^a-z0-9]+/g, "-")

    return `You are a pedagogical expert and curriculum designer. Using the PARTS framework (Persona, Act, Recipient, Theme, Structure), generate a complete Finalist subject dataset for: ${topic || "[YOUR TOPIC HERE]"}

${personaText}

Act: Design a comprehensive, inquiry-based dataset for learning.
Recipient: For learners who need high-quality practice and scaffolding to stimulate curiosity and deepen metacognition.
Theme: ${topic || "[YOUR TOPIC HERE]"}

Structure: Generate ONLY a single raw JSON object. No markdown, no code fences, no surrounding explanation — just the JSON.

The JSON structure MUST follow this exact schema:
{
  "id": "${topicSlug}",
  "name": "${topic || "[YOUR TOPIC HERE]"}",
  "config": {
    "title": "${topic || "[YOUR TOPIC HERE]"} Mastery",
    "description": "One sentence summary detailing the pedagogical goal of this subject.",
    "version": "1.0"
  },
  "questions": [
    {
      "id": "q1",
      "type": "MCQ" or "TrueFalse",
      "difficulty": "Easy" or "Medium" or "Hard",
      "category": "category-slug",
      "question": "The question text (HTML supported — see FORMATTING RULES).",
      "diagram": "Optional. Raw Mermaid diagram source code string (see DIAGRAM RULES). Omit field entirely if no diagram.",
      "diagramPosition": "right",
      "options": [
        { "label": "A", "text": "Option A" },
        { "label": "B", "text": "Option B" },
        { "label": "C", "text": "Option C" },
        { "label": "D", "text": "Option D" }
      ],
      "answer": "A",
      "explanation": "Why correct. (See pedagogical instructions below)",
      "hint": "A guiding nudge. (See pedagogical instructions below)"
    }
  ],
  "flashcards": [
    { "id": "f1", "term": "Key Concept", "definition": "Clear definition", "category": "category-slug" }
  ],
  "terminology": {
    "category-slug": [{ "term": "Term", "definition": "Definition" }]
  },
  "achievements": [
    { "id": "ach-1", "title": "Bronze Medal", "description": "Complete 1 run", "icon": "Zap", "condition": { "type": "runs_gte", "value": 1 } }
  ]
}

${scaffoldingText}

${formatText}

${biasText}

REFERENCE DOCUMENT CONSTRAINTS:
${useReferenceBank ? "If the user has attached, pasted, or uploaded an existing question bank, syllabus, course notes, reference textbook pages, or draft database file, you MUST strictly use its key concepts, terminology definitions, structure, difficulty grading, and formatting styles as your primary source of truth. Ensure all generated questions, flashcards, and achievements map perfectly to these source concepts while matching our requested JSON schema rules." : "Generate standard-aligned questions mapping key concepts of the topic."}

CRITICAL GENERAL REQUIREMENTS:
- Generate EXACTLY ${questionCount} unique, high-quality, comprehensive questions.
- MCQ questions: exactly 4 options (A, B, C, D)
- TrueFalse questions: exactly 2 options (A=True, B=False)
- Include a substantial amount of questions, flashcards, and achievements to provide thorough practice.
- Ensure varying levels of difficulty (Easy, Medium, Hard).
- Spread questions across distinct categories.
- All ids must be unique and kebab-case.
- No duplicate question text.
- Every category slug used in questions must exist in terminology.
- All questions MUST have both explanation and hint fields populated.

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
- Output the complete JSON object on a single line (no formatting).`;
  }, [topic, selectedPreset, subjectType, questionCount, useReferenceBank])

  // ─── Preview details ────────────────────────────────────────────────────────
  const preview = (result?.valid && result.subject) ? result.subject : null
  const validatedQuestionCount = preview?.questions.length ?? 0
  const validatedFlashcardCount = preview?.flashcards?.length ?? 0
  const validatedCategories = preview
    ? Array.from(new Set(preview.questions.map((q) => q.category)))
    : []

  // ─── Wizard breadcrumb steps ────────────────────────────────────────────────
  const steps = [
    { num: 1, label: "Preset" },
    { num: 2, label: "Bias" },
    { num: 3, label: "Volume" },
    { num: 4, label: "Prompt" },
    { num: 5, label: "Load" },
  ]

  // Disable "Next" state triggers based on step compliance

  const overlayRef = useRef<HTMLDivElement>(null)
  // Trap focus inside overlay
  useEffect(() => {
    const el = overlayRef.current
    if (el) el.focus()

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !el) return

      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleTab)
    return () => document.removeEventListener("keydown", handleTab)
  }, [])

  const isNextDisabled =
    (step === 1 && topic.trim() === "") ||
    (step === 5 && state !== "valid")

  return (
    <div ref={overlayRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="subject-importer-title" className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none outline-none">
      <div className="w-full max-w-6xl h-[92vh] flex flex-col gap-0 border border-border bg-background rounded-none overflow-hidden border-glow transition-all duration-300">

        {/* Modal Main Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-panel">
          <div>
            <h2 id="subject-importer-title" className="text-sm font-display font-bold tracking-wider uppercase text-foreground">
              Import Subject Wizard
            </h2>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5 tracking-wider uppercase">
              Step {step} of 5 — {steps[step - 1].label}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-border transition-colors focus-ring cursor-pointer"
            aria-label="Close wizard"
            title="Cancel and close import wizard"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Progress Breadcrumbs Bar */}
        <div className="px-8 py-4 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-5 w-full justify-between sm:justify-start">
            {steps.map((s, idx) => {
              const isActive = step === s.num
              const isPast = step > s.num
              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2 select-none">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center font-display text-[11px] font-bold border transition-colors",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground border-glow"
                        : isPast
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground/60 bg-transparent"
                    )}>
                      {s.num}
                    </span>
                    <span className={cn(
                      "text-[10px] font-display uppercase hidden md:inline-block tracking-wider",
                      isActive
                        ? "text-foreground font-bold"
                        : isPast
                        ? "text-foreground/80 font-semibold"
                        : "text-muted-foreground font-medium"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <span className={cn(
                      "text-xs font-sans select-none hidden md:inline-block",
                      isPast ? "text-primary/40" : "text-muted-foreground/30"
                    )}>➔</span>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Wizard Main Content Pane */}
        <div className="flex-1 px-8 py-6 sm:px-10 sm:py-7 overflow-y-auto min-h-0 bg-background">

          {/* STEP 1: Select Preset & Topic */}
          {step === 1 && (
            <Step1PresetTopic
              topic={topic}
              setTopic={setTopic}
              useReferenceBank={useReferenceBank}
              setUseReferenceBank={setUseReferenceBank}
              selectedPreset={selectedPreset}
              onPresetSelect={handlePresetSelect}
            />
          )}

          {/* STEP 2: Subject Type Bias */}
          {step === 2 && (
            <Step2SubjectType
              subjectType={subjectType}
              setSubjectType={setSubjectType}
            />
          )}

          {/* STEP 3: Configure Question count */}
          {step === 3 && (
            <Step3QuestionCount
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              presetJustification={presetJustification}
              onCustomPresetClick={(num) => {
                setQuestionCount(num)
                setSelectedPreset("custom")
              }}
            />
          )}

          {/* STEP 4: Generate pedagogical prompt */}
          {step === 4 && (
            <Step4PromptBuild
              topic={topic}
              compiledPrompt={compiledPrompt}
              promptCopied={promptCopied}
              onCopyPrompt={handleCopyPrompt}
              userMaterial={userMaterial}
              setUserMaterial={setUserMaterial}
              convertedMaterial={convertedMaterial}
              setConvertedMaterial={setConvertedMaterial}
            />
          )}

          {/* STEP 5: Drop & Load JSON subject data */}
          {step === 5 && (
            <Step5LoadData
              json={json}
              state={state}
              isDragging={isDragging}
              onPaste={handlePaste}
              onChange={handleChange}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              result={result}
              preview={preview}
              questionCount={validatedQuestionCount}
              flashcardCount={validatedFlashcardCount}
              categories={validatedCategories}
            />
          )}

        </div>

        {/* Modal Main Action Footer */}
        <div className="flex items-center justify-between gap-4 px-8 py-5 border-t border-border bg-panel">
          {/* Cancel/Back buttons */}
          {step === 1 ? (
            <button
            type="button"
              onClick={onCancel}
              aria-label="Cancel subject import"
              title="Cancel import and close"
              className="text-xs font-mono px-5 py-2.5 rounded border border-border text-[#a4acba] hover:text-white hover:border-zinc-500 transition-colors focus-ring min-h-[44px] cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <button
            type="button"
              onClick={() => setStep((prev) => prev - 1)}
              aria-label="Go back to previous step"
              title="Back to previous step"
              className="text-xs font-mono px-5 py-2.5 rounded border border-border text-[#a4acba] hover:text-white hover:border-zinc-500 transition-colors focus-ring min-h-[44px] cursor-pointer animate-fade-in"
            >
              ← BACK
            </button>
          )}

          {/* Continue/Confirm buttons */}
          {step < 5 ? (
            <button
            type="button"
              onClick={() => setStep((prev) => prev + 1)}
              disabled={isNextDisabled}
              aria-busy={state === "importing"}
              title={isNextDisabled ? "Please fill required fields to continue" : "Proceed to next step"}
              className={cn(
                "text-xs font-mono px-6 py-2.5 border font-bold tracking-widest uppercase transition-all duration-150 focus-ring min-h-[44px] cursor-pointer rounded",
                isNextDisabled
                  ? "border-border text-muted-foreground cursor-not-allowed opacity-40"
                  : "border-primary bg-primary text-primary-foreground hover:bg-primary/95 border-glow"
              )}
            >
              CONTINUE →
            </button>
          ) : (
            <button
            type="button"
              onClick={handleConfirm}
              disabled={isNextDisabled}
              aria-busy={state === "importing"}
              title={isNextDisabled ? "Subject data must be completely valid to import" : "Load verified subject data"}
              className={cn(
                "text-xs font-mono px-6 py-2.5 border font-bold tracking-widest uppercase transition-all duration-150 focus-ring min-h-[44px] cursor-pointer rounded",
                isNextDisabled
                  ? "border-border text-muted-foreground cursor-not-allowed opacity-40"
                  : "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 border-glow-success"
              )}
            >
              {state === "importing" ? "IMPORTING..." : "ADD SUBJECT"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
