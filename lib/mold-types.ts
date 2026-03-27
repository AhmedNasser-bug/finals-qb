// ─── Subject / Question Data Contracts ───────────────────────────────────────

export type QuestionDifficulty = "Easy" | "Medium" | "Hard"
export type QuestionType = "MCQ" | "TrueFalse"

export interface MCQOption {
  label: string   // "A" | "B" | "C" | "D"
  text: string
}

export interface Question {
  id: string
  type: QuestionType
  difficulty: QuestionDifficulty
  category: string      // matches CategoryData.id
  question: string
  options: MCQOption[]  // for TrueFalse: [{label:"A",text:"True"},{label:"B",text:"False"}]
  answer: string        // correct option label e.g. "B"
  explanation?: string
  hint?: string
}

export interface Flashcard {
  id: string
  term: string
  definition: string
  category: string
}

export interface TerminologyEntry {
  term: string
  definition: string
}

export interface Terminology {
  [category: string]: TerminologyEntry[]
}

// Full subject payload — matches the provided SubjectData contract
export interface FullSubjectData {
  id: string
  name: string
  config: {
    title: string
    description: string
    themeColor?: string
    version?: string
    storageKey?: string
  }
  questions: Question[]
  flashcards: Flashcard[]
  terminology: Terminology
  achievements: RawAchievementDef[]
  [key: string]: unknown
}

export interface RawAchievementDef {
  id: string
  title: string
  description: string
  icon: string
  condition: AchievementCondition
}

export interface AchievementCondition {
  type: "accuracy_gte" | "streak_gte" | "mode_complete" | "speedrun_under" | "no_hints" | "all_categories" | "runs_gte" | "all_unlocked"
  value?: number          // numeric threshold
  mode?: GameModeId       // required for mode_complete / speedrun_under / no_hints
  seconds?: number        // for speedrun_under
}

// ─── Game Engine State ────────────────────────────────────────────────────────

export type GamePhase =
  | "idle"        // not started
  | "playing"     // active session
  | "reviewing"   // showing answer reveal
  | "complete"    // session ended, results available

export interface GameState {
  phase: GamePhase
  mode: GameModeId
  questions: Question[]          // shuffled/filtered pool for this run
  currentIndex: number
  selectedOption: string | null  // option label the user picked
  isRevealed: boolean            // whether the answer is shown
  score: number                  // correct answers so far
  streak: number                 // current streak
  bestStreak: number
  wrongAnswers: number           // incorrect answers so far (used for accurate accuracy %)
  livesRemaining: number         // Survival mode only (0 = unlimited)
  startTime: number              // Date.now() when session started
  elapsedSeconds: number         // updated by the timer
  perQuestionTimeLimit: number   // 0 = no per-question limit; Survival decreases this
  globalTimeLimit: number        // 0 = no global limit; Speedrun uses this
  globalTimeRemaining: number    // counts down from globalTimeLimit
  hintsUsedTotal: number
  config: GameConfig
}

export interface GameConfig {
  mode: GameModeId
  timeLimitEnabled: boolean
  hintsEnabled: boolean
  questionCount: number           // 0 = all
  selectedCategory: string | null // practice mode only
  subjectId: string
}

// ─── Core Types for MOLD V2 ─────────────────────────────────────────────────

export type GameModeId =
  | "speedrun"
  | "blitz"
  | "hardcore"
  | "survival"
  | "practice"
  | "flashcards"
  | "full-revision"

export type ModeCategory = "challenge" | "learning"

export interface GameMode {
  id: GameModeId
  label: string
  description: string
  category: ModeCategory
  /** Short tag shown in the mode card */
  tag: string
}

export type LetterGrade = "S+" | "S" | "A+" | "A" | "B+" | "C+" | "D+" | "F"

export interface RunRecord {
  id: string
  date: string           // ISO string
  mode: GameModeId
  score: number          // 0–100 accuracy %
  correctAnswers: number
  totalQuestions: number
  timeTaken: number      // seconds; 0 = untimed
  streak: number
  grade: LetterGrade
}

export interface AggregateStats {
  totalRuns: number
  bestScore: number      // accuracy %
  bestStreak: number
  averageScore: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string           // emoji or lucide icon name
  unlockedAt: string | null  // ISO string when unlocked, null if locked
}

