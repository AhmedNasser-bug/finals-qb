import type { FullSubjectData, SubjectData, CategoryData } from "../types/mold-types"
import { deriveCategoriesFromSubject } from "./subject-store"

// ─── Storage key ──────────────────────────────────────────────────────────────
const SUBJECTS_KEY = "mold_v2_subjects"

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  subject?: FullSubjectData
}

/**
 * Validates a parsed JSON object against the FullSubjectData contract.
 * Returns detailed field-level errors so the UI can display actionable feedback.
 * Does NOT throw — always returns a ValidationResult.
 *
 * LEGACY COMPATIBILITY — the following are normalised automatically (warning, not error):
 *   - flashcards with "front"/"back" keys  → remapped to "term"/"definition"
 *   - flashcards missing "category"        → defaulted to "_general"
 *   - terminology as flat { term: string } → lifted to { _general: [{term, definition}] }
 *   - achievements missing "icon"          → defaulted to "Award"
 *   - achievements missing "condition"     → defaulted to { type: "runs_gte", value: 1 }
 *   - achievements with unknown cond type  → condition reset to runs_gte:1 (warning only)
 */

// ─── Validation Helpers ───────────────────────────────────────────────────────

function normalizeFlashcards(obj: Record<string, unknown>, warnings: string[]) {
  if (!Array.isArray(obj.flashcards)) return;

  let legacyKeys = false
  const newFlashcards = new Array(obj.flashcards.length)
  for (let i = 0; i < obj.flashcards.length; i++) {
    const fc = obj.flashcards[i]
    if (typeof fc !== "object" || fc === null) {
      newFlashcards[i] = fc
      continue
    }
    const card = { ...(fc as Record<string, unknown>) }
    if ("front" in card && !("term" in card)) {
      card.term = card.front
      delete card.front
      legacyKeys = true
    }
    if ("back" in card && !("definition" in card)) {
      card.definition = card.back
      delete card.back
      legacyKeys = true
    }
    if (typeof card.category !== "string" || card.category.trim() === "") {
      card.category = "_general"
    }
    newFlashcards[i] = card
  }
  obj.flashcards = newFlashcards
  if (legacyKeys) {
    warnings.push('"flashcards": legacy "front"/"back" keys remapped to "term"/"definition".')
  }
}

function normalizeTerminology(obj: Record<string, unknown>, warnings: string[]) {
  if (obj.terminology === undefined) return;

  if (
    typeof obj.terminology !== "object" ||
    obj.terminology === null ||
    Array.isArray(obj.terminology)
  ) {
    obj.terminology = {}
  }

  const termObj = obj.terminology as Record<string, unknown>
  if (Object.keys(termObj).length > 0) {
    const firstVal = Object.values(termObj)[0]
    if (typeof firstVal === "string") {
      // Entire map is flat strings — lift into a single _general bucket
      const entries = Object.entries(termObj)
      const lifted = new Array(entries.length)
      for (let i = 0; i < entries.length; i++) {
        lifted[i] = {
          term: entries[i][0],
          definition: entries[i][1] as string,
        }
      }
      obj.terminology = { _general: lifted }
      warnings.push('"terminology": legacy flat {term: string} format normalised to nested category arrays.')
    }
  }

  // Auto-generate empty terminology keys for any categories used by questions
  if (Array.isArray(obj.questions)) {
    const termDict = obj.terminology as Record<string, unknown>
    obj.questions.forEach((q: any) => {
      if (q && typeof q.category === "string" && q.category.trim() !== "") {
        const cat = q.category.trim()
        if (!Array.isArray(termDict[cat])) {
          termDict[cat] = []
        }
      }
    })
  }
}

