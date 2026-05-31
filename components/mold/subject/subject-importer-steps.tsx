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
      <div className="flex flex-col gap-2 p-5 border border-border bg-[#111215] rounded-none">
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
          className="w-full bg-[#07080a] border border-border rounded-none px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all min-h-[44px]"
          autoComplete="off"
        />
      </div>

      {/* Reference Checkbox */}
      <div className="bg-[#111215] border border-border p-4 flex items-start gap-3.5 hover:border-zinc-800 transition-colors">
        <input
          id="wizard-ref"
          type="checkbox"
          checked={useReferenceBank}
          onChange={(e) => setUseReferenceBank(e.target.checked)}
          className="accent-primary mt-1 w-4 h-4 cursor-pointer focus-ring"
        />
        <label htmlFor="wizard-ref" className="flex flex-col cursor-pointer text-left select-none">
          <span className="text-xs font-mono font-bold uppercase text-white tracking-wide flex items-center">
            <span>Align with Attached Question Bank / Syllabus</span>
            <InfoToolbox content="Instructs the AI to strictly align generated questions and terminology with your custom syllabus materials, lectures, or textbook sources." />
          </span>
          <span className="text-[11px] text-[#a4acba] leading-relaxed mt-1 font-sans font-medium">
            AI strictly mirrors your attached materials, mapping unique concepts, structures, and difficulties exactly.
          </span>
        </label>
      </div>

      {/* Pedagogical Presets Row */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
          Select Pedagogical Study Preset
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                  "flex flex-col text-left p-4 border transition-all duration-200 focus-ring cursor-pointer min-h-[140px] justify-between rounded-none",
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground border-glow"
                    : "border-border bg-[#111215] text-[#a4acba] hover:bg-zinc-800/25 hover:text-white"
                )}
              >
                <div>
                  <span className={cn("text-xs font-mono font-bold font-display uppercase tracking-wide", isSelected ? "text-primary font-bold" : "text-white font-semibold")}>
                    {p.name}
                  </span>
                  <span className="text-[10px] leading-snug mt-1.5 block opacity-95 font-sans font-medium text-foreground">
                    {p.desc}
                  </span>
                </div>
                <span className="text-[9px] font-mono block opacity-80 mt-2 border-t border-border/40 pt-1.5 uppercase tracking-wider text-muted-foreground font-semibold">
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
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
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

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Theoretical Card */}
        <button
          type="button"
          onClick={() => setSubjectType("theoretical")}
          className={cn(
            "flex-1 p-6 border text-left flex flex-col justify-between gap-5 transition-all duration-200 focus-ring cursor-pointer rounded-none min-h-[180px]",
            subjectType === "theoretical"
              ? "border-[#4ae176] bg-[var(--tw-hex-4ae176)]/5 border-glow-success"
              : "border-border bg-[#111215] text-[#a4acba] hover:bg-zinc-800/25 hover:text-white"
          )}
        >
          <div className="space-y-2">
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
            "flex-1 p-6 border text-left flex flex-col justify-between gap-5 transition-all duration-200 focus-ring cursor-pointer rounded-none min-h-[180px]",
            subjectType === "technical"
              ? "border-primary bg-primary/5 border-glow"
              : "border-border bg-[#111215] text-[#a4acba] hover:bg-zinc-800/25 hover:text-white"
          )}
        >
          <div className="space-y-2">
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
    <div className="space-y-6 animate-slide-up">
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
          <p className="text-xs text-[#a4acba] leading-relaxed mt-1 font-sans font-medium">
            {presetJustification}
          </p>
        </div>
      </div>

      {/* Question count input well */}
      <div className="p-6 border border-border bg-[#111215] flex flex-col gap-4 rounded-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            className="w-full sm:w-36 bg-[#07080a] border border-border rounded-none px-4 py-3 text-center text-xl font-mono text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all min-h-[44px]"
          />
        </div>

        {/* Preset quick buttons */}
        <div className="border-t border-border/40 pt-4 flex items-center gap-2">
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
                    "text-xs font-mono px-3 py-1.5 border transition-all cursor-pointer rounded-none min-h-[36px]",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold animate-pulse-soft"
                      : "border-border text-[#a4acba] hover:border-border/80 hover:text-white bg-[#07080a]"
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
}

