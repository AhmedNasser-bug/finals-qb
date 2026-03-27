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

// ─── Demo / Seed Data ─────────────────────────────────────────────────────────

export const DEMO_SUBJECT: SubjectData = {
  id: "theory-of-computation",
  name: "Theory of Computation",
  description: "Automata, formal languages, Turing machines, and computational complexity.",
  totalQuestions: 84,
  categories: [
    { id: "finite-automata",    name: "Finite Automata",    questionCount: 18 },
    { id: "context-free",       name: "Context-Free Grammars", questionCount: 14 },
    { id: "turing-machines",    name: "Turing Machines",    questionCount: 16 },
    { id: "complexity",         name: "Complexity Theory",  questionCount: 20 },
    { id: "decidability",       name: "Decidability",       questionCount: 10 },
    { id: "regular-languages",  name: "Regular Languages",  questionCount: 6  },
  ],
}

export const DEMO_ACHIEVEMENTS: Achievement[] = [
  { id: "first-blood",     title: "First Blood",       description: "Complete your first run.",             icon: "Zap",        unlockedAt: "2025-03-10T10:00:00Z" },
  { id: "perfect-run",     title: "Perfect Protocol",  description: "Score S+ on any mode.",                icon: "Star",       unlockedAt: "2025-03-12T14:22:00Z" },
  { id: "survivor",        title: "Survivor",          description: "Complete Survival mode.",              icon: "Shield",     unlockedAt: "2025-03-14T09:11:00Z" },
  { id: "speedster",       title: "Speedster",         description: "Finish a Speedrun under 3 minutes.",  icon: "Timer",      unlockedAt: "2025-03-15T16:05:00Z" },
  { id: "streak-15",       title: "Hot Streak",        description: "Maintain a 15-question streak.",      icon: "Flame",      unlockedAt: null },
  { id: "hardcore-ace",    title: "Hardcore Ace",      description: "Score A+ on Hardcore mode.",          icon: "Award",      unlockedAt: null },
  { id: "blitz-master",    title: "Blitz Master",      description: "Complete 10 Blitz sessions.",         icon: "Crosshair",  unlockedAt: null },
  { id: "full-revision",   title: "Examiner",          description: "Pass a Full Revision with >90%.",     icon: "BookOpen",   unlockedAt: null },
  { id: "all-categories",  title: "Omniscient",        description: "Practice every category.",            icon: "Grid",       unlockedAt: null },
  { id: "no-hints",        title: "No Lifelines",      description: "Complete Hardcore without hints.",    icon: "EyeOff",     unlockedAt: null },
  { id: "daily-3",         title: "Consistent",        description: "Play 3 days in a row.",               icon: "Calendar",   unlockedAt: null },
  { id: "grand-master",    title: "Grand Master",      description: "Unlock all other achievements.",      icon: "Trophy",     unlockedAt: null },
]

export const DEMO_RUNS: RunRecord[] = [
  { id: "r1", date: "2025-03-15T16:05:00Z", mode: "speedrun",      score: 94, correctAnswers: 79,  totalQuestions: 84, timeTaken: 178, streak: 12, grade: "S"  },
  { id: "r2", date: "2025-03-14T09:11:00Z", mode: "survival",      score: 88, correctAnswers: 22,  totalQuestions: 25, timeTaken: 210, streak: 8,  grade: "A"  },
  { id: "r3", date: "2025-03-13T20:44:00Z", mode: "blitz",         score: 75, correctAnswers: 15,  totalQuestions: 20, timeTaken: 95,  streak: 5,  grade: "C+" },
  { id: "r4", date: "2025-03-12T14:22:00Z", mode: "hardcore",      score: 97, correctAnswers: 16,  totalQuestions: 16, timeTaken: 312, streak: 16, grade: "S+" },
  { id: "r5", date: "2025-03-11T11:00:00Z", mode: "practice",      score: 82, correctAnswers: 14,  totalQuestions: 17, timeTaken: 0,   streak: 6,  grade: "B+" },
  { id: "r6", date: "2025-03-10T10:00:00Z", mode: "full-revision", score: 61, correctAnswers: 51,  totalQuestions: 84, timeTaken: 540, streak: 3,  grade: "D+" },
  { id: "r7", date: "2025-03-09T18:30:00Z", mode: "blitz",         score: 90, correctAnswers: 18,  totalQuestions: 20, timeTaken: 88,  streak: 10, grade: "A+" },
  { id: "r8", date: "2025-03-08T08:15:00Z", mode: "speedrun",      score: 71, correctAnswers: 60,  totalQuestions: 84, timeTaken: 234, streak: 4,  grade: "C+" },
  { id: "r9", date: "2025-03-07T21:00:00Z", mode: "flashcards",    score: 85, correctAnswers: 34,  totalQuestions: 40, timeTaken: 0,   streak: 9,  grade: "B+" },
  { id: "r10",date: "2025-03-06T15:45:00Z", mode: "hardcore",      score: 56, correctAnswers: 9,   totalQuestions: 16, timeTaken: 289, streak: 2,  grade: "F"  },
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