function normalizeAchievements(obj: Record<string, unknown>, warnings: string[]) {
  const VALID_CONDITION_TYPES = new Set([
    "accuracy_gte", "streak_gte", "mode_complete", "speedrun_under",
    "no_hints", "all_categories", "runs_gte", "all_unlocked",
  ])
  if (!Array.isArray(obj.achievements)) return;

  let missingIcons = 0
  let missingConditions = 0
  let unknownCondTypes = 0
  const newAchievements = new Array(obj.achievements.length)
  for (let i = 0; i < obj.achievements.length; i++) {
    const ach = obj.achievements[i]
    if (typeof ach !== "object" || ach === null) {
      newAchievements[i] = ach
      continue
    }
    const a = { ...(ach as Record<string, unknown>) }
    // Default icon
    if (typeof a.icon !== "string" || a.icon.trim() === "") {
      a.icon = "Award"
      missingIcons++
    }
    // Default / fix condition
    if (typeof a.condition !== "object" || a.condition === null) {
      a.condition = { type: "runs_gte", value: 1 }
      missingConditions++
      newAchievements[i] = a
      continue
    }

    const cond = { ...(a.condition as Record<string, unknown>) }
    if (typeof cond.type !== "string" || !VALID_CONDITION_TYPES.has(cond.type)) {
      cond.type = "runs_gte"
      cond.value = 1
      unknownCondTypes++
    }
    a.condition = cond
    newAchievements[i] = a
  }
  obj.achievements = newAchievements
  if (missingIcons > 0) {
    warnings.push(`achievements: ${missingIcons} entr${missingIcons === 1 ? "y" : "ies"} missing "icon" — defaulted to "Award".`)
  }
  if (missingConditions > 0) {
    warnings.push(`achievements: ${missingConditions} entr${missingConditions === 1 ? "y" : "ies"} missing "condition" — defaulted to runs_gte:1.`)
  }
  if (unknownCondTypes > 0) {
    warnings.push(`achievements: ${unknownCondTypes} entr${unknownCondTypes === 1 ? "y" : "ies"} had unknown condition type — defaulted to runs_gte:1.`)
  }
}

function autoFixSingleQuestion(
  qObj: Record<string, unknown>,
  i: number,
  seenIds: Set<string>,
  VALID_TYPES: Set<string>,
  VALID_DIFFICULTIES: Set<string>,
  warnings: string[]
): boolean {
  let qFixed = false;

  // 1. Auto-Fix ID
  if (typeof qObj.id !== "string" || qObj.id.trim() === "") {
    qObj.id = `q-gen-${i + 1}`;
    qFixed = true;
  } else if (seenIds.has(qObj.id as string)) {
    const oldId = qObj.id as string;
    qObj.id = `${oldId}-${i}`;
    seenIds.add(qObj.id as string);
    warnings.push(`questions[${i}]: Duplicate ID "${oldId}" automatically renamed to "${qObj.id}".`);
    qFixed = true;
  } else {
    seenIds.add(qObj.id as string);
  }

  // 2. Auto-Fix Type
  if (typeof qObj.type !== "string" || !VALID_TYPES.has(qObj.type)) {
    const originalType = qObj.type;
    qObj.type = Array.isArray(qObj.options) && qObj.options.length === 2 ? "TrueFalse" : "MCQ";
    warnings.push(`questions[${i}]: Invalid type "${originalType}" automatically set to "${qObj.type}".`);
    qFixed = true;
  }

  if (qObj.type === "TrueFalse" && Array.isArray(qObj.options) && qObj.options.length !== 2) {
    qObj.type = "MCQ";
    warnings.push(`questions[${i}]: TrueFalse question had ${qObj.options.length} options; converted to MCQ.`);
    qFixed = true;
  }

  // 3. Auto-Fix Difficulty
  if (typeof qObj.difficulty !== "string" || !VALID_DIFFICULTIES.has(qObj.difficulty)) {
    qObj.difficulty = "Medium";
    qFixed = true;
  }

  // 4. Auto-Fix Category
  if (typeof qObj.category !== "string" || qObj.category.trim() === "") {
    qObj.category = "general";
    qFixed = true;
  }

  // 5. Auto-Fix Question Text
  if (typeof qObj.question !== "string" || qObj.question.trim() === "") {
    qObj.question = "No question text provided.";
    qFixed = true;
  }

  // 6. Auto-Fix Options
  if (!Array.isArray(qObj.options) || qObj.options.length < 2) {
    if (qObj.type === "TrueFalse") {
      qObj.options = [{ label: "A", text: "True" }, { label: "B", text: "False" }];
    } else {
      qObj.options = [
        { label: "A", text: "Option A" },
        { label: "B", text: "Option B" },
        { label: "C", text: "Option C" },
        { label: "D", text: "Option D" },
      ];
    }
    warnings.push(`questions[${i}]: Missing options — generated default choices.`);
    qFixed = true;
  }

  const labels = ["A", "B", "C", "D", "E", "F"];
  const normalizedOptions = new Array((qObj.options as unknown[]).length);
  for (let optIdx = 0; optIdx < (qObj.options as unknown[]).length; optIdx++) {
    const opt = (qObj.options as any[])[optIdx];
    if (typeof opt !== "object" || opt === null) {
      normalizedOptions[optIdx] = { label: labels[optIdx] || "X", text: "Option Option" };
    } else {
      const label = typeof opt.label === "string" && opt.label.trim() !== "" ? opt.label.toUpperCase() : (labels[optIdx] || "X");
      const text = typeof opt.text === "string" && opt.text.trim() !== "" ? opt.text : `Option ${label}`;
      normalizedOptions[optIdx] = { label, text };
    }
  }
  qObj.options = normalizedOptions;

  // 7. Auto-Fix Answer (lowercase, text-to-label remap, or missing)
  if (typeof qObj.answer !== "string" || qObj.answer.trim() === "") {
    qObj.answer = "A";
    qFixed = true;
  } else {
    qObj.answer = qObj.answer.toUpperCase().trim();
    let hasLabel = normalizedOptions.some((opt: any) => opt.label === qObj.answer);
    if (!hasLabel) {
      const matchedOpt = normalizedOptions.find((opt: any) => opt.text.toUpperCase() === qObj.answer);
      if (matchedOpt) {
        const oldAnswer = qObj.answer;
        qObj.answer = matchedOpt.label;
        warnings.push(`questions[${i}]: Answer text "${oldAnswer}" automatically remapped to label "${qObj.answer}".`);
        qFixed = true;
        hasLabel = true;
      } else {
        // Check for "True" / "False" maps to A / B
        if (qObj.type === "TrueFalse" || normalizedOptions.length === 2) {
          const isTrueMatch = ["TRUE", "YES", "T", "1"].includes(qObj.answer as string);
          const isFalseMatch = ["FALSE", "NO", "F", "0"].includes(qObj.answer as string);
          if (isTrueMatch || isFalseMatch) {
            const oldAnswer = qObj.answer;
            qObj.answer = isTrueMatch ? "A" : "B";
            warnings.push(`questions[${i}]: Boolean answer "${oldAnswer}" automatically mapped to option label "${qObj.answer}".`);
            qFixed = true;
            hasLabel = true;
          }
        }
        if (!hasLabel) {
          const oldAnswer = qObj.answer;
          qObj.answer = normalizedOptions[0].label;
          warnings.push(`questions[${i}]: Unresolved answer "${oldAnswer}" automatically reset to first option label "${qObj.answer}".`);
          qFixed = true;
        }
      }
    }
  }

  // 8. Auto-Fix Explanation and Hint
  if (typeof qObj.explanation !== "string" || qObj.explanation.trim() === "") {
    qObj.explanation = `Option ${qObj.answer} is correct.`;
    qFixed = true;
  }
  if (typeof qObj.hint !== "string" || qObj.hint.trim() === "") {
    qObj.hint = "Focus on the key terminology and relationships described.";
    qFixed = true;
  }

  return qFixed;
}

