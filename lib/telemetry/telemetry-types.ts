/**
 * @mold/telemetry - Core Telemetry & Retention Types
 *
 * Decoupled data contracts for cognitive telemetry event collection,
 * SuperMemo spaced repetition states, and memory decay modeling.
 */

export type TelemetryEventType =
  | "card_flipped"
  | "rating_submitted"
  | "option_selected"
  | "question_answered"
  | "hint_opened"
  | "cheatsheet_opened"
  | "session_completed"

export interface BaseTelemetryEvent {
  id: string
  type: TelemetryEventType
  timestamp: string // ISO date
  subjectId: string
  category: string
}

export interface CardFlippedEvent extends BaseTelemetryEvent {
  type: "card_flipped"
  cardId: string
  durationBeforeFlipMs: number
}

export type FlashcardRecallQuality = "again" | "hard" | "good" | "easy"

export interface RatingSubmittedEvent extends BaseTelemetryEvent {
  type: "rating_submitted"
  cardId: string
  rating: FlashcardRecallQuality
  decisionLatencyMs: number
}

export interface QuestionAnsweredEvent extends BaseTelemetryEvent {
  type: "question_answered"
  questionId: string
  firstTouchLatencyMs: number
  totalDecisionLatencyMs: number
  optionSwitchCount: number
  isCorrect: boolean
  mode: string
}

export interface HintOpenedEvent extends BaseTelemetryEvent {
  type: "hint_opened"
  questionId: string
}

export interface SessionCompletedEvent extends BaseTelemetryEvent {
  type: "session_completed"
  mode: string
  totalDurationMs: number
  totalItems: number
  accuracyPct: number
}

export type CognitiveTelemetryEvent =
  | CardFlippedEvent
  | RatingSubmittedEvent
  | QuestionAnsweredEvent
  | HintOpenedEvent
  | SessionCompletedEvent

export interface CardRetentionState {
  cardId: string
  subjectId: string
  category: string
  term: string
  definition: string
  repetitions: number
  intervalDays: number
  easeFactor: number // Default 2.5
  stability: number // S (half-life in days)
  difficulty: number // D (0.0 to 1.0)
  lapses: number
  lastReviewedAt: string | null
  nextDueDate: string | null
  currentRetrievability: number // R(t) = e^(-t/S)
  urgencyLevel: "CRITICAL_LAPSED" | "DUE" | "APPROACHING_DECAY" | "MASTERED" | "NEW"
}

export type RetentionMap = Record<string, CardRetentionState>

export interface CategoryRetentionSummary {
  category: string
  totalCards: number
  masteredCount: number
  dueCount: number
  lapsedCount: number
  averageRetrievability: number
  averageStabilityDays: number
}
