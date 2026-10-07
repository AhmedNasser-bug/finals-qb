"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Sparkles, X, Copy, Check, Info, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { parseSubjectJson, validateSubjectData, type ValidationResult } from "@/lib/subject-persistence"
import { formatLabel, type FullSubjectData } from "@/lib/mold-types"
import {
  Step1ContentType,
  Step2PedagogicalStyle,
  Step3CategoryFocus,
  Step4CopyPrompt,
  Step5PasteMerge
} from "./add-questions-wizard-steps"

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

  // --- Dynamic Prompt Construction ---
  const compiledPrompt = useMemo(() => {
    let p = `You are an expert pedagogical AI. Your task is to generate strict JSON study material for the subject: "${activeSubject.name}".\n\n`

    if (activeSubject.config.description) {
      p += `Context: ${activeSubject.config.description}\n\n`
    }

    p += `OUTPUT REQUIREMENTS:\n`
    p += `- MUST return valid JSON matching the exact schema.\n`
    p += `- MUST NOT include markdown formatting (\`\`\`json) outside the structure.\n`

    if (contentType === "questions" || contentType === "both") {
      p += `- Generate exactly ${questionCount} new multiple-choice/true-false questions.\n`
    }
    if (contentType === "flashcards" || contentType === "both") {
      p += `- Generate exactly ${flashcardCount} new flashcards for spaced repetition.\n`
    }

    p += `\nSTYLE BIAS (${styleBias}):\n`
    if (styleBias === "technical") {
      p += `- Highly analytical. Include code snippets, algorithms, equations, or Mermaid diagrams (where appropriate) in the \`content\` fields.\n`
    } else if (styleBias === "theoretical") {
      p += `- Focus on definitions, historical context, core concepts, and logical relationships using clear explanatory prose.\n`
    } else {
      p += `- Provide a balanced mix of conceptual explanations and practical/technical examples.\n`
    }

    p += `\nCATEGORY TARGETING (${categoryFocus}):\n`
    if (categoryFocus === "all") {
      p += `- Distribute items evenly across the following categories: [${existingCategories.join(", ")}].\n`
    } else if (categoryFocus === "existing") {
      p += `- All items MUST be strictly assigned to the category: "${selectedCategory}".\n`
    } else if (categoryFocus === "new") {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      p += `- All items MUST be strictly assigned to the newly created category: "${slug}".\n`
    }

    p += `\nSCHEMA FORMAT (TypeScript Reference):\n`
    if (contentType === "questions" || contentType === "both") {
      p += `
type Question = {
  id: string // Unique ID, e.g. "q-gen-1"
  category: string // The target category slug
  type: "mcq" | "boolean"
  content: string // The question text (can include markdown/code)
  options?: string[] // Max 4 options (for mcq only)
  correctAnswer: string | boolean
  explanation: string // Why the answer is correct
}
`
    }

    if (contentType === "flashcards" || contentType === "both") {
      p += `
type Flashcard = {
  id: string // Unique ID, e.g. "fc-gen-1"
  category: string
  front: string // Concept, term, or prompt
  back: string // Detailed explanation, definition, or code block
}
`
    }

    p += `\nFINAL OUTPUT FORMAT:\n{\n`
    if (contentType === "questions" || contentType === "both") p += `  "questions": [ ... ],\n`
    if (contentType === "flashcards" || contentType === "both") p += `  "flashcards": [ ... ],\n`
    p += `  "terminology": {} // Optional key-value dictionary\n}`

    return p
  }, [activeSubject, contentType, questionCount, flashcardCount, styleBias, categoryFocus, existingCategories, selectedCategory, newCategoryName])

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

    const qCounterMap = new Map<string, number>()
    incomingQuestions.forEach((q) => {
      let finalId = q.id
      if (seenIds.has(finalId)) {
        let counter = qCounterMap.get(q.id) || 1
        while (true) {
          finalId = `${q.id}-gen-${counter}`
          if (!seenIds.has(finalId)) {
            qCounterMap.set(q.id, counter + 1)
            break
          }
          counter++
        }
      }
      seenIds.add(finalId)
      combinedQuestions.push({ ...q, id: finalId })
    })

    // Combine flashcards and resolve duplicate IDs
    const combinedFlashcards = [...existingFlashcards]
    const seenFcIds = new Set(existingFlashcards.map((f) => f.id))

    const fcCounterMap = new Map<string, number>()
    incomingFlashcards.forEach((f) => {
      let finalId = f.id
      if (seenFcIds.has(finalId)) {
        let counter = fcCounterMap.get(f.id) || 1
        while (true) {
          finalId = `${f.id}-gen-${counter}`
          if (!seenFcIds.has(finalId)) {
            fcCounterMap.set(f.id, counter + 1)
            break
          }
          counter++
        }
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
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
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
          {step === 1 && (
            <Step1ContentType
              contentType={contentType}
              setContentType={setContentType}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              flashcardCount={flashcardCount}
              setFlashcardCount={setFlashcardCount}
            />
          )}

          {step === 2 && (
            <Step2PedagogicalStyle
              styleBias={styleBias}
              setStyleBias={setStyleBias}
            />
          )}

          {step === 3 && (
            <Step3CategoryFocus
              categoryFocus={categoryFocus}
              setCategoryFocus={setCategoryFocus}
              existingCategories={existingCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
            />
          )}

          {step === 4 && (
            <Step4CopyPrompt
              compiledPrompt={compiledPrompt}
              promptCopied={promptCopied}
              onCopyPrompt={handleCopyPrompt}
            />
          )}

          {step === 5 && (
            <Step5PasteMerge
              jsonInput={jsonInput}
              handleJsonChange={handleJsonChange}
              validationState={validationState}
              validationResult={validationResult}
              parsedPreview={parsedPreview}
            />
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
              aria-busy={validationState === "validating"}
              className={cn(
                "text-xs font-mono px-6 py-2.5 border font-bold tracking-widest uppercase transition-all focus-ring min-h-[44px] cursor-pointer rounded",
                isNextDisabled
                  ? "border-border text-muted-foreground/40 cursor-not-allowed opacity-40 bg-transparent"
                  : "border-primary bg-primary text-primary-foreground hover:bg-primary/90 border-glow"
              )}
            >
              CONTINUE ➔
            </button>
          ) : (
            <button
              onClick={handleConfirmMerge}
              disabled={isNextDisabled}
              className={cn(
                "text-xs font-mono px-6 py-2.5 border font-bold tracking-widest uppercase transition-all focus-ring min-h-[44px] cursor-pointer flex items-center gap-2 rounded",
                isNextDisabled
                  ? "border-border text-muted-foreground/40 cursor-not-allowed opacity-40 bg-transparent"
                  : "border-emerald-500 bg-emerald-500 text-black hover:bg-emerald-400 border-glow-success shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              )}
            >
              <Check className="w-4 h-4" />
              <span>MERGE DATA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