function autoFixQuestions(obj: Record<string, unknown>, warnings: string[]) {
  if (!Array.isArray(obj.questions)) return;

  const VALID_DIFFICULTIES = new Set(["Easy", "Medium", "Hard"])
  const VALID_TYPES = new Set(["MCQ", "TrueFalse"])
  const seenIds = new Set<string>()

  const newQuestions = []
  let fixedQuestionsCount = 0

  for (let i = 0; i < obj.questions.length; i++) {
    const q = obj.questions[i]
    if (typeof q !== "object" || q === null) {
      continue
    }

    const qObj = { ...(q as Record<string, unknown>) }

    if (autoFixSingleQuestion(qObj, i, seenIds, VALID_TYPES, VALID_DIFFICULTIES, warnings)) {
        fixedQuestionsCount++;
    }

    newQuestions.push(qObj)
  }

  obj.questions = newQuestions
}

function autoFixTerminology(obj: Record<string, unknown>, warnings: string[]) {
  if (
    typeof obj.terminology !== "object" ||
    obj.terminology === null ||
    Array.isArray(obj.terminology)
  ) {
    obj.terminology = {}
  }

  const termDict = obj.terminology as Record<string, unknown>

  // Auto-generate empty terminology keys for any categories used by questions
  if (Array.isArray(obj.questions)) {
    obj.questions.forEach((q: any) => {
      if (q && typeof q.category === "string" && q.category.trim() !== "") {
        const cat = q.category.trim()
        if (!Array.isArray(termDict[cat])) {
          termDict[cat] = []
        }
      }
    })
  }
}

