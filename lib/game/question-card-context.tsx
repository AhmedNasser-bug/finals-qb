import { createContext, useContext } from "react"
import type { Question } from "../types/mold-types"

export interface QuestionCardState {
  currentQuestion: Question
  currentIndex: number
  totalQuestions: number
  selectedOption: string | null
  isRevealed: boolean
  isCorrect: boolean | null
  hintUsed: boolean
  hintTimeRemaining?: number
  wrongCount: number
  globalTimeRemaining?: number
  elapsedSeconds?: number
  livesRemaining?: number
  perQuestionTimeRemaining?: number
  // Future Codeforces / script runner extensions
  sourceCode?: string
  isRunningTest?: boolean
  testResults?: any
}

export interface QuestionCardActions {
  selectOption: (option: string) => void
  submitAnswer: () => void
  nextQuestion: () => void
  useHint: () => void
  forfeitSession: () => void
  // Future Codeforces / script runner extensions
  updateSourceCode?: (code: string) => void
  runTests?: () => void
}

export interface QuestionCardMeta {
  timerAnimationRef?: React.RefObject<HTMLDivElement | null>
  codeEditorRef?: React.RefObject<HTMLTextAreaElement | null>
}

export interface QuestionCardContextValue {
  state: QuestionCardState
  actions: QuestionCardActions
  meta?: QuestionCardMeta
}

export const QuestionCardContext = createContext<QuestionCardContextValue | null>(null)

export function useQuestionCard(): QuestionCardContextValue {
  const ctx = useContext(QuestionCardContext)
  if (!ctx) {
    throw new Error("useQuestionCard must be used inside a <QuestionCard.Provider>")
  }
  return ctx
}