export interface SubjectData {
  id: string
  name: string
  description: string
  totalQuestions: number
  categories: CategoryData[]
}

export interface CategoryData {
  id: string
  name: string
  questionCount: number
}

export interface SetupConfig {
  timeLimitEnabled: boolean
  hintsEnabled: boolean
  questionCount: number   // 0 = all
  selectedCategory: string | null  // only used in practice mode
}

// ─── Grade Calculator ────────────────────────────────────────────────────────

export function calculateGrade(score: number): LetterGrade {
  if (score >= 97) return "S+"
  if (score >= 93) return "S"
  if (score >= 90) return "A+"
  if (score >= 87) return "A"
  if (score >= 80) return "B+"
  if (score >= 70) return "C+"
  if (score >= 60) return "D+"
  return "F"
}

export function gradeColor(grade: LetterGrade): string {
  switch (grade) {
    case "S+": return "text-amber-400"
    case "S":  return "text-amber-300"
    case "A+": return "text-emerald-400"
    case "A":  return "text-emerald-300"
    case "B+": return "text-sky-400"
    case "C+": return "text-orange-400"
    case "D+": return "text-red-400"
    case "F":  return "text-red-600"
  }
}

export function gradeBgColor(grade: LetterGrade): string {
  switch (grade) {
    case "S+": return "bg-amber-400/10 border-amber-400/30 text-amber-400"
    case "S":  return "bg-amber-300/10 border-amber-300/30 text-amber-300"
    case "A+": return "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
    case "A":  return "bg-emerald-300/10 border-emerald-300/30 text-emerald-300"
    case "B+": return "bg-sky-400/10 border-sky-400/30 text-sky-400"
    case "C+": return "bg-orange-400/10 border-orange-400/30 text-orange-400"
    case "D+": return "bg-red-400/10 border-red-400/30 text-red-400"
    case "F":  return "bg-red-600/10 border-red-600/30 text-red-500"
  }
}

// ─── Mode Registry ────────────────────────────────────────────────────────────

export const GAME_MODES: GameMode[] = [
  {
    id: "speedrun",
    label: "Speedrun",
    description: "Complete all questions under a strict global time limit. High pressure.",
    category: "challenge",
    tag: "Time Attack",
  },
  {
    id: "blitz",
    label: "Blitz",
    description: "Quick, intense sessions using a randomized subset. Daily rapid reinforcement.",
    category: "challenge",
    tag: "Rapid Fire",
  },
  {
    id: "hardcore",
    label: "Hardcore",
    description: "Hard-difficulty questions only. True mastery demonstration. Hint system active.",
    category: "challenge",
    tag: "Hard Only",
  },
  {
    id: "survival",
    label: "Survival",
    description: "Outlast the timer as the per-question time limit decreases progressively.",
    category: "challenge",
    tag: "Progressive",
  },
  {
    id: "practice",
    label: "Practice",
    description: "Untimed, pressure-free. Select a specific category to drill weak points.",
    category: "learning",
    tag: "Untimed",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    description: "Flip-card interface for key terms and high-impact Q&A. Pure recall.",
    category: "learning",
    tag: "Recall",
  },
  {
    id: "full-revision",
    label: "Full Revision",
    description: "Strict sequential order combining questions and terminology. Exam simulation.",
    category: "learning",
    tag: "Exam Mode",
  },
]

export function computeAggregateStats(runs: RunRecord[]): AggregateStats {
  if (runs.length === 0) {
    return { totalRuns: 0, bestScore: 0, bestStreak: 0, averageScore: 0 }
  }
  return {
    totalRuns: runs.length,
    bestScore: Math.max(...runs.map((r) => r.score)),
    bestStreak: Math.max(...runs.map((r) => r.streak)),
    averageScore: Math.round(runs.reduce((sum, r) => sum + r.score, 0) / runs.length),
  }
}

export function formatTime(seconds: number): string {
  if (seconds === 0) return "—"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function modeLabel(id: GameModeId): string {
  return GAME_MODES.find((m) => m.id === id)?.label ?? id
}

/**
 * Converts a kebab-case slug into a Title Case label.
 * e.g. "finite-automata" → "Finite Automata"
 * Single source of truth — use this instead of inline .split("-").map(...).join(" ").
 */
export function formatLabel(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}