function autoFixSubjectData(obj: Record<string, unknown>, warnings: string[]) {
  // Only treat as a subject and auto-fix if it has at least one subject signature key
  const hasSignature = 
    Array.isArray(obj.questions) || 
    Array.isArray(obj.flashcards) || 
    (typeof obj.terminology === "object" && obj.terminology !== null && !Array.isArray(obj.terminology)) ||
    typeof obj.name === "string" ||
    (typeof obj.config === "object" && obj.config !== null && !Array.isArray(obj.config))

  if (!hasSignature) return;

  // 1. Recover Name and ID
  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    obj.name = "Imported Subject"
    warnings.push(`"name" was missing or invalid; defaulted to "Imported Subject".`)
  }
  
  if (typeof obj.id !== "string" || obj.id.trim() === "") {
    const slug = (obj.name as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    obj.id = slug || "imported-subject"
    warnings.push(`"id" was missing or invalid; automatically generated "${obj.id}" based on subject name.`)
  }

  // 2. Recover Config Block
  if (typeof obj.config !== "object" || obj.config === null || Array.isArray(obj.config)) {
    obj.config = {
      title: obj.name,
      description: `Pedagogical study subject generated for ${obj.name}.`
    }
    warnings.push(`"config" block was missing or invalid; generated default config block.`)
  } else {
    const config = obj.config as Record<string, unknown>
    if (typeof config.title !== "string" || config.title.trim() === "") {
      config.title = obj.name
      warnings.push(`"config.title" was missing; defaulted to subject name.`)
    }
    if (typeof config.description !== "string" || config.description.trim() === "") {
      config.description = `Study subject generated for ${obj.name}.`
      warnings.push(`"config.description" was missing; generated placeholder description.`)
    }
  }

  // 3. Recover Questions Array
  if (!Array.isArray(obj.questions)) {
    obj.questions = []
    warnings.push(`"questions" array was missing or invalid; initialized as empty array.`)
  }
  
  if (obj.questions.length === 0) {
    obj.questions = [
      {
        id: "q-default-1",
        type: "MCQ",
        difficulty: "Medium",
        category: "general",
        question: `Welcome to ${obj.name}! This is a placeholder question generated during recovery.`,
        options: [
          { label: "A", text: "Ready to start" },
          { label: "B", text: "Ready to learn" }
        ],
        answer: "A",
        explanation: "Placeholder question generated during import validation recovery.",
        hint: "Select option A to proceed."
      }
    ]
    warnings.push(`"questions" array was empty; seeded a default placeholder question to ensure subject remains playable.`)
  }

  // 4. Recover Flashcards Array
  if (!Array.isArray(obj.flashcards)) {
    obj.flashcards = []
    warnings.push(`"flashcards" array was missing or invalid; initialized as empty array.`)
  }

  // 5. Recover Terminology Object
  if (typeof obj.terminology !== "object" || obj.terminology === null || Array.isArray(obj.terminology)) {
    obj.terminology = {}
    warnings.push(`"terminology" dictionary was missing or invalid; initialized as empty object.`)
  }

  // 6. Recover Achievements Array
  if (!Array.isArray(obj.achievements)) {
    obj.achievements = []
    warnings.push(`"achievements" array was missing or invalid; initialized as empty array.`)
  }

  // 7. Invoke deeply nested corrections
  autoFixQuestions(obj, warnings)
  autoFixTerminology(obj, warnings)
}

function validateConfigBlock(obj: Record<string, unknown>, errors: string[]) {
  if (typeof obj.config !== "object" || obj.config === null || Array.isArray(obj.config)) {
    errors.push('Missing required object field: "config".')
    return;
  }

  const config = obj.config as Record<string, unknown>
  if (typeof config.title !== "string" || config.title.trim() === "") {
    errors.push('"config.title" must be a non-empty string.')
  }
  if (typeof config.description !== "string" || config.description.trim() === "") {
    errors.push('"config.description" must be a non-empty string.')
  }
}

