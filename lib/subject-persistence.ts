import type { FullSubjectData, SubjectData, CategoryData } from "./mold-types"
import { deriveCategoriesFromSubject } from "./subject-store.ts"

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
  if (
    typeof obj.terminology !== "object" ||
    obj.terminology === null ||
    Array.isArray(obj.terminology)
  ) return;

  const termObj = obj.terminology as Record<string, unknown>
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
    const prefix = `questions[${i}]`

    if (typeof qObj.id !== "string" || qObj.id.trim() === "") {
      errors.push(`${prefix}: missing "id".`)
    }

    if (typeof qObj.id === "string" && qObj.id.trim() !== "") {
      if (seenIds.has(qObj.id)) {
        errors.push(`${prefix}: duplicate id "${qObj.id}".`)
      } else {
        seenIds.add(qObj.id)
      }
    }

    if (!VALID_TYPES.has(qObj.type as string)) {
      errors.push(`${prefix}: "type" must be "MCQ" or "TrueFalse", got "${qObj.type}".`)
    }
    if (!VALID_DIFFICULTIES.has(qObj.difficulty as string)) {
      errors.push(`${prefix}: "difficulty" must be "Easy", "Medium", or "Hard", got "${qObj.difficulty}".`)
    }
    if (typeof qObj.category !== "string" || qObj.category.trim() === "") {
      errors.push(`${prefix}: missing "category".`)
    }
    if (typeof qObj.question !== "string" || qObj.question.trim() === "") {
      errors.push(`${prefix}: missing "question" text.`)
    }
    if (!Array.isArray(qObj.options) || qObj.options.length < 2) {
      errors.push(`${prefix}: "options" must be an array with at least 2 entries.`)
    }
    if (typeof qObj.answer !== "string" || qObj.answer.trim() === "") {
      errors.push(`${prefix}: missing "answer".`)
    }

    // diagramPosition must be a known value if present
    if (qObj.diagramPosition != null && qObj.diagramPosition !== "right" && qObj.diagramPosition !== "below") {
      errors.push(`${prefix}: "diagramPosition" must be "right" or "below", got "${qObj.diagramPosition}".`)
    }

    // answer label must exist in options
    if (!Array.isArray(qObj.options) || qObj.options.length === 0 || typeof qObj.answer !== "string") {
      if (errors.length >= 8) break
      continue
    }

    const labelExists = (qObj.options as Record<string, unknown>[]).some((opt) => opt.label === qObj.answer)

    if (!labelExists) {
      const labels = (qObj.options as Record<string, unknown>[]).map((opt) => opt.label)
      errors.push(`${prefix}: answer "${qObj.answer}" does not match any option label (${labels.join(", ")}).`)
    }
    if (qObj.type === "TrueFalse" && qObj.answer !== "A" && qObj.answer !== "B") {
      errors.push(`${prefix}: TrueFalse answer must be "A" (True) or "B" (False), got "${qObj.answer}".`)
    }

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

/**
 * Safely parse a raw JSON string. Returns { data } on success or { parseError } on failure.
 */
export function parseSubjectJson(raw: string): { data: unknown; parseError?: never } | { data?: never; parseError: string } {
  try {
    return { data: JSON.parse(raw) }
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : "Invalid JSON."
    return { parseError: `JSON parse error: ${msg}` }
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
