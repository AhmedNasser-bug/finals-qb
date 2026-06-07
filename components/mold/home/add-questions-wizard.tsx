"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Sparkles, X, Copy, Check, Info, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { parseSubjectJson, validateSubjectData, type ValidationResult } from "@/lib/subject-persistence"
import { formatLabel, type FullSubjectData } from "@/lib/mold-types"

import {
  Step1ContentType,
  Step2StyleBias,
  Step3CategoryFocus,
  Step4CopyPrompt,
  Step5PasteMerge,
  type WizardStepProps
} from "./add-questions-wizard-components"

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
      "id": "q-gen-unique-id",
      "category": "target-category-slug",
      "type": "multiple-choice", // or "true-false"
      "question": "The actual question text. Can include basic HTML like <code> or <pre> or <br/>.",
      "options": [
        { "id": "opt-1", "text": "Option A" },
        { "id": "opt-2", "text": "Option B" },
        { "id": "opt-3", "text": "Option C" },
        { "id": "opt-4", "text": "Option D" }
      ], // For true-false, strictly use exactly two options with text "True" and "False".
      "answer": "opt-2", // MUST exactly match one of the option IDs above
      "explanation": "Detailed explanation of why this is correct and others are not.",
      "hint": "A guiding socratic hint.",
      "mermaidDiagram": "sequenceDiagram\\n A->>B: optional diagram" // Only include if relevant. Omit field or set to null if not needed.
    }
  ],` : ""}
  ${contentType === "flashcards" || contentType === "both" ? `"flashcards": [
    {
      "id": "fc-gen-unique-id",
      "category": "target-category-slug",
      "front": "Term or Concept",
      "back": "Definition or explanation"
    }
  ],` : ""}
  "terminology": {
    "target-category-slug": [
      { "term": "Concept", "definition": "Brief definition" }
    ]
  }
}`
  }, [
    activeSubject.name,
    categoryFocus,
    contentType,
    existingCategories,
    flashcardCount,
    newCategoryName,
    questionCount,
    selectedCategory,
    styleBias,
  ])

  // --- Handlers ---

  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null)

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value
    setJsonInput(raw)

    if (!raw.trim()) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      setValidationState("idle")
      setValidationResult(null)
      setParsedPreview(null)
      return
    }

    setValidationState("validating")

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    // Debounce validation slightly for typing smoothness
    debounceTimer.current = setTimeout(() => {
      // 1. Attempt to parse JSON structure with repair heuristics
      const parseResult = parseSubjectJson(raw)

      if (parseResult.parseError || !parseResult.data) {
        setValidationState("error")
        setValidationResult({
          valid: false,
          errors: [parseResult.parseError || "Catastrophic JSON parsing failure."],
          warnings: parseResult.fixedWarnings,
          subject: null,
        })
        setParsedPreview(null)
        return
      }

      // 2. Wrap it in a faux-subject structure to pass through the main validator
      const mockSubjectToValidate = {
        id: "preview-subject",
        name: "Preview Subject",
        description: "Preview Description",
        questions: parseResult.data.questions || [],
        flashcards: parseResult.data.flashcards || [],
        terminology: parseResult.data.terminology || {},
      }

      // 3. Validate logical structure (schema, IDs, references)
      const result = validateSubjectData(mockSubjectToValidate)

      // Combine parse warnings with validation warnings
      const finalWarnings = [...parseResult.fixedWarnings, ...result.warnings]

      setValidationResult({
        ...result,
        warnings: finalWarnings
      })

      if (result.valid && result.subject) {
        setValidationState("valid")
        setParsedPreview(result.subject)
      } else {
        setValidationState("error")
        setParsedPreview(null)
      }
    }, 400)
  }, [])

  const handleConfirmMerge = () => {
    if (!parsedPreview) return

    const existingQuestions = activeSubject.questions || []
    const existingFlashcards = activeSubject.flashcards || []
    const existingTerminology = JSON.parse(JSON.stringify(activeSubject.terminology || {}))

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

  const stepProps: WizardStepProps = {
    activeSubject,
    step,
    contentType, setContentType,
    questionCount, setQuestionCount,
    flashcardCount, setFlashcardCount,
    styleBias, setStyleBias,
    categoryFocus, setCategoryFocus,
    existingCategories,
    selectedCategory, setSelectedCategory,
    newCategoryName, setNewCategoryName,
    compiledPrompt,
    promptCopied, setPromptCopied,
    jsonInput, setJsonInput,
    validationState, validationResult,
    parsedPreview
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-5xl h-[88vh] flex flex-col gap-0 border border-border bg-[#0a0b0d] rounded-none overflow-hidden border-glow transition-all duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-panel">
          <div>
            <h2 className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>AI Question Generator Wizard</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1.5 font-sans">
              Inject dynamically generated, curriculum-aligned questions and flashcards into <span className="text-primary font-bold">{activeSubject.name}</span>.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 hover:bg-zinc-800 rounded focus-visible:outline-none"
            aria-label="Close Wizard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="px-8 py-4 border-b border-border/50 bg-[#0d0e11] flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 w-full justify-between sm:justify-start">
            {steps.map((s, idx) => {
              const isActive = step === s.num
              const isPast = step > s.num
              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-300",
                        isActive ? "bg-primary text-black scale-110 shadow-[0_0_10px_rgba(var(--primary),0.4)]" :
                        isPast ? "bg-primary/20 text-primary" : "bg-zinc-900 text-zinc-600 border border-border"
                      )}
                    >
                      {isPast ? <Check className="w-3 h-3" /> : s.num}
                    </div>
                    <span className={cn(
                      "hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase transition-colors duration-300",
                      isActive ? "text-primary font-bold" :
                      isPast ? "text-zinc-300" : "text-zinc-600"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden sm:block w-8 md:w-16 h-px bg-zinc-800" />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Modal Main Content Pane */}
        <div className="flex-1 px-8 py-6 overflow-y-auto min-h-0 bg-[#0a0b0d]">

          {/* STEP 1: Content Type & Quantity */}
          {step === 1 && <Step1ContentType {...stepProps} />}

          {/* STEP 2: Pedagogical Style */}
          {step === 2 && <Step2StyleBias {...stepProps} />}

          {/* STEP 3: Category Focus */}
          {step === 3 && <Step3CategoryFocus {...stepProps} />}

          {/* STEP 4: Copy Prompt */}
          {step === 4 && <Step4CopyPrompt {...stepProps} />}

          {/* STEP 5: Paste & Merge */}
          {step === 5 && <Step5PasteMerge {...stepProps} handleJsonChange={handleJsonChange} />}

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
