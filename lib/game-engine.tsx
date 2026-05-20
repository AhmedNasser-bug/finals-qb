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
import { calculateAccuracy } from "@/lib/mold-types"
import type {
  GameState,
  GameConfig,
  Question,
  GameModeId,
} from "@/lib/mold-types"
import { shuffle } from "@/lib/crypto-utils"

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
    answers: Array(pool.length).fill(undefined),
    startTime: Date.now(),
    elapsedSeconds: 0,
    perQuestionTimeLimit,
    globalTimeLimit,
    globalTimeRemaining: globalTimeLimit,
    hintsUsedTotal: 0,
    wrongAnswers: 0,
    config,
  }
}

// ─── Question pool builder ─────────────────────────────────────────────────────

const poolBuilders: Record<string, (pool: Question[], config: GameConfig) => Question[]> = {
  "hardcore": (pool) => {
    const hard = pool.filter((q) => q.difficulty === "Hard")
    return hard.length >= 5 ? hard : shuffle(pool)
  },
  "practice": (pool, config) => config.selectedCategory ? pool.filter((q) => q.category === config.selectedCategory) : pool,
  "full-revision": (pool) => pool,
  "blitz": (pool, config) => shuffle(pool).slice(0, config.questionCount > 0 ? config.questionCount : 20),
};

function buildQuestionPool(config: GameConfig, allQuestions: Question[]): Question[] {
  const pool = [...allQuestions]
  const builder = poolBuilders[config.mode] || shuffle
  let builtPool = builder(pool, config)

  if (config.mode === "full-revision" || config.mode === "blitz") {
    return builtPool
  }

  builtPool = shuffle(builtPool)
  if (config.questionCount > 0) {
    builtPool = builtPool.slice(0, config.questionCount)
  }

  return builtPool
}

const globalTimeLimits: Record<string, number> = {
  "speedrun": 300,
  "blitz": 120,
  "hardcore": 0,
};

function getGlobalTimeLimit(config: GameConfig): number {
  if (!config.timeLimitEnabled) return 0
  return globalTimeLimits[config.mode] ?? 0
}

const perQuestionTimeLimits: Record<string, number> = {
  "survival": 15,
  "blitz": 0,
};

function getPerQuestionTimeLimit(config: GameConfig): number {
  if (!config.timeLimitEnabled) return 0
  return perQuestionTimeLimits[config.mode] ?? 0
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

type ActionHandler<T extends Action> = (state: GameState, action: T) => GameState;

const actionHandlers: { [K in Action["type"]]: ActionHandler<Extract<Action, { type: K }>> } = {
  SELECT_OPTION: (state, action) => {
    if (state.isRevealed || state.phase !== "playing") return state
    return { ...state, selectedOption: action.option }
  },

  REVEAL_ANSWER: (state) => {
    if (state.isRevealed || state.selectedOption === null) return state
    const current = state.questions[state.currentIndex]
    const isCorrect = state.selectedOption === current.answer

    const newScore = isCorrect ? state.score + 1 : state.score
    const newStreak = isCorrect ? state.streak + 1 : 0
    const newBestStreak = Math.max(state.bestStreak, newStreak)
    const newWrongAnswers = isCorrect ? state.wrongAnswers : state.wrongAnswers + 1

    const livesRemaining = state.config.mode === "survival" && !isCorrect
        ? state.livesRemaining - 1
        : state.livesRemaining

    const newAnswers = [...state.answers]
    newAnswers[state.currentIndex] = isCorrect

    return {
      ...state,
      isRevealed: true,
      phase: "reviewing",
      score: newScore,
      streak: newStreak,
      bestStreak: newBestStreak,
      wrongAnswers: newWrongAnswers,
      livesRemaining,
      answers: newAnswers,
    }
  },

  NEXT_QUESTION: (state) => {
    const isLast = state.currentIndex >= state.questions.length - 1
    const outOfLives = state.config.mode === "survival" && state.livesRemaining <= 0

    if (isLast || outOfLives) {
      return { ...state, phase: "complete", isRevealed: false, selectedOption: null }
    }

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
  },

  TICK: (state) => {
    const newElapsed = state.elapsedSeconds + 1

    if (state.globalTimeLimit > 0) {
      const newRemaining = state.globalTimeRemaining - 1
      if (newRemaining <= 0) {
        return { ...state, elapsedSeconds: newElapsed, globalTimeRemaining: 0, phase: "complete" }
      }
      return { ...state, elapsedSeconds: newElapsed, globalTimeRemaining: newRemaining }
    }

    return { ...state, elapsedSeconds: newElapsed }
  },

  PER_QUESTION_TICK: (state) => state,

  USE_HINT: (state) => {
    if (!state.config.hintsEnabled) return state
    return { ...state, hintsUsedTotal: state.hintsUsedTotal + 1 }
  },

  FORFEIT: (state) => ({ ...state, phase: "complete" }),
};

function reducer(state: GameState, action: Action): GameState {
  // @ts-expect-error - TS doesn't perfectly narrow union type to generic handler mapping implicitly
  const handler = actionHandlers[action.type] as ActionHandler<Action>;
  return handler ? handler(state, action) : state;
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
  // Fix 4-A: Stabilize config/questions on first mount so parent re-renders
  // can never trigger a silent game state reset via the lazy initializer.
  const stableConfig = useRef(config).current
  const stableQuestions = useRef(questions).current

  const [state, dispatch] = useReducer(reducer, undefined, () =>
    buildInitialState(stableConfig, stableQuestions)
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

  const accuracyPct = calculateAccuracy(state.score, state.wrongAnswers)

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
