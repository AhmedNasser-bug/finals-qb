// MOLD V2 — Pedagogical Prompt Builder (LearnLM Infused)

export type PersonaType = "socratic" | "designer" | "explorer"
export type ScaffoldingType = "socratic_nudge" | "metacognitive" | "cognitive_load"
export type FormatOption = "diagrams" | "html"
export type ResourceOutput = "mcq_tf" | "flashcards" | "terminology"

export interface PromptBuilderConfig {
  topic: string
  persona: PersonaType
  scaffolding: ScaffoldingType[]
  formats: FormatOption[]
  outputs: ResourceOutput[]
  questionCount: number
  useReferenceBank: boolean
}

// ─── Custom Pedagogical Presets ───────────────────────────────────────────────
export interface Preset {
  id: string
  name: string
  description: string
  hint: string
  config: Omit<PromptBuilderConfig, "topic">
}

export const PEDAGOGICAL_PRESETS: Preset[] = [
  {
    id: "finals_prep",
    name: "Finals Preparation",
    description: "High-rigor focus with cognitive support.",
    hint: "Optimized for exam prep: curriculum designer persona, minimum 30 questions, Socratic scaffolding, diagrams, and HTML tables.",
    config: {
      persona: "designer",
      scaffolding: ["metacognitive", "cognitive_load"],
      formats: ["html", "diagrams"],
      outputs: ["mcq_tf", "terminology"],
      questionCount: 30,
      useReferenceBank: true
    }
  },
  {
    id: "concept_journey",
    name: "Concept Journey",
    description: "Deep exploration of complex ideas.",
    hint: "Optimized for deep conceptual clarity: explorer persona, 20 questions, Socratic hints, visual Mermaid diagrams, and active recall flashcards.",
    config: {
      persona: "explorer",
      scaffolding: ["socratic_nudge", "metacognitive"],
      formats: ["html", "diagrams"],
      outputs: ["mcq_tf", "flashcards"],
      questionCount: 20,
      useReferenceBank: true
    }
  },
  {
    id: "quick_drill",
    name: "Quick Drill",
    description: "Rapid active recall and verification.",
    hint: "Optimized for quick active testing: Socratic tutor, 10 questions, cognitive load management, HTML layouts, and flashcards.",
    config: {
      persona: "socratic",
      scaffolding: ["socratic_nudge", "cognitive_load"],
      formats: ["html", "diagrams"],
      outputs: ["mcq_tf", "flashcards", "terminology"],
      questionCount: 10,
      useReferenceBank: true
    }
  },
  {
    id: "full_revision",
    name: "Full Revision",
    description: "Exhaustive syllabus coverage.",
    hint: "Optimized for full subject coverage: curriculum designer persona, 120 questions, Metacognitive scaffolding, diagrams, and HTML tables.",
    config: {
      persona: "designer",
      scaffolding: ["metacognitive", "cognitive_load"],
      formats: ["html", "diagrams"],
      outputs: ["mcq_tf", "flashcards", "terminology"],
      questionCount: 120,
      useReferenceBank: true
    }
  }
]

// ─── Prompt Builder Pattern Implementation ────────────────────────────────────

export class SubjectPromptBuilder {
  private topic: string = "[YOUR TOPIC HERE]"
  private persona: PersonaType = "socratic"
  private scaffolding: Set<ScaffoldingType> = new Set(["socratic_nudge"])
  private formats: Set<FormatOption> = new Set(["html", "diagrams"])
  private outputs: Set<ResourceOutput> = new Set(["mcq_tf"])
  private questionCount: number = 30
  private useReferenceBank: boolean = true

  setTopic(topic: string) {
    if (topic.trim()) this.topic = topic.trim()
    return this
  }

  setPersona(persona: PersonaType) {
    this.persona = persona
    return this
  }

  setQuestionCount(count: number) {
    if (count > 0) this.questionCount = count
    return this
  }

  setUseReferenceBank(use: boolean) {
    this.useReferenceBank = use
    return this
  }

  toggleScaffolding(type: ScaffoldingType, enabled: boolean) {
    if (enabled) {
      this.scaffolding.add(type)
    } else {
      this.scaffolding.delete(type)
    }
    return this
  }

  toggleFormat(option: FormatOption, enabled: boolean) {
    if (enabled) {
      this.formats.add(option)
    } else {
      this.formats.delete(option)
    }
    return this
  }

  toggleOutput(resource: ResourceOutput, enabled: boolean) {
    if (enabled) {
      this.outputs.add(resource)
    } else {
      this.outputs.delete(resource)
    }
    return this
  }

  applyPreset(preset: Omit<PromptBuilderConfig, "topic">) {
    this.persona = preset.persona
    this.scaffolding = new Set(preset.scaffolding)
    this.formats = new Set(preset.formats)
    this.outputs = new Set(preset.outputs)
    this.questionCount = preset.questionCount
    this.useReferenceBank = preset.useReferenceBank
    return this
  }

