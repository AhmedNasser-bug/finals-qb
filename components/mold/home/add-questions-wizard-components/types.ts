import type { FullSubjectData } from "@/lib/mold-types"
import type { ValidationResult } from "@/lib/subject-persistence"

export interface WizardState {
  step: number
  contentType: "questions" | "flashcards" | "both"
  questionCount: number
  flashcardCount: number
  styleBias: "theoretical" | "technical" | "balanced"
  categoryFocus: "all" | "existing" | "new"
  selectedCategory: string
  newCategoryName: string
  promptCopied: boolean
  jsonInput: string
  validationState: "idle" | "validating" | "valid" | "error"
  validationResult: ValidationResult | null
  parsedPreview: FullSubjectData | null
}