export function Step4PromptBuild({
  topic,
  compiledPrompt,
  promptCopied,
  onCopyPrompt,
}: Step4PromptBuildProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-[#4ae176] uppercase font-bold">
          STEP 04 // GENERATE_PEDAGOGICAL_PROMPT
        </span>
        <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center">
          <span>Your customized learnLM prompt is ready!</span>
          <InfoToolbox content="The copied prompt leverages Google's learning science rules to ensure high-fidelity JSON mapping and fully-populated explanation/hint scaffolding." />
        </h3>
        <p className="text-xs text-[#a4acba] leading-relaxed max-w-2xl font-sans font-medium">
          Copy the generated Socratic instructions below and paste them into your chosen AI service alongside your study materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Services Guide */}
        <div className="p-5 bg-secondary/35 border border-border/80 flex flex-col gap-4 rounded-none">
          <div>
            <span className="text-[10px] font-mono text-[#4ae176] tracking-widest uppercase font-bold">TOP RECOMMENDED SERVICE:</span>
            <h4 className="text-base font-bold text-white mt-1.5">Google NotebookLM (#1 Choice)</h4>
            <p className="text-xs sm:text-sm text-[#d4dae6] leading-relaxed mt-2 font-sans font-medium">
              Simply create a notebook, upload your textbook PDFs or notes as sources, copy this custom prompt, and paste it into the chat box. It will parse your sources with outstanding accuracy and format the JSON.
            </p>
          </div>
          <div className="border-t border-border/40 pt-4">
            <span className="text-[9px] font-mono text-zinc-400 tracking-widest uppercase font-semibold">ALTERNATIVE LLMs:</span>
            <p className="text-xs text-[#a4acba] leading-relaxed mt-2 font-sans font-medium">
              Claude 3.5 Sonnet, Gemini 1.5 Pro, or ChatGPT (GPT-4o). Excellent for following precise schema rules and formatting clean Mermaid diagrams.
            </p>
          </div>
        </div>

        {/* Materials Guide */}
        <div className="p-5 bg-secondary/35 border border-border/80 flex flex-col gap-4 rounded-none justify-between">
          <div>
            <span className="text-[10px] font-mono text-primary tracking-widest uppercase font-bold">MATERIALS TO FEED THE AI:</span>
            <ul className="space-y-2.5 mt-3 text-xs sm:text-sm text-zinc-200 leading-relaxed list-disc list-inside font-sans font-medium">
              <li>Course syllabi or draft curriculum outlines</li>
              <li>Lecture slide PDFs or custom study notes</li>
              <li>Existing question lists or draft databases</li>
              <li>Relevant chapters of textbook pages</li>
            </ul>
          </div>
          <div className="bg-[#15171c] p-4 border border-border text-center">
            <p className="text-xs sm:text-sm font-mono text-zinc-200 font-medium">
              AI prompt will inject topic <span className="text-primary font-bold">"{topic.toUpperCase()}"</span> automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Large copy action well */}
      <div className="p-6 border border-border bg-[#111215] flex flex-col gap-4 rounded-none">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-mono text-white tracking-widest uppercase font-bold">PEDAGOGICAL INSTRUCTIONS PROMPT</span>
          <button
            type="button"
            onClick={() => onCopyPrompt(compiledPrompt)}
            className={cn(
              "text-xs sm:text-sm font-mono font-bold px-5 py-2.5 border transition-all duration-200 focus-ring cursor-pointer rounded-none min-h-[44px] border-glow",
              promptCopied
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/95"
            )}
          >
            <span aria-live="polite">
              {promptCopied ? "✓ COPIED TO CLIPBOARD" : "COPY CUSTOM PROMPT"}
            </span>
          </button>
        </div>
        <div className="relative rounded-none border border-border/60 bg-[#07080a] p-4">
          <textarea
            readOnly
            value={compiledPrompt}
            aria-label="Compiled AI system instructions prompt"
            className="w-full bg-transparent font-mono text-xs sm:text-sm leading-relaxed p-0 text-zinc-300 focus:outline-none focus:ring-0 resize-none h-48 cursor-default selection:bg-primary/25 selection:text-foreground"
          />
        </div>
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
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-1">
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