  build(): string {
    const parts: string[] = []

    // 1. PARTS: Persona
    parts.push(this.buildPersonaBlock())

    // 2. PARTS: Act & Recipient
    parts.push(
      `Act: Design a comprehensive, inquiry-based dataset for learning.\n` +
      `Recipient: For learners who need high-quality practice and scaffolding to stimulate curiosity and deepen metacognition.`
    )

    // 3. PARTS: Theme
    parts.push(`Theme: ${this.topic}`)

    // 4. PARTS: Structure & Rules
    parts.push(
      `Structure: Generate ONLY a single raw JSON object. No markdown, no code fences, no surrounding explanation — just the JSON.\n\n` +
      `The JSON structure MUST follow this exact schema:\n` +
      `{\n` +
      `  "id": "kebab-case-id",\n` +
      `  "name": "${this.topic}",\n` +
      `  "config": {\n` +
      `    "title": "${this.topic} Mastery",\n` +
      `    "description": "One sentence summary detailing the pedagogical goal of this subject.",\n` +
      `    "version": "1.0"\n` +
      `  },\n` +
      `  "questions": [\n` +
      `    {\n` +
      `      "id": "q1",\n` +
      `      "type": "MCQ" or "TrueFalse",\n` +
      `      "difficulty": "Easy" or "Medium" or "Hard",\n` +
      `      "category": "category-slug",\n` +
      `      "question": "The question text (HTML supported — see FORMATTING RULES).",\n` +
      (this.formats.has("diagrams")
        ? `      "diagram": "Optional. Raw Mermaid diagram source code string (see DIAGRAM RULES). Omit field entirely if no diagram.",\n` +
          `      "diagramPosition": "right",\n`
        : "") +
      `      "options": [\n` +
      `        { "label": "A", "text": "Option A" },\n` +
      `        { "label": "B", "text": "Option B" },\n` +
      `        { "label": "C", "text": "Option C" },\n` +
      `        { "label": "D", "text": "Option D" }\n` +
      `      ],\n` +
      `      "answer": "A",\n` +
      `      "explanation": "Why correct. (See pedagogical instructions below)",\n` +
      `      "hint": "A guiding nudge. (See pedagogical instructions below)"\n` +
      `    }\n` +
      `  ],\n` +
      `  "flashcards": [\n` +
      `    { "id": "f1", "term": "Key Concept", "definition": "Clear definition", "category": "category-slug" }\n` +
      `  ],\n` +
      `  "terminology": {\n` +
      `    "category-slug": [{ "term": "Term", "definition": "Definition" }]\n` +
      `  },\n` +
      `  "achievements": [\n` +
      `    { "id": "ach-1", "title": "Bronze Medal", "description": "Complete 1 run", "icon": "Zap", "condition": { "type": "runs_gte", "value": 1 } }\n` +
      `  ]\n` +
      `}`
    )

    // 5. Scaffolding & Pedagogical Instructions
    parts.push(this.buildScaffoldingBlock())

    // 6. Formatting Guidelines
    parts.push(this.buildFormattingBlock())

    // 7. Reference Document constraints
    if (this.useReferenceBank) {
      parts.push(
        `REFERENCE DOCUMENT CONSTRAINTS:\n` +
        `If the user has attached, pasted, or uploaded an existing question bank, syllabus, course notes, reference textbook pages, or draft database file, you MUST strictly use its key concepts, terminology definitions, structure, difficulty grading, and formatting styles as your primary source of truth. Ensure all generated questions, flashcards, and achievements map perfectly to these source concepts while matching our requested JSON schema rules.`
      )
    }

    // 8. General Dataset Constraints
    parts.push(
      `CRITICAL GENERAL REQUIREMENTS:\n` +
      `- Generate EXACTLY ${this.questionCount} unique, high-quality, comprehensive questions.\n` +
      `- MCQ questions: exactly 4 options (A, B, C, D)\n` +
      `- TrueFalse questions: exactly 2 options (A=True, B=False)\n` +
      `- Include a substantial amount of questions, flashcards, and achievements to provide thorough practice.\n` +
      `- Ensure varying levels of difficulty (Easy, Medium, Hard).\n` +
      `- Spread questions across distinct categories.\n` +
      `- All ids must be unique and kebab-case.\n` +
      `- No duplicate question text.\n` +
      `- Every category slug used in questions must exist in terminology.\n` +
      `- All questions MUST have both explanation and hint fields populated.`
    )

    // 9. Achievements List
    parts.push(
      `ACHIEVEMENT CONDITION TYPES:\n` +
      `- "runs_gte": { "type": "runs_gte", "value": N } — Complete N runs\n` +
      `- "accuracy_gte": { "type": "accuracy_gte", "value": 85 } — Score 85%+ accuracy\n` +
      `- "streak_gte": { "type": "streak_gte", "value": 15 } — 15-question streak\n` +
      `- "mode_complete": { "type": "mode_complete", "mode": "speedrun" } — Complete this mode\n` +
      `- "speedrun_under": { "type": "speedrun_under", "mode": "speedrun", "seconds": 300 } — Under time limit\n` +
      `- "no_hints": { "type": "no_hints", "mode": "hardcore" } — Mode without hints\n` +
      `- "all_categories": { "type": "all_categories" } — Practice every category\n` +
      `- "all_unlocked": { "type": "all_unlocked" } — Unlock all other achievements`
    )

    // 10. Compactness
    parts.push(
      `CRITICAL — OUTPUT COMPACTNESS:\n` +
      `The JSON output will be encoded into shareable URLs. To maximize shareability, generate the JSON with:\n` +
      `- NO extra whitespace or indentation — output single-line, no spaces between tokens\n` +
      `- NO unnecessary fields or null values\n` +
      `- Short but descriptive strings (concise terminology definitions, brief hints)\n` +
      `Output the complete JSON object on a single line (no formatting).`
    )

    return parts.join("\n\n")
  }

