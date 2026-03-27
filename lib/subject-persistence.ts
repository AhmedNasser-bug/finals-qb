import type { FullSubjectData, SubjectData, CategoryData } from "@/lib/mold-types"
import { deriveCategoriesFromSubject } from "@/lib/subject-store"

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
 */
export function validateSubjectData(raw: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { valid: false, errors: ["Root value must be a JSON object, not an array or primitive."], warnings }
  }

  const obj = raw as Record<string, unknown>

  // ── Required top-level string fields ─────────────────────────────────────
  if (typeof obj.id !== "string" || obj.id.trim() === "") {
    errors.push('Missing required string field: "id".')
  }
  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    errors.push('Missing required string field: "name".')
  }

  // ── config block ─────────────────────────────────────────────────────────
  if (typeof obj.config !== "object" || obj.config === null || Array.isArray(obj.config)) {
    errors.push('Missing required object field: "config".')
  } else {
    const config = obj.config as Record<string, unknown>
    if (typeof config.title !== "string" || config.title.trim() === "") {
      errors.push('"config.title" must be a non-empty string.')
    }
    if (typeof config.description !== "string" || config.description.trim() === "") {
      errors.push('"config.description" must be a non-empty string.')
    }
  }

  // ── questions array ───────────────────────────────────────────────────────
  if (!Array.isArray(obj.questions)) {
    errors.push('"questions" must be an array.')
  } else if (obj.questions.length === 0) {
    errors.push('"questions" array is empty — at least one question is required.')
  } else {
    const VALID_DIFFICULTIES = new Set(["Easy", "Medium", "Hard"])
    const VALID_TYPES = new Set(["MCQ", "TrueFalse"])
    const seenIds = new Set<string>()

    obj.questions.forEach((q: unknown, i: number) => {
      if (typeof q !== "object" || q === null) {
        errors.push(`questions[${i}]: must be an object.`)
        return
      }
      const qObj = q as Record<string, unknown>
      const prefix = `questions[${i}]`

      if (typeof qObj.id !== "string" || qObj.id.trim() === "") {
        errors.push(`${prefix}: missing "id".`)
      } else if (seenIds.has(qObj.id)) {
        errors.push(`${prefix}: duplicate id "${qObj.id}".`)
      } else {
        seenIds.add(qObj.id)
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

      // Bail early after 8 errors to avoid flooding the UI
      if (errors.length >= 8) return
    })
  }

  // ── flashcards array ──────────────────────────────────────────────────────
  if (!Array.isArray(obj.flashcards)) {
    warnings.push('"flashcards" field is missing or not an array — flashcard mode will be empty.')
  } else if (obj.flashcards.length === 0) {
    warnings.push('"flashcards" array is empty — flashcard mode will have no cards.')
  }

  // ── terminology ───────────────────────────────────────────────────────────
  if (typeof obj.terminology !== "object" || obj.terminology === null) {
    warnings.push('"terminology" field is missing — Full Revision glossary will be empty.')
  }

  // ── achievements ──────────────────────────────────────────────────────────
  if (!Array.isArray(obj.achievements)) {
    warnings.push('"achievements" field is missing — default achievement set will be used.')
  }

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
    return parsed as FullSubjectData[]
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