function validateSingleQuestion(
  qObj: Record<string, unknown>,
  i: number,
  seenIds: Set<string>,
  VALID_TYPES: Set<string>,
  VALID_DIFFICULTIES: Set<string>,
  errors: string[]
) {
  const prefix = `questions[${i}]`;

  if (typeof qObj.id !== "string" || qObj.id.trim() === "") {
    errors.push(`${prefix}: missing "id".`);
  } else if (seenIds.has(qObj.id)) {
    errors.push(`${prefix}: duplicate id "${qObj.id}".`);
  } else {
    seenIds.add(qObj.id);
  }

  if (!VALID_TYPES.has(qObj.type as string)) {
    errors.push(`${prefix}: "type" must be "MCQ" or "TrueFalse", got "${qObj.type}".`);
  }
  if (!VALID_DIFFICULTIES.has(qObj.difficulty as string)) {
    errors.push(`${prefix}: "difficulty" must be "Easy", "Medium", or "Hard", got "${qObj.difficulty}".`);
  }
  if (typeof qObj.category !== "string" || qObj.category.trim() === "") {
    errors.push(`${prefix}: missing "category".`);
  }
  if (typeof qObj.question !== "string" || qObj.question.trim() === "") {
    errors.push(`${prefix}: missing "question" text.`);
  }
  if (!Array.isArray(qObj.options) || qObj.options.length < 2) {
    errors.push(`${prefix}: "options" must be an array with at least 2 entries.`);
  }
  if (typeof qObj.answer !== "string" || qObj.answer.trim() === "") {
    errors.push(`${prefix}: missing "answer".`);
  }

  // diagramPosition must be a known value if present
  if (qObj.diagramPosition != null && qObj.diagramPosition !== "right" && qObj.diagramPosition !== "below") {
    errors.push(`${prefix}: "diagramPosition" must be "right" or "below", got "${qObj.diagramPosition}".`);
  }

  // answer label must exist in options
  if (!Array.isArray(qObj.options) || qObj.options.length === 0 || typeof qObj.answer !== "string") {
    return;
  }

  let labelExists = false;
  for (let j = 0; j < qObj.options.length; j++) {
    const opt = qObj.options[j] as Record<string, unknown>;
    if (opt.label === qObj.answer) {
      labelExists = true;
      break;
    }
  }

  if (!labelExists) {
    const options = qObj.options as Record<string, unknown>[];
    const labels = new Array(options.length);
    for (let j = 0; j < options.length; j++) {
      labels[j] = options[j].label;
    }
    errors.push(`${prefix}: answer "${qObj.answer}" does not match any option label (${labels.join(", ")}).`);
  }
  if (qObj.type === "TrueFalse" && qObj.answer !== "A" && qObj.answer !== "B") {
    errors.push(`${prefix}: TrueFalse answer must be "A" (True) or "B" (False), got "${qObj.answer}".`);
  }
}

function validateQuestionsArray(obj: Record<string, unknown>, errors: string[]) {
  if (!Array.isArray(obj.questions)) {
    errors.push('"questions" must be an array.')
    return;
  }

  if (obj.questions.length === 0) {
    errors.push('"questions" array is empty — at least one question is required.')
    return;
  }

  const VALID_DIFFICULTIES = new Set(["Easy", "Medium", "Hard"])
  const VALID_TYPES = new Set(["MCQ", "TrueFalse"])
  const seenIds = new Set<string>()

  for (let i = 0; i < obj.questions.length; i++) {
    const q = obj.questions[i];
    if (typeof q !== "object" || q === null) {
      errors.push(`questions[${i}]: must be an object.`)
      continue
    }
    const qObj = q as Record<string, unknown>

    validateSingleQuestion(qObj, i, seenIds, VALID_TYPES, VALID_DIFFICULTIES, errors)

    // Bail after 8 errors to avoid flooding the UI
    if (errors.length >= 8) break
  }
}

function validateFlashcardsArray(obj: Record<string, unknown>, errors: string[], warnings: string[]) {
  if (!Array.isArray(obj.flashcards)) {
    warnings.push('"flashcards" field is missing or not an array — flashcard mode will be empty.')
    return;
  }

  if (obj.flashcards.length === 0) {
    warnings.push('"flashcards" array is empty — flashcard mode will have no cards.')
    return;
  }

  for (let i = 0; i < obj.flashcards.length; i++) {
    const fc = obj.flashcards[i];
    if (typeof fc !== "object" || fc === null) {
      errors.push(`flashcards[${i}]: must be an object.`)
      continue
    }
    const fcObj = fc as Record<string, unknown>
    if (typeof fcObj.id !== "string" || fcObj.id.trim() === "") {
      errors.push(`flashcards[${i}]: missing "id".`)
    }
    if (typeof fcObj.term !== "string" || fcObj.term.trim() === "") {
      errors.push(`flashcards[${i}]: missing "term" (or legacy "front").`)
    }
    if (typeof fcObj.definition !== "string" || fcObj.definition.trim() === "") {
      errors.push(`flashcards[${i}]: missing "definition" (or legacy "back").`)
    }
  }
}

