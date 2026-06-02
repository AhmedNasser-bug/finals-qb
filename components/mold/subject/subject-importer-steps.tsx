"use client"

import React, { type DragEvent } from "react"
import { cn } from "@/lib/utils"
import { PEDAGOGICAL_PRESETS } from "@/lib/prompt-builder"
import type { FullSubjectData } from "@/lib/mold-types"
import type { ValidationResult } from "@/lib/subject-persistence"
import { DropZoneSection, ValidationFeedbackSection } from "./subject-importer-blocks"
import { InfoToolbox } from "./subject-importer-components"

// ─── Step 1 Component ────────────────────────────────────────────────────────
interface Step1PresetTopicProps {
  topic: string
  setTopic: (val: string) => void
  useReferenceBank: boolean
  setUseReferenceBank: (val: boolean) => void
  selectedPreset: string
  onPresetSelect: (presetId: string) => void
}

export function Step1PresetTopic({
  topic,
  setTopic,
  useReferenceBank,
  setUseReferenceBank,
  selectedPreset,
  onPresetSelect,
}: Step1PresetTopicProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
          STEP 01 // PRESET_CONFIG_SELECTION
        </span>
        <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center">
          <span>Choose Your Learning Science Preset</span>
          <InfoToolbox content="Pedagogical presets target specific study goals and cognitive workloads. Google's LearnLM rules are dynamically injected to guide prompt generation." />
        </h3>
        <p className="text-xs text-[#a4acba] leading-relaxed max-w-2xl font-sans font-medium">
          Select an optimized pedagogical preset to align with your study goals, then specify the subject domain name.
        </p>
      </div>

      {/* Topic Input Box */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="wizard-topic"
          className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center justify-between"
        >
          <span>Enter Subject Topic / Domain Name</span>
          <span className="text-[10px] text-primary font-mono font-normal">REQUIRED</span>
        </label>
        <input
          id="wizard-topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="E.g., Theory of Computation, Data Structures, Human Anatomy..."
          className="w-full bg-[#07080a] border border-border rounded-none px-4 py-2.5 text-sm text-white font-mono placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all min-h-[40px]"
          autoComplete="off"
        />
      </div>

      {/* Reference Checkbox */}
      <div className="flex items-start gap-3 hover:text-white transition-colors">
        <input
          id="wizard-ref"
          type="checkbox"
          checked={useReferenceBank}
          onChange={(e) => setUseReferenceBank(e.target.checked)}
          className="accent-primary mt-0.5 w-4 h-4 cursor-pointer focus-ring"
        />
        <label htmlFor="wizard-ref" className="flex flex-col cursor-pointer text-left select-none">
          <span className="text-xs font-mono font-bold uppercase text-white tracking-wide flex items-center">
            <span>Align with Attached Question Bank / Syllabus</span>
            <InfoToolbox content="Instructs the AI to strictly align generated questions and terminology with your custom syllabus materials, lectures, or textbook sources." />
          </span>
          <span className="text-[11px] text-[#a4acba] leading-relaxed mt-0.5 font-sans font-medium">
            AI strictly mirrors your attached materials, mapping unique concepts, structures, and difficulties exactly.
          </span>
        </label>
      </div>

      {/* Pedagogical Presets Row */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
          Select Pedagogical Study Preset
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {[
            { id: "finals_prep", name: "Finals Prep", desc: "High Rigor Exam prep", hint: "Scenario-focused exam preparation." },
            { id: "concept_journey", name: "Concept Journey", desc: "Deep Conceptual study", hint: "Explains theories via analogies." },
            { id: "quick_drill", name: "Quick Drill", desc: "Rapid Active Recall", hint: "Short, fast active recall sets." },
            { id: "full_revision", name: "Full Revision", desc: "Exhaustive Review", hint: "Complete syllabus mapping." },
            { id: "custom", name: "Custom Blocks", desc: "Manual parameters", hint: "Customize pedagogical rules manually." }
          ].map((p) => {
            const isSelected = selectedPreset === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPresetSelect(p.id)}
                className={cn(
                  "flex flex-col text-left p-4 border transition-all duration-300 ease-out focus-ring cursor-pointer min-h-[110px] justify-between rounded-none hover:-translate-y-0.5 hover:bg-zinc-800/20 hover:border-zinc-700/80",
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground border-glow"
                    : "border-border bg-[#101115] text-[#a4acba] hover:text-white"
                )}
              >
                <div>
                  <span className={cn("text-xs font-mono font-bold font-display uppercase tracking-wide", isSelected ? "text-primary font-bold" : "text-white font-semibold")}>
                    {p.name}
                  </span>
                  <span className="text-[10px] leading-snug mt-1 block opacity-95 font-sans font-medium text-foreground">
                    {p.desc}
                  </span>
                </div>
                <span className="text-[9px] font-mono block opacity-80 mt-2 border-t border-border/40 pt-1 uppercase tracking-wider text-muted-foreground font-semibold">
                  {p.hint}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Step 2 Component ────────────────────────────────────────────────────────
type SubjectTypeBias = "theoretical" | "technical"

interface Step2SubjectTypeProps {
  subjectType: SubjectTypeBias
  setSubjectType: (val: SubjectTypeBias) => void
}

export function Step2SubjectType({ subjectType, setSubjectType }: Step2SubjectTypeProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
          STEP 02 // COGNITIVE_BIAS_CALIBRATION
        </span>
        <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center">
          <span>Calibrate Subject Bias Profile</span>
          <InfoToolbox content="Structural bias optimizes prompt directives: theoretical sets focus on deep prose, vocab tables, and conceptual clarity, while technical sets pre-seed code blocks, algorithmic comparisons, and detailed Mermaid diagrams." />
        </h3>
        <p className="text-xs text-[#a4acba] leading-relaxed max-w-2xl font-sans font-medium">
          Select the structural profile of this subject to adapt questions dynamically.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Theoretical Card */}
        <button
          type="button"
          onClick={() => setSubjectType("theoretical")}
          className={cn(
            "flex-1 p-8 border text-left flex flex-col justify-between gap-5 transition-all duration-300 ease-out focus-ring cursor-pointer rounded-none min-h-[200px] hover:-translate-y-0.5 hover:bg-[#121318]/50",
            subjectType === "theoretical"
              ? "border-[#4ae176] bg-[var(--tw-hex-4ae176)]/5 border-glow-success"
              : "border-border bg-[#111215] text-[#a4acba] hover:border-zinc-700/80 hover:text-white"
          )}
        >
          <div className="space-y-3">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">BIAS_PROFILE: TEXT_DICTIONARY</span>
            <h4 className={cn("text-lg font-bold font-display tracking-tight", subjectType === "theoretical" ? "text-[#4ae176] font-bold" : "text-white font-semibold")}>
              Theoretical & Prose Focused
            </h4>
            <p className="text-xs text-[#a4acba] leading-relaxed font-sans mt-2 font-medium">
              Optimized for descriptive fields, terminology dictionaries, conceptual analysis, and historical relationships. Restricts diagram clutter to maintain focus on literature, definitions, and prose structure.
            </p>
          </div>
          <div className="text-[10px] font-mono text-[#4ae176] font-bold uppercase tracking-widest border-t border-border/40 pt-2.5">
            {subjectType === "theoretical" ? "✓ SELECTED PROFILE" : "SELECT THEORETICAL"}
          </div>
        </button>

        {/* Technical Card */}
        <button
          type="button"
          onClick={() => setSubjectType("technical")}
          className={cn(
            "flex-1 p-8 border text-left flex flex-col justify-between gap-5 transition-all duration-300 ease-out focus-ring cursor-pointer rounded-none min-h-[200px] hover:-translate-y-0.5 hover:bg-[#121318]/50",
            subjectType === "technical"
              ? "border-primary bg-primary/5 border-glow"
              : "border-border bg-[#111215] text-[#a4acba] hover:border-zinc-700/80 hover:text-white"
          )}
        >
          <div className="space-y-3">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">BIAS_PROFILE: DIAGRAMS_AND_CODE</span>
            <h4 className={cn("text-lg font-bold font-display tracking-tight", subjectType === "technical" ? "text-primary font-bold" : "text-white font-semibold")}>
              Technical & Analytical Focused
            </h4>
            <p className="text-xs text-[#a4acba] leading-relaxed font-sans mt-2 font-medium">
              Optimized for programmatic and analytical subjects. Instructs the AI to pre-seed rich visual Mermaid flowcharts, code syntax styling, state machine transitions, and data comparisons for at least 60% of questions.
            </p>
          </div>
          <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest border-t border-border/40 pt-2.5">
            {subjectType === "technical" ? "✓ SELECTED PROFILE" : "SELECT TECHNICAL"}
          </div>
        </button>
      </div>
    </div>
  )
}

// ─── Step 3 Component ────────────────────────────────────────────────────────
interface Step3QuestionCountProps {
  questionCount: number
  setQuestionCount: (val: number) => void
  presetJustification: string
  onCustomPresetClick: (val: number) => void
}

export function Step3QuestionCount({
  questionCount,
  setQuestionCount,
  presetJustification,
  onCustomPresetClick,
}: Step3QuestionCountProps) {
  return (
    <div className="space-y-5 animate-slide-up">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
          STEP 03 // QUANTITY_THRESHOLD_CALIBRATION
        </span>
        <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center">
          <span>Configure Question Count Threshold</span>
          <InfoToolbox content="Calibrating the question count enables custom learning session pacing. Larger pools provide absolute coverage, while smaller sets prevent learning fatigue." />
        </h3>
        <p className="text-xs text-[#a4acba] leading-relaxed max-w-2xl font-sans font-medium">
          Choose the volume of practice questions to generate.
        </p>
      </div>

      {/* Justification Box */}
      <div className="p-4 bg-primary/5 border border-primary/20 flex items-start gap-3 rounded-none">
        <span className="text-primary font-mono select-none text-sm mt-0.5">ℹ</span>
        <div>
          <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">PRESET JUSTIFICATION</p>
          <p className="text-xs text-[#a4acba] leading-relaxed mt-0.5 font-sans font-medium">
            {presetJustification}
          </p>
        </div>
      </div>

      {/* Question count input well */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/60 bg-[#101115] p-5">
          <div className="flex flex-col">
            <label htmlFor="wizard-count" className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              Total Questions Volume
            </label>
            <span className="text-[10px] text-muted-foreground mt-0.5 font-mono uppercase font-semibold">
              Min 1 — Max 500 questions
            </span>
          </div>
          <input
            id="wizard-count"
            type="number"
            min={1}
            max={500}
            value={questionCount}
            onChange={(e) => {
              setQuestionCount(Math.max(1, parseInt(e.target.value) || 0))
            }}
            className="w-full sm:w-36 bg-[#07080a] border border-border rounded-none px-4 py-2.5 text-center text-xl font-mono text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all min-h-[40px]"
          />
        </div>

        {/* Preset quick buttons */}
        <div className="pt-2 flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">Quick Presets:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {[20, 40, 80, 120].map((num) => {
              const isSelected = questionCount === num
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onCustomPresetClick(num)}
                  className={cn(
                    "text-xs font-mono px-3.5 py-1.5 border transition-all duration-300 ease-out cursor-pointer rounded-none min-h-[32px] hover:scale-[1.02]",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold animate-pulse-soft"
                      : "border-border text-[#a4acba] hover:border-zinc-700/80 hover:text-white bg-[#07080a]"
                  )}
                >
                  {num} QS
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 4 Component ────────────────────────────────────────────────────────
interface Step4PromptBuildProps {
  topic: string
  compiledPrompt: string
  promptCopied: boolean
  onCopyPrompt: (promptText: string) => void
  userMaterial: string
  setUserMaterial: (val: string) => void
}

export function Step4PromptBuild({
  topic,
  compiledPrompt,
  promptCopied,
  onCopyPrompt,
  userMaterial,
  setUserMaterial,
}: Step4PromptBuildProps) {
  const [showManualPrompt, setShowManualPrompt] = React.useState(false)
  const [dragActive, setDragActive] = React.useState(false)
  const [isConverting, setIsConverting] = React.useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processUploadedFile = React.useCallback(async (file: File) => {
    if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setUserMaterial((prev) => {
          const trimmed = prev.trim()
          return trimmed ? `${trimmed}\n\n${text}` : text
        })
      }
      reader.readAsText(file)
    } else {
      // Upload and convert via Microsoft MarkItDown API
      setIsConverting(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        
        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        })
        
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.error || "Failed to convert file.")
        }
        
        const data = await response.json()
        const convertedText = data.markdown
        
        setUserMaterial((prev) => {
          const trimmed = prev.trim()
          return trimmed ? `${trimmed}\n\n${convertedText}` : convertedText
        })
      } catch (err: any) {
        console.error("Error converting file:", err)
        alert(`Conversion Failed: ${err.message || "An unknown error occurred during conversion."}`)
      } finally {
        setIsConverting(false)
      }
    }
  }, [setUserMaterial])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0])
    }
  }, [processUploadedFile])

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0])
    }
  }, [processUploadedFile])

  const downloadStudyPackage = () => {
    if (!userMaterial.trim()) return
    const packageText = `================================================================================
FINALIST STUDY MATERIAL GENERATION PACKAGE
================================================================================
INSTRUCTIONS FOR THE CHATBOT:
${compiledPrompt}

================================================================================
SOURCE STUDY MATERIAL TO ANALYZE AND EXTRACT QUESTIONS FROM:
================================================================================
${userMaterial}
`
    const blob = new Blob([packageText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `TAKE_ME_TO_ANY_CHATBOT.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-slide-up select-none">
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
          STEP 04 // GENERATE_STUDY_PACKAGE
        </span>
        <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center">
          <span>Create Your Socratic Study Package</span>
          <InfoToolbox content="This packages our learning science prompt alongside your study materials so your chatbot can generate the exact structure seamlessly." />
        </h3>
        <p className="text-xs text-[#a4acba] leading-relaxed max-w-2xl font-sans font-medium">
          Feed your materials to the Socratic Prompt Builder to create a single-file generation package.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Numbered Guide */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 border border-border bg-[#101115] rounded">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase border-b border-border pb-2.5 mb-3.5 select-none">
              Generation Pipeline
            </h4>
            
            <div className="space-y-4 text-xs font-medium leading-relaxed font-sans text-zinc-300 select-none">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary text-black font-mono font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <span className="text-white font-bold block">Load Source Material</span>
                  <span>Paste slides, notes, or drop text notes on the right to bundle them.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary text-black font-mono font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <span className="text-white font-bold block">Download Generation Package</span>
                  <span>Get a single `.txt` file containing the Socratic instructions and your material merged.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary text-black font-mono font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <span className="text-white font-bold block">Ask Google Gemini (Recommended)</span>
                  <span>
                    Open{" "}
                    <a
                      href="https://gemini.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                    >
                      Google Gemini ➔
                    </a>{" "}
                    or Claude, upload the downloaded file, and ask it to run!
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary text-black font-mono font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <span className="text-white font-bold block">Paste Chatbot Result</span>
                  <span>Copy the generated chatbot response code and advance to Step 5 to verify it.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded">
            <p className="text-xs leading-relaxed text-zinc-300 font-sans font-medium">
              💡 <span className="text-[#4ae176] font-bold">Why this works:</span> Chatbots are much smarter when they get instructions and notes formatted together in a single text file. It guarantees 100% accurate, error-free results!
            </p>
          </div>
        </div>

        {/* Right Column: Path A material load zone */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 border border-border bg-[#101115] rounded space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                [PATH A] Drag Notes or Paste Study Material
              </span>
              <span className="text-[10px] font-mono text-zinc-500">ANY FORMAT via MARKITDOWN</span>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "border border-dashed p-4 text-center rounded transition-colors flex flex-col justify-center items-center min-h-[90px] relative",
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-zinc-700 bg-black/30",
                isConverting && "border-primary/50 bg-primary/5 animate-pulse-glow"
              )}
            >
              {isConverting ? (
                <div className="flex items-center gap-3 py-1">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-primary font-mono tracking-wider font-bold uppercase animate-pulse">
                    Converting via Microsoft MarkItDown...
                  </span>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    id="material-upload"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isConverting}
                  />
                  <span className="text-xs text-zinc-400 font-sans font-medium">
                    Drag & Drop any notes file (.pdf, .docx, .pptx, .xlsx, .md, .txt) here, or{" "}
                    <span className="text-primary hover:underline">browse files</span>
                  </span>
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pasted-notes" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                Or Paste Custom Lecture Notes / Syllabus / Slide Text
              </label>
              <textarea
                id="pasted-notes"
                value={userMaterial}
                onChange={(e) => setUserMaterial(e.target.value)}
                placeholder="Paste course notes, slides, vocab definitions, syllabus, or raw study text here..."
                className="w-full bg-[#07080a] border border-border px-3.5 py-2.5 font-mono text-xs text-zinc-300 placeholder:text-zinc-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all min-h-[140px] resize-y"
              />
            </div>

            <button
              type="button"
              onClick={downloadStudyPackage}
              disabled={!userMaterial.trim()}
              className={cn(
                "w-full h-11 border font-mono text-xs font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer flex items-center justify-center gap-2",
                userMaterial.trim()
                  ? "border-[#4ae176] bg-[#4ae176]/10 text-[#4ae176] hover:bg-[#4ae176]/15 border-glow-success"
                  : "border-border text-muted-foreground bg-transparent opacity-40 cursor-not-allowed"
              )}
            >
              📥 DOWNLOAD STUDY BUNDLE (TAKE_ME_TO_ANY_CHATBOT.txt)
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Path B: Manual Prompt Copy */}
      <div className="border border-border rounded bg-[#101115] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowManualPrompt(!showManualPrompt)}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-zinc-800/10 transition-colors text-left"
        >
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            [PATH B] Expert Mode: Copy raw system prompt instructions directly
          </span>
          <span className="text-xs font-mono text-zinc-500 font-bold">
            {showManualPrompt ? "CLOSE ▲" : "OPEN ▼"}
          </span>
        </button>

        {showManualPrompt && (
          <div className="p-5 border-t border-border bg-black/40 space-y-4 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                SYSTEM PROMPT DIRECTIVES
              </span>
              <button
                type="button"
                onClick={() => onCopyPrompt(compiledPrompt)}
                className={cn(
                  "text-xs font-mono px-4 py-1.5 border transition-all duration-150 cursor-pointer",
                  promptCopied
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-primary bg-primary/5 text-primary hover:bg-primary/10"
                )}
              >
                {promptCopied ? "✓ COPIED" : "COPY PROMPT"}
              </button>
            </div>
            <textarea
              readOnly
              value={compiledPrompt}
              aria-label="Raw compiled AI system prompt"
              className="w-full bg-[#07080a] border border-border/80 font-mono text-xs leading-relaxed p-3 text-zinc-400 focus:outline-none resize-none h-44 cursor-default rounded"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step 5 Component ────────────────────────────────────────────────────────
interface Step5LoadDataProps {
  json: string
  state: "idle" | "validating" | "valid" | "error" | "pasting"
  isDragging: boolean
  onPaste: () => void
  onChange: (val: string) => void
  onDragOver: (e: DragEvent<HTMLDivElement>) => void
  onDragLeave: () => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
  result: ValidationResult | null
  preview: FullSubjectData | null
  questionCount: number
  flashcardCount: number
  categories: string[]
}

export function Step5LoadData({
  json,
  state,
  isDragging,
  onPaste,
  onChange,
  onDragOver,
  onDragLeave,
  onDrop,
  result,
  preview,
  questionCount,
  flashcardCount,
  categories,
}: Step5LoadDataProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
          STEP 05 // LOAD_VALIDATED_SUBJECT_JSON
        </span>
        <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center">
          <span>Drop & Validate Generated JSON Dataset</span>
          <InfoToolbox content="Upload your generated dataset. We run schema validation checks, counting questions and flashcards, and cross-matching terminology groups dynamically." />
        </h3>
        <p className="text-xs text-[#a4acba] leading-relaxed max-w-2xl font-sans font-medium">
          Paste the single-line JSON output generated by NotebookLM or copy-drop your downloaded `.json` file below.
        </p>
      </div>

      <DropZoneSection
        json={json}
        state={state}
        isDragging={isDragging}
        onPaste={onPaste}
        onChange={onChange}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />

      <ValidationFeedbackSection
        state={state}
        result={result}
        preview={preview}
        questionCount={questionCount}
        flashcardCount={flashcardCount}
        categories={categories}
      />
    </div>
  )
}
