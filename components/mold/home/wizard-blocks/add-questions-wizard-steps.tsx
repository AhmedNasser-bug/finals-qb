import React from "react"
import { Check, Copy, FileText, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatLabel, type FullSubjectData } from "@/lib/mold-types"
import { ValidationResult } from "@/lib/subject-persistence"

export interface Step1ContentTypeProps {
  contentType: "questions" | "flashcards" | "both"
  setContentType: (type: "questions" | "flashcards" | "both") => void
  questionCount: number
  setQuestionCount: (count: number) => void
  flashcardCount: number
  setFlashcardCount: (count: number) => void
}

export function Step1ContentType({
  contentType,
  setContentType,
  questionCount,
  setQuestionCount,
  flashcardCount,
  setFlashcardCount,
}: Step1ContentTypeProps) {
  return (
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
  )
}

export interface Step2StyleBiasProps {
  styleBias: "theoretical" | "technical" | "balanced"
  setStyleBias: (bias: "theoretical" | "technical" | "balanced") => void
}

export function Step2StyleBias({ styleBias, setStyleBias }: Step2StyleBiasProps) {
  return (
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
  )
}

export interface Step3CategoryFocusProps {
  categoryFocus: "all" | "existing" | "new"
  setCategoryFocus: (focus: "all" | "existing" | "new") => void
  existingCategories: string[]
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  newCategoryName: string
  setNewCategoryName: (name: string) => void
}

export function Step3CategoryFocus({
  categoryFocus,
  setCategoryFocus,
  existingCategories,
  selectedCategory,
  setSelectedCategory,
  newCategoryName,
  setNewCategoryName,
}: Step3CategoryFocusProps) {
  return (
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
  )
}

export interface Step4CopyPromptProps {
  compiledPrompt: string
  promptCopied: boolean
  handleCopyPrompt: () => void
}

export function Step4CopyPrompt({ compiledPrompt, promptCopied, handleCopyPrompt }: Step4CopyPromptProps) {
  return (
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
  )
}

export interface Step5PasteMergeProps {
  jsonInput: string
  handleJsonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  validationState: "idle" | "validating" | "valid" | "error"
  validationResult: ValidationResult | null
  parsedPreview: FullSubjectData | null
}

export function Step5PasteMerge({
  jsonInput,
  handleJsonChange,
  validationState,
  validationResult,
  parsedPreview,
}: Step5PasteMergeProps) {
  return (
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
              {validationResult.errors.length > 0 && (
                <div className="text-red-400 font-mono text-[11px] space-y-1 bg-red-950/20 border border-red-500/10 p-3">
                  <p className="font-bold uppercase mb-1">Errors ({validationResult.errors.length}):</p>
                  {validationResult.errors.map((err, idx) => (
                    <p key={idx}>• {err}</p>
                  ))}
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="text-amber-400 font-mono text-[11px] space-y-1 bg-amber-950/20 border border-amber-500/10 p-3">
                  <p className="font-bold uppercase mb-1">Auto-Fix Warnings ({validationResult.warnings.length}):</p>
                  {validationResult.warnings.map((warn, idx) => (
                    <p key={idx}>• {warn}</p>
                  ))}
                </div>
              )}

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
  )
}