function validateTerminologyDict(obj: Record<string, unknown>, warnings: string[]) {
  if (
    typeof obj.terminology !== "object" ||
    obj.terminology === null ||
    Array.isArray(obj.terminology)
  ) {
    warnings.push('"terminology" field is missing or invalid — Full Revision glossary will be empty.')
    return;
  }

  if (Object.keys(obj.terminology as object).length === 0) {
    warnings.push('"terminology" object is empty — Full Revision glossary will be empty.')
    return;
  }

  for (const [catKey, entries] of Object.entries(obj.terminology as Record<string, unknown>)) {
    if (!Array.isArray(entries)) {
      warnings.push(`terminology["${catKey}"]: expected an array of {term, definition} objects — category skipped.`)
      continue
    }
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (typeof entry !== "object" || entry === null) {
        warnings.push(`terminology["${catKey}"][${i}]: not an object — entry skipped.`)
        continue
      }
      const e = entry as Record<string, unknown>
      if (typeof e.term !== "string" || e.term.trim() === "") {
        warnings.push(`terminology["${catKey}"][${i}]: missing "term" — entry skipped.`)
        continue
      }
      if (typeof e.definition !== "string" || e.definition.trim() === "") {
        warnings.push(`terminology["${catKey}"][${i}]: missing "definition" — entry skipped.`)
      }
    }
  }
}

function validateAchievementsArray(obj: Record<string, unknown>, warnings: string[]) {
  if (!Array.isArray(obj.achievements)) {
    warnings.push('"achievements" field is missing — no achievements will be tracked for this subject.')
  }
}

export function validateSubjectData(raw: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { valid: false, errors: ["Root value must be a JSON object, not an array or primitive."], warnings }
  }

  // Shallow-clone so normalisation does not mutate the caller's object
  const obj = { ...(raw as Record<string, unknown>) }

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 1 — NORMALISATION  (legacy → current schema, warnings only)
  // ════════════════════════════════════════════════════════════════════════════

  normalizeFlashcards(obj, warnings);
  normalizeTerminology(obj, warnings);
  normalizeAchievements(obj, warnings);

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 2 — STRICT VALIDATION  (hard errors only for broken core data)
  // ════════════════════════════════════════════════════════════════════════════

  // Required top-level string fields
  if (typeof obj.id !== "string" || obj.id.trim() === "") {
    errors.push('Missing required string field: "id".')
  }
  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    errors.push('Missing required string field: "name".')
  }

  validateConfigBlock(obj, errors);
  validateQuestionsArray(obj, errors);
  validateFlashcardsArray(obj, errors, warnings);
  validateTerminologyDict(obj, warnings);
  validateAchievementsArray(obj, warnings);

  if (errors.length > 0) {
    return { valid: false, errors, warnings }
  }

  return {
    valid: true,
    errors: [],
    warnings,
    subject: obj as unknown as FullSubjectData,
  }
}

function processStackClosure(stack: ("{" | "[")[], expectedOpen: "{" | "[", state: { braceCount: number, bracketCount: number }) {
  if (stack[stack.length - 1] === expectedOpen) {
    stack.pop();
    if (expectedOpen === '{') state.braceCount--;
    else state.bracketCount--;
    return;
  }

  if ((expectedOpen === '{' && state.braceCount > 0) || (expectedOpen === '[' && state.bracketCount > 0)) {
    let idx = stack.length - 1;
    while (idx >= 0 && stack[idx] !== expectedOpen) {
      if (stack[idx] === (expectedOpen === '{' ? '[' : '{')) {
         if (expectedOpen === '{') state.bracketCount--;
         else state.braceCount--;
      }
      idx--;
    }
    if (idx >= 0) {
      stack.length = idx;
      if (expectedOpen === '{') state.braceCount--;
      else state.bracketCount--;
    }
  }
}

function balanceJsonStack(str: string): string {
  const stack: ("{" | "[")[] = []
  let inString = false
  let escaped = false
  
  const state = { braceCount: 0, bracketCount: 0 };

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }

    if (inString) continue;

    if (char === '{') {
      stack.push('{')
      state.braceCount++
    } else if (char === '[') {
      stack.push('[')
      state.bracketCount++
    } else if (char === '}') {
      processStackClosure(stack, '{', state);
    } else if (char === ']') {
      processStackClosure(stack, '[', state);
    }
  }
  
  let balanced = str.trim()
  if (inString) balanced += '"'
  
  if (balanced.endsWith(",")) {
    balanced = balanced.slice(0, -1)
  }
  
  while (stack.length > 0) {
    const top = stack.pop()
    if (top === '{') balanced += '}'
    else if (top === '[') balanced += ']'
  }
  
  return balanced
}