  private buildPersonaBlock(): string {
    const defaultHead = "You are a pedagogical expert and curriculum designer."
    switch (this.persona) {
      case "designer":
        return `${defaultHead} Persona: You act as a senior curriculum designer and academic assessment designer. Your tone is professional, precise, and highly analytical. You design standards-aligned question banks focused on testing critical thinking, conceptual application, and deep comprehension rather than simple rote memorization.`
      case "explorer":
        return `${defaultHead} Persona: You act as a concept explorer and scientific communicator. Your tone is inspiring, accessible, and energetic. You specialize in demystifying abstract, complex theories using vivid, real-world analogies, practical scenarios, and relatable stories that bridge academic concepts with real-world applications.`
      case "socratic":
      default:
        return `${defaultHead} Persona: You act as an expert Socratic tutor dedicated to building deep conceptual intuition. Your tone is warm, encouraging, supportive, and intensely curious. You never supply answers directly; instead, you scaffold learning by asking guided questions and helping students navigate their own productive struggles.`
    }
  }

  private buildScaffoldingBlock(): string {
    const instructions: string[] = ["PEDAGOGICAL STRATEGIES & SCAFFOLDING INSTRUCTIONS:"]

    if (this.scaffolding.has("socratic_nudge")) {
      instructions.push(
        `- Socratic Guiding Nudges (Hints): For every question's "hint" field, formulate a gentle Socratic nudge. Break down the core complexity of the problem, but stop just short of revealing the solution. Ask a targeted, guiding question that directs the student's attention to the key underlying mechanism.`
      )
    } else {
      instructions.push(
        `- Question Hints: Provide a clear, supportive hint that simplifies the question without giving away the direct answer.`
      )
    }

    if (this.scaffolding.has("metacognitive")) {
      instructions.push(
        `- Metacognitive Explanations: When writing question "explanation" fields, do not just state what the correct option is. Explicitly detail the logical reasoning process behind why it is correct and why the distractors are incorrect. Address common student misconceptions and prompt them to reflect on their own strategies.`
      )
    } else {
      instructions.push(
        `- Question Explanations: Explain why the correct option is the right choice clearly and directly.`
      )
    }

    if (this.scaffolding.has("cognitive_load")) {
      instructions.push(
        `- Cognitive Load Management: Structure all text definitions, flashcards, and explanations to be highly digestible. Use concise bullet points, simple vocabulary, short sentences, and logical conceptual sequences to avoid overwhelming the learner.`
      )
    }

    return instructions.join("\n")
  }

  private buildFormattingBlock(): string {
    const formatting: string[] = ["FORMATTING & VISUAL LAYOUT GUIDELINES:"]

    if (this.formats.has("html")) {
      formatting.push(
        `- HTML Rich Text: The "question" field supports HTML for rich text formatting. You are highly encouraged to use inline styles (color, font-weight), <br>, <i>, <b>, <code>, <pre>, and HTML tables to format question text and organize comparative data.`
      )
    } else {
      formatting.push(
        `- Plain Text: Keep the question text clean, simple, and primarily plain text. Avoid complex HTML elements.`
      )
    }

    if (this.formats.has("diagrams")) {
      formatting.push(
        `- Mermaid Visual Diagrams: To include a visual diagram with a question, add a "diagram" field containing raw Mermaid source code as a plain string. Supported diagram types: graph, flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, erDiagram, gantt, pie, gitGraph, mindmap, timeline.\n` +
        `When "diagram" is present, the question card enters a two-column split layout. The diagram string must be valid Mermaid syntax. Do not wrap it in code fences or quotes — write the raw syntax directly as the field value. Use \\n for line breaks within the diagram string value in JSON. Do not include script or HTML tags inside the diagram.`
      )
    }

    return formatting.join("\n")
  }
}
