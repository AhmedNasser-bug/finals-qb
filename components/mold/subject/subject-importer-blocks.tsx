import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { StatChip } from "@/components/mold/subject/subject-importer-components";
import type { FullSubjectData } from "@/lib/mold-types";
import type { ValidationResult } from "@/lib/subject-persistence";
import type { ImporterState } from "./subject-importer";
import {
  SubjectPromptBuilder,
  PEDAGOGICAL_PRESETS,
  type PersonaType,
  type ScaffoldingType,
  type FormatOption,
} from "@/lib/prompt-builder";

interface AIPromptSectionProps {
  promptCopied: boolean;
  onCopyPrompt: (promptText: string) => void;
}

export function AIPromptSection({
  promptCopied,
  onCopyPrompt,
}: AIPromptSectionProps) {
  const [topic, setTopic] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("finals_prep");
  const [persona, setPersona] = useState<PersonaType>("designer");
  const [scaffolding, setScaffolding] = useState<ScaffoldingType[]>([
    "metacognitive",
    "cognitive_load",
  ]);
  const [formats, setFormats] = useState<FormatOption[]>(["html", "diagrams"]);
  const [questionCount, setQuestionCount] = useState(30);
  const [useReferenceBank, setUseReferenceBank] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showRawPrompt, setShowRawPrompt] = useState(false);

  // ── Apply Preset ────────────────────────────────────────────────────────────
  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === "custom") return;

    const preset = PEDAGOGICAL_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setPersona(preset.config.persona);
      setScaffolding(preset.config.scaffolding);
      setFormats(preset.config.formats);
      setQuestionCount(preset.config.questionCount);
      setUseReferenceBank(preset.config.useReferenceBank);
    }
  };

  // ── Custom Option Modifiers ──────────────────────────────────────────────────
  const handlePersonaChange = (newPersona: PersonaType) => {
    setPersona(newPersona);
    setSelectedPreset("custom");
  };

  const handleScaffoldingToggle = (type: ScaffoldingType) => {
    setSelectedPreset("custom");
    setScaffolding((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleFormatToggle = (option: FormatOption) => {
    setSelectedPreset("custom");
    setFormats((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  // ── Build Prompt Live using Builder Pattern ─────────────────────────────────
  const compiledPrompt = useMemo(() => {
    const builder = new SubjectPromptBuilder();
    builder.setTopic(topic || "[YOUR TOPIC HERE]");
    builder.setPersona(persona);
    builder.setQuestionCount(questionCount);
    builder.setUseReferenceBank(useReferenceBank);

    builder.toggleScaffolding(
      "socratic_nudge",
      scaffolding.includes("socratic_nudge"),
    );
    builder.toggleScaffolding(
      "metacognitive",
      scaffolding.includes("metacognitive"),
    );
    builder.toggleScaffolding(
      "cognitive_load",
      scaffolding.includes("cognitive_load"),
    );

    builder.toggleFormat("diagrams", formats.includes("diagrams"));
    builder.toggleFormat("html", formats.includes("html"));

    return builder.build();
  }, [topic, persona, scaffolding, formats, questionCount, useReferenceBank]);

  // Get active preset's hint message
  const activePresetHint = useMemo(() => {
    if (selectedPreset === "custom") {
      return "Custom configuration: select your preferred persona and pedagogical blocks below.";
    }
    return PEDAGOGICAL_PRESETS.find((p) => p.id === selectedPreset)?.hint || "";
  }, [selectedPreset]);

  return (
    <div className="flex flex-col gap-3 rounded border border-border bg-panel p-4">
      {/* Header and Title */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-mono font-semibold tracking-widest uppercase text-foreground">
          Step 1 — Build Pedagogical Prompt
        </h3>
        <p className="text-[11px] text-muted-foreground leading-normal">
          Customize standard-aligned system prompts optimized with Google's
          **LearnLM** learning science rules.
        </p>
      </div>

      {/* 1. Configuration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
        {/* Subject Topic Input */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="prompt-topic"
            className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center justify-between"
          >
            <span>1. Topic / Domain</span>
            <span className="text-[9px] text-primary lowercase tracking-normal font-normal">
              * injects theme automatically
            </span>
          </label>
          <input
            id="prompt-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., World War II, Data Structures, Human Anatomy..."
            className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-foreground font-mono placeholder:text-muted-foreground/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all"
          />
        </div>

        {/* Question Count Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="prompt-count"
            className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase flex items-center justify-between"
          >
            <span>Questions</span>
            <span className="text-[9px] text-[#fecc17] font-mono lowercase">
              threshold
            </span>
          </label>
          <input
            id="prompt-count"
            type="number"
            min={1}
            max={500}
            value={questionCount}
            onChange={(e) => {
              setQuestionCount(Math.max(1, parseInt(e.target.value) || 0));
              setSelectedPreset("custom");
            }}
            className="w-full bg-background border border-border rounded px-3 py-2 text-xs text-foreground font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-all"
          />
          {/* Question Count presets buttons */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {[20, 40, 80, 120].map((num) => {
              const isSelected = questionCount === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setQuestionCount(num);
                    setSelectedPreset("custom");
                  }}
                  className={cn(
                    "text-[9px] font-mono px-2 py-0.5 border transition-colors cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold animate-pulse-soft"
                      : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground bg-secondary/10",
                  )}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reference Syllabus Checkbox Toggle */}
      <div className="bg-background/25 border border-border/40 p-2.5 rounded flex items-start gap-2.5 hover:bg-background/45 transition-colors">
        <input
          id="prompt-ref-bank"
          type="checkbox"
          checked={useReferenceBank}
          onChange={(e) => {
            setUseReferenceBank(e.target.checked);
            setSelectedPreset("custom");
          }}
          className="accent-primary mt-0.5 w-3.5 h-3.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        />
        <label
          htmlFor="prompt-ref-bank"
          className="flex flex-col cursor-pointer text-left"
        >
          <span className="text-[10px] font-mono font-bold uppercase text-foreground leading-tight">
            Align with Attached Question Bank / Syllabus
          </span>
          <span className="text-[8px] font-mono text-muted-foreground leading-normal mt-0.5">
            AI strictly mirrors your attached documents, mapping their unique
            concepts, structures, and formatting details to our JSON schema.
          </span>
        </label>
      </div>

      {/* 2. Preset Selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
          2. Select Study Preset
        </span>
        <div
          role="radiogroup"
          aria-label="Pedagogical Presets"
          className="grid grid-cols-2 sm:grid-cols-5 gap-2"
        >
          {PEDAGOGICAL_PRESETS.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handlePresetSelect(p.id)}
                className={cn(
                  "flex flex-col text-left p-2.5 rounded border transition-all duration-150 relative overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-panel",
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground border-glow"
                    : "border-border bg-background/50 hover:bg-background/80 text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-xs font-mono font-bold">{p.name}</span>
                <span className="text-[9px] leading-tight mt-1 opacity-80">
                  {p.description}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            role="radio"
            aria-checked={selectedPreset === "custom"}
            onClick={() => handlePresetSelect("custom")}
            className={cn(
              "flex flex-col text-left p-2.5 rounded border transition-all duration-150 relative overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-panel",
              selectedPreset === "custom"
                ? "border-primary bg-primary/5 text-foreground border-glow"
                : "border-border bg-background/50 hover:bg-background/80 text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="text-xs font-mono font-bold">Custom Blocks</span>
            <span className="text-[9px] leading-tight mt-1 opacity-80">
              Toggle custom pedagogical rules.
            </span>
          </button>
        </div>

        {/* Preset Description / Hint */}
        <div className="rounded-sm border border-border/40 bg-background/30 px-3 py-2 mt-0.5">
          <p className="text-[10px] text-muted-foreground leading-relaxed italic flex items-start gap-1.5">
            <span className="text-primary font-mono select-none">ℹ</span>
            {activePresetHint}
          </p>
        </div>
      </div>

      {/* Collapsible Advanced Customization Section */}
      <div className="border-t border-border/40 pt-2.5">
        <button
          type="button"
          aria-expanded={showAdvanced}
          {...(showAdvanced
            ? { "aria-controls": "advanced-pedagogical-blocks" }
            : {})}
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground tracking-wider uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1"
        >
          <span>
            {showAdvanced ? "▼ Hide" : "▶ Show"} Advanced Pedagogical Blocks
          </span>
        </button>

        {showAdvanced && (
          <div
            id="advanced-pedagogical-blocks"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 p-3 bg-background/30 border border-border/40 rounded animate-slide-up"
          >
            {/* Persona Block */}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-[10px] font-mono font-bold text-primary tracking-wider uppercase">
                A. AI Persona
              </legend>
              <div className="flex flex-col gap-1.5">
                {[
                  {
                    id: "socratic",
                    name: "Socratic Tutor",
                    desc: "Warm Socratic guides",
                  },
                  {
                    id: "designer",
                    name: "Curriculum Expert",
                    desc: "Critical thinking priority",
                  },
                  {
                    id: "explorer",
                    name: "Concept Explorer",
                    desc: "Analogy-focused explorer",
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 text-[11px] cursor-pointer hover:text-foreground transition-colors",
                      persona === item.id
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    <input
                      type="radio"
                      name="persona-selection"
                      checked={persona === item.id}
                      onChange={() =>
                        handlePersonaChange(item.id as PersonaType)
                      }
                      className="accent-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-[8px] font-mono opacity-60 font-normal leading-none mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Scaffolding Logic Group */}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-[10px] font-mono font-bold text-primary tracking-wider uppercase">
                B. Learning Science Rules
              </legend>
              <div className="flex flex-col gap-2">
                {[
                  {
                    id: "socratic_nudge",
                    name: "Socratic Nudges",
                    desc: "Hints guide instead of telling solutions",
                  },
                  {
                    id: "metacognitive",
                    name: "Metacognitive Explanations",
                    desc: "Details why correct & logical distractors",
                  },
                  {
                    id: "cognitive_load",
                    name: "Manage Cognitive Load",
                    desc: "Shorter sentences & simple vocabulary",
                  },
                ].map((item) => {
                  const isChecked = scaffolding.includes(
                    item.id as ScaffoldingType,
                  );
                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "flex items-start gap-2 text-[11px] cursor-pointer hover:text-foreground transition-colors",
                        isChecked
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleScaffoldingToggle(item.id as ScaffoldingType)
                        }
                        className="accent-primary mt-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-[8px] font-mono opacity-60 font-normal leading-tight mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Format Toggles */}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-[10px] font-mono font-bold text-primary tracking-wider uppercase">
                C. Formatting & Visuals
              </legend>
              <div className="flex flex-col gap-2">
                {[
                  {
                    id: "diagrams",
                    name: "Mermaid Diagrams",
                    desc: "Generates flowcharts & state diagrams",
                  },
                  {
                    id: "html",
                    name: "HTML Rich Text",
                    desc: "Allows HTML codes & styling in questions",
                  },
                ].map((item) => {
                  const isChecked = formats.includes(item.id as FormatOption);
                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "flex items-start gap-2 text-[11px] cursor-pointer hover:text-foreground transition-colors",
                        isChecked
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleFormatToggle(item.id as FormatOption)
                        }
                        className="accent-primary mt-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-[8px] font-mono opacity-60 font-normal leading-tight mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>
        )}
      </div>

      {/* Copy CTA Button and Live Code Drawer */}
      <div className="flex flex-col gap-2 border-t border-border/40 pt-3 mt-1">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={showRawPrompt}
            {...(showRawPrompt
              ? { "aria-controls": "raw-prompt-container" }
              : {})}
            onClick={() => setShowRawPrompt((prev) => !prev)}
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground tracking-wider uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1"
          >
            {showRawPrompt ? "[-] Hide Raw Prompt" : "[+] Show Raw Prompt"}
          </button>

          <button
            type="button"
            onClick={() => onCopyPrompt(compiledPrompt)}
            title="Copy customized pedagogical prompt"
            className={cn(
              "text-xs font-mono font-semibold tracking-wider uppercase px-4 py-2 rounded border transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-panel border-glow",
              promptCopied
                ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/95",
            )}
          >
            <span aria-live="polite">
              {promptCopied ? "✓ Copied to Clipboard" : "Copy Custom Prompt"}
            </span>
          </button>
        </div>

        {/* scrollable prompt box */}
        {showRawPrompt && (
          <div
            id="raw-prompt-container"
            className="relative rounded border border-border/60 bg-background p-3 animate-slide-up"
          >
            <textarea
              readOnly
              value={compiledPrompt}
              aria-label="Compiled AI system instructions prompt"
              className="w-full bg-transparent font-mono text-[10px] leading-relaxed p-0 text-muted-foreground focus:outline-none focus:ring-0 resize-none h-44 cursor-default selection:bg-primary/20 selection:text-foreground"
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface DropZoneSectionProps {
  json: string;
  state: ImporterState;
  isDragging: boolean;
  onPaste: () => void;
  onChange: (value: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function DropZoneSection({
  json,
  state,
  isDragging,
  onPaste,
  onChange,
  onDragOver,
  onDragLeave,
  onDrop,
}: DropZoneSectionProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          Step 2 — Paste JSON
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onPaste}
            disabled={state === "pasting"}
            title={
              state === "pasting"
                ? "Currently pasting data..."
                : "Paste JSON from clipboard"
            }
            className={cn(
              "text-xs font-mono px-5 py-2.5 rounded-none border font-semibold tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] cursor-pointer",
              state === "pasting"
                ? "border-primary/50 bg-primary/10 text-primary opacity-60 cursor-wait"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.01]",
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
          "relative rounded-none border p-6 min-h-[180px] transition-all duration-300 ease-out flex flex-col items-center justify-center bg-[#07080a]",
          isDragging
            ? "border-primary bg-primary/5 border-glow"
            : state === "valid"
              ? "border-emerald-500/40 bg-emerald-500/5 border-glow-success"
              : state === "error"
                ? "border-destructive/40 bg-destructive/5 border-glow-danger"
                : "border-border hover:border-zinc-700/80",
        )}
      >
        {json ? (
          <textarea
            value={json}
            aria-label="Paste JSON subject data here"
            {...(state === "error" ? { "aria-invalid": "true" as const } : {})}
            onChange={(e) => onChange(e.target.value)}
            placeholder="JSON pasted here..."
            spellCheck={false}
            className="w-full bg-transparent font-mono text-xs p-0 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 resize-none h-56 leading-relaxed"
          />
        ) : (
          <div className="text-center pointer-events-none flex flex-col items-center gap-2.5 py-6">
            <svg
              className="w-8 h-8 text-zinc-500 animate-pulse-soft mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            <p className="text-xs font-mono text-foreground font-semibold tracking-wider uppercase">
              DRAG & DROP SUBJECT FILE
            </p>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Drop a subject `.json` file here or click the{" "}
              <span className="text-primary font-bold">PASTE</span> button at
              the top to load from your clipboard.
            </p>
          </div>
        )}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-none border-2 border-dashed border-primary bg-primary/10 pointer-events-none border-glow">
            <span className="text-sm font-mono text-primary font-bold">
              DROP FILE TO LOAD
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export interface ValidationFeedbackSectionProps {
  state: ImporterState;
  result: ValidationResult | null;
  preview: FullSubjectData | null;
  questionCount: number;
  flashcardCount: number;
  categories: string[];
  json: string;
  onChange: (text: string) => void;
}

export function ValidationFeedbackSection({
  state,
  result,
  preview,
  questionCount,
  flashcardCount,
  categories,
  json,
  onChange,
}: ValidationFeedbackSectionProps) {
  // 1. Position-based parsing error extractor (raw specimen only, no interactive elements)
  const parseErrorInfo = useMemo(() => {
    if (!result || result.valid || result.errors.length === 0) return null;
    const firstErr = result.errors[0];
    if (!firstErr.includes("JSON parse error")) return null;

    // Extract position
    const posMatch = firstErr.match(/at position (\d+)/);
    if (!posMatch)
      return { message: firstErr, position: -1, snippet: "", arrow: "" };

    const pos = parseInt(posMatch[1]);
    if (isNaN(pos) || pos < 0 || pos > json.length) {
      return { message: firstErr, position: -1, snippet: "", arrow: "" };
    }

    const start = Math.max(0, pos - 40);
    const end = Math.min(json.length, pos + 40);
    const snippet = json.slice(start, end);
    const arrow = " ".repeat(pos - start) + "▲ ERROR LOCATION";

    return { message: firstErr, position: pos, snippet, arrow };
  }, [result, json]);

  return (
    <div aria-live="polite" className="flex flex-col gap-4">
      {state === "error" && result && (
        <div className="flex flex-col gap-4 rounded border border-destructive/30 bg-destructive/5 p-4 animate-slide-up">
          <div className="space-y-1">
            <p className="text-xs font-mono font-semibold text-destructive tracking-wide uppercase">
              Validation Failed — {result.errors.length} error
              {result.errors.length !== 1 ? "s" : ""}
            </p>
            <p className="text-[11px] text-[#a4acba] leading-normal font-sans">
              Review schema errors below. Use the automated parser diagnostics
              to resolve issues.
            </p>
          </div>

          {/* Standard Errors List */}
          <ul className="flex flex-col gap-1.5 border-b border-border/40 pb-3">
            {result.errors.map((err, i) => (
              <li
                key={i}
                className="text-xs text-destructive/80 leading-relaxed flex gap-2"
              >
                <span className="font-mono shrink-0 text-destructive/50">
                  {i + 1}.
                </span>
                {err}
              </li>
            ))}
          </ul>

          {/* Diagnostics & Snippet Extractor */}
          {parseErrorInfo && parseErrorInfo.snippet && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">
                Error Context Specimen (around position{" "}
                {parseErrorInfo.position}):
              </span>
              <pre className="p-3 bg-[#07080a] border border-border text-[11px] font-mono text-zinc-300 rounded overflow-x-auto whitespace-pre selection:bg-primary/20">
                <code>
                  {parseErrorInfo.snippet}
                  {"\n"}
                  <span className="text-destructive font-bold">
                    {parseErrorInfo.arrow}
                  </span>
                </code>
              </pre>
            </div>
          )}
        </div>
      )}

      {result?.warnings && result.warnings.length > 0 && (
        <div className="flex flex-col gap-1 rounded border border-amber-400/30 bg-amber-400/5 p-3 animate-slide-up">
          <p className="text-xs font-mono font-semibold text-amber-400 tracking-wide uppercase">
            {result.warnings.length} Automated Fix
            {result.warnings.length !== 1 ? "es" : ""} / Adjustment
            {result.warnings.length !== 1 ? "s" : ""} Applied
          </p>
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
            {result.warnings.map((w, i) => (
              <p
                key={i}
                className="text-xs text-amber-400/70 leading-relaxed flex gap-1.5 items-start"
              >
                <span className="text-amber-400 shrink-0 select-none">⚡</span>
                <span>{w}</span>
              </p>
            ))}
          </div>
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
              <p className="text-base font-semibold text-foreground">
                {preview.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {preview.config.description}
              </p>
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
  );
}