function processEscapeSequence(
  str: string,
  i: number,
  LATEX_WORDS: Set<string>
): { addition: string; charsConsumed: number; wasFixed: boolean } {
  const nextChar = str[i + 1];

  if (nextChar === undefined) {
    return { addition: "\\\\", charsConsumed: 1, wasFixed: true };
  }

  // Check if it's a LaTeX command starting with b, f, n, r, t, u
  if (/[bfnrtu]/i.test(nextChar)) {
    // Extract the alphabetical word starting at nextChar
    let word = "";
    let j = i + 1;
    while (j < str.length && /[a-zA-Z]/.test(str[j])) {
      word += str[j];
      j++;
    }

    // If the extracted word is a known LaTeX command, double escape the backslash!
    if (LATEX_WORDS.has(word.toLowerCase())) {
      return { addition: "\\\\", charsConsumed: 1, wasFixed: true };
    }
  }

  // Standard JSON escape validation
  if (
    nextChar === '"' ||
    nextChar === "\\" ||
    nextChar === "/" ||
    nextChar === "b" ||
    nextChar === "f" ||
    nextChar === "n" ||
    nextChar === "r" ||
    nextChar === "t"
  ) {
    return { addition: "\\" + nextChar, charsConsumed: 2, wasFixed: false };
  }

  if (nextChar === "u") {
    const isHex = (c: string | undefined) => c !== undefined && /[0-9a-fA-F]/.test(c);
    if (
      isHex(str[i + 2]) &&
      isHex(str[i + 3]) &&
      isHex(str[i + 4]) &&
      isHex(str[i + 5])
    ) {
      return {
        addition: "\\u" + str[i + 2] + str[i + 3] + str[i + 4] + str[i + 5],
        charsConsumed: 6,
        wasFixed: false,
      };
    }
  }

  return { addition: "\\\\", charsConsumed: 1, wasFixed: true };
}

function repairBadEscapes(str: string): { repaired: string; fixed: boolean } {
  const repairedChunks: string[] = []
  let inString = false
  let fixed = false

  // Set of LaTeX/MathEx command words that start with valid JSON escape chars (b, f, n, r, t, u)
  const LATEX_WORDS = new Set([
    // t-words
    "theta", "times", "tan", "tau", "tilde", "text", "tfrac", "top", "triangle", "to", "translate", "transpose", "trace", "textbf", "textit", "texttt",
    // b-words
    "beta", "bar", "begin", "binom", "bold", "boldsymbol", "box", "bullet", "bmatrix", "mathbf", "mathbb",
    // f-words
    "frac", "forall", "flat", "frame",
    // n-words
    "nabla", "neg", "neq", "new", "node", "norm", "not", "nu", "nearrow", "nexists", "nobreak", "normalsize",
    // r-words
    "rho", "right", "real", "ref", "ring", "rightarrow", "mathrm", "ran",
    // u-words
    "uparrow", "underbar", "usebox", "underbrace", "under", "Uparrow"
  ])

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char === '"' && str[i - 1] !== '\\') {
      repairedChunks.push('"')
      inString = !inString
      continue
    }

    if (inString && char === '\\') {
        const { addition, charsConsumed, wasFixed } = processEscapeSequence(str, i, LATEX_WORDS)
        repairedChunks.push(addition);
        fixed = fixed || wasFixed;
        i += charsConsumed - 1; // loop naturally increments i
    } else {
      repairedChunks.push(char)
    }
  }

  return { repaired: repairedChunks.join(''), fixed }
}

