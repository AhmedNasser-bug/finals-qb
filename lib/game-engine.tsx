"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import type {
  GameState,
  GameConfig,
  Question,
  GameModeId,
} from "@/lib/mold-types"

// ─── Initial state factory ────────────────────────────────────────────────────

function buildInitialState(config: GameConfig, questions: Question[]): GameState {
  const pool = buildQuestionPool(config, questions)

  const globalTimeLimit = getGlobalTimeLimit(config)
  const perQuestionTimeLimit = getPerQuestionTimeLimit(config)

  return {
    phase: "playing",
    mode: config.mode,
    questions: pool,
    currentIndex: 0,
    selectedOption: null,
    isRevealed: false,
    score: 0,
    streak: 0,
    bestStreak: 0,
    livesRemaining: config.mode === "survival" ? 3 : 0,
    startTime: Date.now(),
    elapsedSeconds: 0,
    perQuestionTimeLimit,
    globalTimeLimit,
    globalTimeRemaining: globalTimeLimit,
    hintsUsedTotal: 0,
    config,
  }
}

// ─── Question pool builder ─────────────────────────────────────────────────────

function buildQuestionPool(config: GameConfig, allQuestions: Question[]): Question[] {
  let pool = [...allQuestions]

  switch (config.mode) {
    case "hardcore":
      // Hard only; fall back to full pool if fewer than 5 hard questions
      const hard = pool.filter((q) => q.difficulty === "Hard")
      pool = hard.length >= 5 ? hard : shuffle(pool)
      break

    case "practice":
      // Filter by selected category if set
      if (config.selectedCategory) {
        pool = pool.filter((q) => q.category === config.selectedCategory)
      }
      break

    case "full-revision":
      // Strict sequential — no shuffle
      return pool

    case "blitz":
      pool = shuffle(pool)
      pool = pool.slice(0, config.questionCount > 0 ? config.questionCount : 20)
      return pool

    default:
      pool = shuffle(pool)
      break
  }

  if (config.mode !== "full-revision") {
    pool = shuffle(pool)
    if (config.questionCount > 0) {
      pool = pool.slice(0, config.questionCount)
    }
  }

  return pool
}

function getGlobalTimeLimit(config: GameConfig): number {
  if (!config.timeLimitEnabled) return 0
  switch (config.mode) {
    case "speedrun": return 300        // 5 minutes
    case "blitz":    return 120        // 2 minutes
    case "hardcore": return 0          // no global limit for hardcore
    default:         return 0
  }
}

