import type { FullSubjectData } from "@/lib/mold-types"
import type { ValidationResult } from "@/lib/subject-persistence"

export interface WizardStepProps {
  activeSubject: FullSubjectData
  step: number
  // Step 1
  contentType: "questions" | "flashcards" | "both"
  setContentType: (val: "questions" | "flashcards" | "both") => void
  questionCount: number
  setQuestionCount: (val: number) => void
  flashcardCount: number
  setFlashcardCount: (val: number) => void
  // Step 2
  styleBias: "theoretical" | "technical" | "balanced"
  setStyleBias: (val: "theoretical" | "technical" | "balanced") => void
  // Step 3
  categoryFocus: "all" | "existing" | "new"
  setCategoryFocus: (val: "all" | "existing" | "new") => void
  existingCategories: string[]
  selectedCategory: string
  setSelectedCategory: (val: string) => void
  newCategoryName: string
  setNewCategoryName: (val: string) => void
  // Step 4
  compiledPrompt: string
  promptCopied: boolean
  setPromptCopied: (val: boolean) => void
  // Step 5
  jsonInput: string
  setJsonInput: (val: string) => void
  validationState: "idle" | "validating" | "valid" | "error"
  validationResult: ValidationResult | null
  parsedPreview: FullSubjectData | null
}