export function repairJson(raw: string): { repaired: string; fixedIssues: string[] } {
  const fixedIssues: string[] = []
  let str = raw.trim()
  
  // Issue 1: Remove markdown block comments if LLM wrapped it
  if (str.startsWith("```")) {
    const match = str.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
    if (match) {
      str = match[1].trim()
      fixedIssues.push('Removed surrounding markdown code block fences (```json ... ```).')
    }
  }
  
  // Issue 2: Smart quotes
  const hasSmartQuotes = /[\u201C\u201D\u201E\u201F\u2033\u2036\u2018\u2019\u201A\u201B\u2032\u2035]/.test(str)
  if (hasSmartQuotes) {
    str = str
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    fixedIssues.push("Normalized smart/curly quotes (“ ” ‘ ’) to standard straight quotes.")
  }

  // Issue 2.5: Bad escape characters (e.g. \ )
  const { repaired: escapeRepaired, fixed: escapesFixed } = repairBadEscapes(str)
  if (escapesFixed) {
    str = escapeRepaired
    fixedIssues.push("Repaired invalid escape characters inside string literals (e.g. backslashes not followed by valid escape codes).")
  }
  
  // Issue 3: Trailing commas
  const hasTrailingCommas = /,\s*([\]}])/.test(str)
  if (hasTrailingCommas) {
    str = str.replace(/,\s*([\]}])/g, '$1')
    fixedIssues.push("Removed trailing commas inside arrays or objects.")
  }
  
  // Issue 4: Balance truncated braces/brackets
  const balanced = balanceJsonStack(str)
  if (balanced !== str) {
    str = balanced
    fixedIssues.push("Balanced and auto-closed truncated brackets or braces at the end of the JSON.")
  }
  
  return { repaired: str, fixedIssues }
}

/**
 * Safely parse a raw JSON string. Returns { data } on success or { parseError } on failure.
 * Incorporates automated JSON repairs for common syntax errors.
 */
function handleParseError(jsonToParse: string, fixedWarnings: string[], originalError: unknown): { data: unknown; parseError?: never; fixedWarnings?: string[] } | { data?: never; parseError: string; fixedWarnings?: never } {
  const { repaired, fixedIssues } = repairJson(jsonToParse)
  for (const issue of fixedIssues) {
    if (!fixedWarnings.includes(issue)) {
      fixedWarnings.push(issue)
    }
  }
  try {
    const parsed = JSON.parse(repaired)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      autoFixSubjectData(parsed, fixedWarnings)
    }
    return { data: parsed, fixedWarnings }
  } catch (err) {
    const msg = originalError instanceof SyntaxError ? originalError.message : "Invalid JSON."
    return { parseError: `JSON parse error: ${msg}` }
  }
}

export function parseSubjectJson(raw: string): { data: unknown; parseError?: never; fixedWarnings?: string[] } | { data?: never; parseError: string; fixedWarnings?: never } {
  const fixedWarnings: string[] = []
  const { repaired, fixed } = repairBadEscapes(raw)
  let jsonToParse = repaired
  if (fixed) {
    fixedWarnings.push("Repaired invalid escape characters inside string literals (e.g. backslashes not followed by valid escape codes).")
  }

  try {
    const parsed = JSON.parse(jsonToParse)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      autoFixSubjectData(parsed, fixedWarnings)
    }
    return { data: parsed, fixedWarnings }
  } catch (e) {
    return handleParseError(jsonToParse, fixedWarnings, e)
  }
}

// ─── Persistence ──────────────────────────────────────────────────────────────

/** Load all stored subjects. Returns [] if storage is empty or corrupted. */
export function loadSubjects(): FullSubjectData[] {
  try {
    const raw = localStorage.getItem(SUBJECTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    
    // Pass everything through validateSubjectData so old formats are normalised at runtime
    const validSubjects: FullSubjectData[] = []
    for (const item of parsed) {
      const res = validateSubjectData(item)
      if (res.valid && res.subject) {
        validSubjects.push(res.subject)
      }
    }
    return validSubjects
  } catch {
    return []
  }
}

/** Persist the full subjects list. Overwrites existing storage. */
export function saveSubjects(subjects: FullSubjectData[]): void {
  try {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects))
  } catch {
    // Quota exceeded — silently skip in demo; production would surface this
  }
}

/**
 * Add a new subject. If a subject with the same id already exists, it is
 * replaced (idempotent upsert). Returns the updated list.
 */
export function addSubject(subjects: FullSubjectData[], incoming: FullSubjectData): FullSubjectData[] {
  const updated = subjects.filter((s) => s.id !== incoming.id)
  return [...updated, incoming]
}

/** Remove a subject by id. Returns the updated list. */
export function removeSubject(subjects: FullSubjectData[], id: string): FullSubjectData[] {
  return subjects.filter((s) => s.id !== id)
}

// ─── Projection helpers ───────────────────────────────────────────────────────

/** Convert a FullSubjectData into the lightweight SubjectData shape used by the Home Screen. */
export function toSubjectData(full: FullSubjectData): SubjectData {
  const categories: CategoryData[] = deriveCategoriesFromSubject(full)
  return {
    id: full.id,
    name: full.name,
    description: full.config.description,
    totalQuestions: full.questions.length,
    categories,
  }
}