function getPerQuestionTimeLimit(config: GameConfig): number {
  if (!config.timeLimitEnabled) return 0
  switch (config.mode) {
    case "survival": return 15         // starts at 15s, decreases
    case "blitz":    return 0          // global limit instead
    default:         return 0
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SELECT_OPTION"; option: string }
  | { type: "REVEAL_ANSWER" }
  | { type: "NEXT_QUESTION" }
  | { type: "TICK" }                      // called every second
  | { type: "PER_QUESTION_TICK" }         // survival per-question timer
  | { type: "USE_HINT" }
  | { type: "FORFEIT" }                   // user quits early

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SELECT_OPTION": {
      if (state.isRevealed || state.phase !== "playing") return state
      return { ...state, selectedOption: action.option }
    }

    case "REVEAL_ANSWER": {
      if (state.isRevealed || state.selectedOption === null) return state
      const current = state.questions[state.currentIndex]
      const isCorrect = state.selectedOption === current.answer

      const newScore = isCorrect ? state.score + 1 : state.score
      const newStreak = isCorrect ? state.streak + 1 : 0
      const newBestStreak = Math.max(state.bestStreak, newStreak)

      // Survival: lose a life on wrong answer
      const livesRemaining =
        state.config.mode === "survival" && !isCorrect
          ? state.livesRemaining - 1
          : state.livesRemaining

      return {
        ...state,
        isRevealed: true,
        phase: "reviewing",
        score: newScore,
        streak: newStreak,
        bestStreak: newBestStreak,
        livesRemaining,
      }
    }

    case "NEXT_QUESTION": {
      const isLast = state.currentIndex >= state.questions.length - 1
      const outOfLives = state.config.mode === "survival" && state.livesRemaining <= 0

      if (isLast || outOfLives) {
        return { ...state, phase: "complete", isRevealed: false, selectedOption: null }
      }

      // Survival: decrease per-question time limit by 1s every 5 questions (min 5s)
      let newPerLimit = state.perQuestionTimeLimit
      if (state.config.mode === "survival" && state.perQuestionTimeLimit > 5) {
        const nextIndex = state.currentIndex + 1
        if (nextIndex % 5 === 0) newPerLimit = Math.max(5, newPerLimit - 1)
      }

      return {
        ...state,
        phase: "playing",
        currentIndex: state.currentIndex + 1,
        selectedOption: null,
        isRevealed: false,
        perQuestionTimeLimit: newPerLimit,
      }
    }

    case "TICK": {
      const newElapsed = state.elapsedSeconds + 1

      // Global timer countdown (Speedrun / Blitz)
      if (state.globalTimeLimit > 0) {
        const newRemaining = state.globalTimeRemaining - 1
        if (newRemaining <= 0) {
          return { ...state, elapsedSeconds: newElapsed, globalTimeRemaining: 0, phase: "complete" }
        }
        return { ...state, elapsedSeconds: newElapsed, globalTimeRemaining: newRemaining }
      }

      return { ...state, elapsedSeconds: newElapsed }
    }

    case "PER_QUESTION_TICK": {
      // Survival: forfeit current question when per-question timer hits 0
      if (state.perQuestionTimeLimit <= 0 || state.isRevealed) return state
      // This is handled by the component via elapsed tracking; reducer just accepts the reveal
      return state
    }

    case "USE_HINT": {
      if (!state.config.hintsEnabled) return state
      return { ...state, hintsUsedTotal: state.hintsUsedTotal + 1 }
    }

    case "FORFEIT": {
      return { ...state, phase: "complete" }
    }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface GameEngineContextValue {
  state: GameState
  selectOption: (option: string) => void
  revealAnswer: () => void
  nextQuestion: () => void
  useHint: () => void
  forfeit: () => void
  currentQuestion: Question | null
  accuracyPct: number
}

const GameEngineContext = createContext<GameEngineContextValue | null>(null)

export function useGameEngine(): GameEngineContextValue {
  const ctx = useContext(GameEngineContext)
  if (!ctx) throw new Error("useGameEngine must be used inside <GameEngineProvider>")
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface GameEngineProviderProps {
  config: GameConfig
  questions: Question[]
  children: ReactNode
}

export function GameEngineProvider({ config, questions, children }: GameEngineProviderProps) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    buildInitialState(config, questions)
  )

  // Global tick (every second) — only while playing
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (state.phase === "playing" || state.phase === "reviewing") {
      tickRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000)
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [state.phase])

  const selectOption = useCallback((option: string) => dispatch({ type: "SELECT_OPTION", option }), [])
  const revealAnswer  = useCallback(() => dispatch({ type: "REVEAL_ANSWER" }), [])
  const nextQuestion  = useCallback(() => dispatch({ type: "NEXT_QUESTION" }), [])
  const useHint       = useCallback(() => dispatch({ type: "USE_HINT" }), [])
  const forfeit       = useCallback(() => dispatch({ type: "FORFEIT" }), [])

  const currentQuestion = state.questions[state.currentIndex] ?? null

  const answered = state.currentIndex + (state.phase === "complete" ? 0 : 0)
  const total = state.questions.length
  const accuracyPct = total > 0 ? Math.round((state.score / Math.max(state.currentIndex, 1)) * 100) : 0

  return (
    <GameEngineContext.Provider value={{
      state,
      selectOption,
      revealAnswer,
      nextQuestion,
      useHint,
      forfeit,
      currentQuestion,
      accuracyPct,
    }}>
      {children}
    </GameEngineContext.Provider>
  )
}
