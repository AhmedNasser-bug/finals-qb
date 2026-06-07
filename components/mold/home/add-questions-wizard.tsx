"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Sparkles, X, Copy, Check, Info, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { parseSubjectJson, validateSubjectData, type ValidationResult } from "@/lib/subject-persistence"
import { formatLabel, type FullSubjectData } from "@/lib/mold-types"

interface AddQuestionsWizardProps {
  activeSubject: FullSubjectData
  onMerge: (mergedSubject: FullSubjectData) => void
  onCancel: () => void
}

export function AddQuestionsWizard({
  activeSubject,
  onMerge,
  onCancel,
}: AddQuestionsWizardProps) {
  // --- Wizard States ---
  const [step, setStep] = useState<number>(1)
  
  // Step 1: Content Type & Quantity
  const [contentType, setContentType] = useState<"questions" | "flashcards" | "both">("questions")
  const [questionCount, setQuestionCount] = useState<number>(15)
  const [flashcardCount, setFlashcardCount] = useState<number>(15)

  // Step 2: Style Bias
  const [styleBias, setStyleBias] = useState<"theoretical" | "technical" | "balanced">("balanced")

  // Step 3: Category Focus
  const [categoryFocus, setCategoryFocus] = useState<"all" | "existing" | "new">("all")
  
  // Get existing categories unique values
  const existingCategories = useMemo(() => {
    return Array.from(new Set(activeSubject.questions.map((q) => q.category)))
  }, [activeSubject.questions])

  const [selectedCategory, setSelectedCategory] = useState<string>(
    existingCategories[0] || ""
  )
  const [newCategoryName, setNewCategoryName] = useState<string>("")

  // Step 4: Copy Prompt
  const [promptCopied, setPromptCopied] = useState(false)

  // Step 5: Paste & Merge
  const [jsonInput, setJsonInput] = useState("")
  const [validationState, setValidationState] = useState<"idle" | "validating" | "valid" | "error">("idle")
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [parsedPreview, setParsedPreview] = useState<FullSubjectData | null>(null)

  // --- Dynamic Prompt Builder ---
  const compiledPrompt = useMemo(() => {
    const categoriesContext = existingCategories.map((c) => `"${c}" (${formatLabel(c)})`).join(", ")

    let targetCategoryText = ""
    if (categoryFocus === "all") {
      targetCategoryText = `Spread the generated items across the existing categories: [${categoriesContext}].`
    } else if (categoryFocus === "existing" && selectedCategory) {
      targetCategoryText = `Focus all generated items strictly on the existing category: "${selectedCategory}" (${formatLabel(selectedCategory)}).`
    } else if (categoryFocus === "new" && newCategoryName.trim()) {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      targetCategoryText = `Create and focus all generated items on a new category: "${slug}" (Display Name: "${newCategoryName}").`
    }

    const itemsToGenerate: string[] = []
    if (contentType === "questions" || contentType === "both") {
      itemsToGenerate.push(`EXACTLY ${questionCount} unique, high-quality questions (MCQ or TrueFalse format)`)
    }
    if (contentType === "flashcards" || contentType === "both") {
      itemsToGenerate.push(`EXACTLY ${flashcardCount} unique flashcards`)
    }

    const styleText = styleBias === "technical"
      ? `TECHNICAL/APPLIED FOCUS:\n- Prioritize technical, programming, mathematical, or algorithmic questions.\n- Embed code snippets (using <code> and <pre> tags) or trace data where applicable.\n- Generate valid Mermaid diagrams (flowcharts, sequence diagrams, etc.) for at least 40% of the questions.\n- Terminology definitions must be precise and formal.`
      : styleBias === "theoretical"
      ? `THEORETICAL/CONCEPTUAL FOCUS:\n- Focus on definitions, abstract relationships, core principles, and conceptual history/explanations.\n- Keep questions prose-focused. Restrict diagrams to simple mindmaps or conceptual flowcharts.\n- Explanations should explore the "why" and "how" of concepts in depth.`
      : `BALANCED FOCUS:\n- Provide a balanced mix of both theoretical definitions and technical application/scenarios.\n- Include code blocks or diagrams where helpful, but also ensure conceptual definitions are well represented.`

    return `You are a pedagogical expert and curriculum designer. You are generating supplementary study material to be MERGED into an existing course subject.

EXISTING SUBJECT CONTEXT:
- Subject Name: "${activeSubject.name}"
- Active Categories: [${categoriesContext}]

WHAT TO GENERATE:
Generate ${itemsToGenerate.join(" and ")}.
${targetCategoryText}

STYLE & PEDAGOGICAL BIAS:
${styleText}

PEDAGOGICAL INSTRUCTIONS (LearnLM Infused):
- Inspire Active Learning: Make questions scenario-based. Use Socratic hints ("hint" field) that guide the user's attention instead of giving the answer away.
- Deepen Metacognition: In the "explanation" field, detail why the correct answer is correct and why the alternatives are incorrect, highlighting common misconceptions.
- Manage Cognitive Load: Keep explanations, flashcard definitions, and questions concise, formatted with bullet points or clear typography.

JSON FORMAT CONTRACT:
Return ONLY a raw JSON object matching the following structure. Do not wrap it in markdown code block fences (no \`\`\`json), do not include any explanatory intro/outro text. Just return the raw JSON:

{
  ${contentType === "questions" || contentType === "both" ? `"questions": [
    {
      "id": "gen-q1",
      "type": "MCQ" or "TrueFalse",
      "difficulty": "Easy" or "Medium" or "Hard",
      "category": "category-slug-to-use",
      "question": "Question text (HTML tags like <b>, <code>, <pre> are supported)",
      "options": [
        { "label": "A", "text": "Option A" },
        { "label": "B", "text": "Option B" },
        { "label": "C", "text": "Option C" },
        { "label": "D", "text": "Option D" }
      ],
      "answer": "A",
      "explanation": "LearnLM explanation.",
      "hint": "Socratic nudge."
    }
  ],` : ""}
  ${contentType === "flashcards" || contentType === "both" ? `"flashcards": [
    {
      "id": "gen-f1",
      "term": "Concept Term",
      "definition": "Clear, concise definition",
      "category": "category-slug-to-use"
    }
  ],` : ""}
  "terminology": {
    "category-slug-to-use": [
      { "term": "Concept Term", "definition": "Clear, concise definition" }
    ]
  }
}

CRITICAL RULES:
- Use unique, kebab-case IDs starting with "gen-q-" or "gen-fc-" (e.g., "gen-q-1", "gen-fc-1").
- Terminology must contain definitions for all terms generated in flashcards or questions under their respective category slug.
- Double-check that all JSON formatting is correct. Escape backslashes as \\\\ (e.g. \\\\theta or \\\\n). Do not use unescaped backslashes inside JSON strings.
- Produce compact, minified, or single-line JSON if possible to save space.
`
  }, [contentType, questionCount, flashcardCount, styleBias, categoryFocus, selectedCategory, newCategoryName, activeSubject, existingCategories])

  // --- Copy Prompt to Clipboard ---
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(compiledPrompt)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2000)
    } catch (e) {
      // ignore
    }
  }

  // --- Validate Pasted JSON ---
  const validateJsonInput = useCallback((raw: string) => {
    if (!raw.trim()) {
      setValidationState("idle")
      setValidationResult(null)
      setParsedPreview(null)
      return
    }

    setValidationState("validating")
    
    // Defer parsing slightly to keep UI responsive
    requestAnimationFrame(() => {
      const parsed = parseSubjectJson(raw)
      if (parsed.parseError) {
        setValidationResult({ valid: false, errors: [parsed.parseError], warnings: [] })
        setValidationState("error")
        setParsedPreview(null)
        return
      }

      const validation = validateSubjectData(parsed.data)
      if (parsed.fixedWarnings && parsed.fixedWarnings.length > 0) {
        validation.warnings.push(...parsed.fixedWarnings)
      }

      setValidationResult(validation)
      setParsedPreview(validation.subject || (parsed.data as FullSubjectData))
      setValidationState(validation.valid ? "valid" : "error")
    })
  }, [])

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setJsonInput(value)
    validateJsonInput(value)
  }

  // --- Merge Action ---
  const handleConfirmMerge = () => {
    if (!parsedPreview) return

    const existingQuestions = [...activeSubject.questions]
    const existingFlashcards = [...(activeSubject.flashcards || [])]
    const existingTerminology = { ...(activeSubject.terminology || {}) }

    // Filter out the default placeholder question if questions weren't requested
    const incomingQuestions = parsedPreview.questions.filter(
      (q) => q.id !== "q-default-1"
    )
    const incomingFlashcards = parsedPreview.flashcards || []
    const incomingTerminology = parsedPreview.terminology || {}

    // Combine questions and resolve duplicate IDs
    const combinedQuestions = [...existingQuestions]
    const seenIds = new Set(existingQuestions.map((q) => q.id))

    incomingQuestions.forEach((q) => {
      let finalId = q.id
      let counter = 1
      while (seenIds.has(finalId)) {
        finalId = `${q.id}-gen-${counter}`
        counter++
      }
      seenIds.add(finalId)
      combinedQuestions.push({ ...q, id: finalId })
    })

    // Combine flashcards and resolve duplicate IDs
    const combinedFlashcards = [...existingFlashcards]
    const seenFcIds = new Set(existingFlashcards.map((f) => f.id))

    incomingFlashcards.forEach((f) => {
      let finalId = f.id
      let counter = 1
      while (seenFcIds.has(finalId)) {
        finalId = `${f.id}-gen-${counter}`
        counter++
      }
      seenFcIds.add(finalId)
      combinedFlashcards.push({ ...f, id: finalId })
    })

    // Merge terminology
    Object.entries(incomingTerminology).forEach(([cat, entries]) => {
      if (!Array.isArray(entries)) return
      if (!existingTerminology[cat]) {
        existingTerminology[cat] = []
      }
      const existingTerms = new Set(existingTerminology[cat].map((e) => e.term.toLowerCase().trim()))
      entries.forEach((entry) => {
        if (typeof entry !== "object" || entry === null) return
        const t = entry.term || ""
        const d = entry.definition || ""
        if (t.trim() && !existingTerms.has(t.toLowerCase().trim())) {
          existingTerminology[cat].push({ term: t, definition: d })
        }
      })
    })

    // Sort questions and flashcards by category
    const existingCategoriesOrder = Array.from(new Set(existingQuestions.map((q) => q.category)))
    const catIndex = (cat: string) => {
      const idx = existingCategoriesOrder.indexOf(cat)
      return idx === -1 ? Infinity : idx
    }

    combinedQuestions.sort((a, b) => catIndex(a.category) - catIndex(b.category))
    combinedFlashcards.sort((a, b) => catIndex(a.category) - catIndex(b.category))

    // Construct merged subject
    const mergedSubject: FullSubjectData = {
      ...activeSubject,
      questions: combinedQuestions,
      flashcards: combinedFlashcards,
      terminology: existingTerminology,
    }

    onMerge(mergedSubject)
  }

  // --- Step Names/Labels ---
  const steps = [
    { num: 1, label: "Content Type" },
    { num: 2, label: "Pedagogical Style" },
    { num: 3, label: "Category Focus" },
    { num: 4, label: "Copy Prompt" },
    { num: 5, label: "Paste & Merge" },
  ]

  const isNextDisabled = useMemo(() => {
    if (step === 3 && categoryFocus === "new" && !newCategoryName.trim()) {
      return true
    }
    if (step === 5 && (!parsedPreview || validationState !== "valid")) {
      return true
    }
    return false
  }, [step, categoryFocus, newCategoryName, parsedPreview, validationState])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add Questions Wizard"
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none outline-none"
    >
      <div className="w-full max-w-5xl h-[88vh] flex flex-col gap-0 border border-border bg-[#0a0b0d] rounded-none overflow-hidden border-glow transition-all duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-panel">
          <div>
            <h2 className="text-sm font-mono font-bold tracking-wider uppercase text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" aria-hidden="true" />
              <span>Add Questions to Subject Wizard</span>
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 mt-0.5 tracking-wider uppercase">
              Step {step} of 5 — {steps[step - 1].label}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center border border-border text-[#a4acba] hover:text-white hover:border-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
            aria-label="Close wizard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Breadcrumbs */}
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
                      "text-[10px] font-mono select-none hidden md:inline-block",
                      isPast ? "text-zinc-500" : "text-zinc-800"
                    )}>➔</span>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Modal Main Content Pane */}
        <div className="flex-1 px-8 py-6 overflow-y-auto min-h-0 bg-[#0a0b0d]">

          {/* STEP 1: Content Type & Quantity */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
                  STEP 01 // CONTENT_TYPE_SELECTION
                </span>
                <h3 className="text-lg font-bold font-mono text-white tracking-tight">
                  Choose Generated Material Type & Volume
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Select the types of learning materials you would like the AI to generate and configure their quantities.
                </p>
              </div>

              {/* Content Type Selector */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "questions", name: "Questions Only", desc: "MCQ & TrueFalse sets" },
                  { id: "flashcards", name: "Flashcards Only", desc: "Key concept definitions" },
                  { id: "both", name: "Both Sets", desc: "Unified study collection" },
                ].map((type) => {
                  const isSelected = contentType === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setContentType(type.id as any)}
                      className={cn(
                        "flex flex-col text-left p-4 border transition-all duration-150 cursor-pointer min-h-[90px] justify-between rounded-none",
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground border-glow"
                          : "border-border bg-[#101115] text-zinc-400 hover:text-white"
                      )}
                    >
                      <span className={cn("text-xs font-mono font-bold uppercase tracking-wide", isSelected ? "text-primary" : "text-white")}>
                        {type.name}
                      </span>
                      <span className="text-[10px] leading-snug mt-1 font-sans text-zinc-500">
                        {type.desc}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Quantity Selectors */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                {(contentType === "questions" || contentType === "both") && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/60 bg-[#101115] p-5">
                    <div className="flex flex-col">
                      <label htmlFor="question-count-input" className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                        Questions Count
                      </label>
                      <span className="text-[10px] text-zinc-500 mt-0.5 font-mono uppercase">
                        Range: 5 — 50 items
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={5}
                        max={50}
                        step={5}
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
                        className="w-40 accent-primary cursor-pointer"
                      />
                      <input
                        id="question-count-input"
                        type="number"
                        min={5}
                        max={50}
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Math.min(50, Math.max(5, parseInt(e.target.value) || 0)))}
                        className="w-16 bg-[#07080a] border border-border rounded-none py-1.5 text-center text-sm font-mono text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {(contentType === "flashcards" || contentType === "both") && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/60 bg-[#101115] p-5">
                    <div className="flex flex-col">
                      <label htmlFor="flashcard-count-input" className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                        Flashcards Count
                      </label>
                      <span className="text-[10px] text-zinc-500 mt-0.5 font-mono uppercase">
                        Range: 5 — 50 items
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={5}
                        max={50}
                        step={5}
                        value={flashcardCount}
                        onChange={(e) => setFlashcardCount(parseInt(e.target.value) || 10)}
                        className="w-40 accent-primary cursor-pointer"
                      />
                      <input
                        id="flashcard-count-input"
                        type="number"
                        min={5}
                        max={50}
                        value={flashcardCount}
                        onChange={(e) => setFlashcardCount(Math.min(50, Math.max(5, parseInt(e.target.value) || 0)))}
                        className="w-16 bg-[#07080a] border border-border rounded-none py-1.5 text-center text-sm font-mono text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Pedagogical Style */}
          {step === 2 && (
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
          )}

          {/* STEP 3: Category Focus */}
          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
                  STEP 03 // CATEGORY_TARGETING
                </span>
                <h3 className="text-lg font-bold font-mono text-white tracking-tight">
                  Choose Category Targeting Profile
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Choose where the new items belong. You can target all existing categories, target a specific existing one, or create a brand new category.
                </p>
              </div>

              {/* Category Focus Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "all", name: "All Categories", desc: "Distribute generated items across current categories" },
                  { id: "existing", name: "Existing Category", desc: "Focus strictly on a single category selected below" },
                  { id: "new", name: "New Category", desc: "Create a brand new category slug and display name" },
                ].map((focus) => {
                  const isSelected = categoryFocus === focus.id
                  return (
                    <button
                      key={focus.id}
                      type="button"
                      onClick={() => setCategoryFocus(focus.id as any)}
                      className={cn(
                        "p-5 border text-left flex flex-col justify-between gap-3 transition-all duration-150 cursor-pointer rounded-none min-h-[120px]",
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground border-glow"
                          : "border-border bg-[#101115] text-zinc-400 hover:text-white"
                      )}
                    >
                      <span className={cn("text-xs font-mono font-bold uppercase tracking-wide", isSelected ? "text-primary" : "text-white")}>
                        {focus.name}
                      </span>
                      <span className="text-[10px] leading-snug font-sans text-zinc-500">
                        {focus.desc}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Conditional Inputs */}
              <div className="pt-4 border-t border-zinc-900">
                {categoryFocus === "existing" && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="existing-category-select" className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                      Select Target Existing Category
                    </label>
                    {existingCategories.length > 0 ? (
                      <select
                        id="existing-category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-[#07080a] border border-border rounded-none px-4 py-2.5 text-sm text-white font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[40px] cursor-pointer"
                      >
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {formatLabel(cat)} ({cat})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs font-mono text-zinc-600 uppercase">
                        No existing categories found in this subject.
                      </p>
                    )}
                  </div>
                )}

                {categoryFocus === "new" && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="new-category-input" className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center justify-between">
                      <span>Enter New Category Name</span>
                      <span className="text-[10px] text-primary font-mono font-normal">REQUIRED</span>
                    </label>
                    <input
                      id="new-category-input"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="E.g., Lexical Analysis, Socratic Dialogues, Heart Anatomy..."
                      className="w-full bg-[#07080a] border border-border rounded-none px-4 py-2.5 text-sm text-white font-mono placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[40px]"
                      autoComplete="off"
                    />
                    {newCategoryName.trim() && (
                      <p className="text-[10px] font-mono text-zinc-500 uppercase mt-1">
                        Slug mapping: {newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}
                      </p>
                    )}
                  </div>
                )}

                {categoryFocus === "all" && (
                  <div className="p-4 bg-zinc-900/40 border border-border/50 text-xs font-mono text-zinc-400">
                    <p className="font-bold text-white uppercase mb-1">Target Categories Context:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {existingCategories.map((cat) => (
                        <span key={cat} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700/50">
                          {formatLabel(cat)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Copy Prompt */}
          {step === 4 && (
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
          )}

          {/* STEP 5: Paste & Merge */}
          {step === 5 && (
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
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between gap-4 px-8 py-5 border-t border-border bg-panel">
          {/* Back/Cancel */}
          {step === 1 ? (
            <button
              onClick={onCancel}
              className="text-xs font-mono px-5 py-2.5 rounded border border-border text-[#a4acba] hover:text-white hover:border-zinc-500 transition-colors focus-visible:outline-none min-h-[40px] cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="text-xs font-mono px-5 py-2.5 rounded border border-border text-[#a4acba] hover:text-white hover:border-zinc-500 transition-colors focus-visible:outline-none min-h-[40px] cursor-pointer"
            >
              ← BACK
            </button>
          )}

          {/* Continue/Confirm */}
          {step < 5 ? (
            <button
              onClick={() => setStep((prev) => prev + 1)}
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
              onClick={handleConfirmMerge}
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
      </div>
    </div>
  )
}
