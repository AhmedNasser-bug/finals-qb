"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Target, Trophy, Clock, Crosshair, Zap } from "lucide-react"

interface AimTrainerGameProps {
  onBack: () => void
  themeColor: string
}

type Difficulty = "easy" | "medium" | "hard"

interface TargetType {
  id: number
  x: number
  y: number
  size: number
  createdAt: number
}

interface GameStats {
  hits: number
  misses: number
  totalTime: number
  avgReactionTime: number
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    description: "Large targets, slow pace",
    targetSize: 60,
    targetDuration: 2000,
    spawnInterval: 1500,
    totalTargets: 20,
    color: "bg-green-500",
    borderColor: "border-green-500",
    textColor: "text-green-500",
  },
  medium: {
    label: "Medium",
    description: "Medium targets, moderate pace",
    targetSize: 45,
    targetDuration: 1500,
    spawnInterval: 1200,
    totalTargets: 25,
    color: "bg-yellow-500",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-500",
  },
  hard: {
    label: "Hard",
    description: "Small targets, fast pace",
    targetSize: 30,
    targetDuration: 1000,
    spawnInterval: 800,
    totalTargets: 30,
    color: "bg-red-500",
    borderColor: "border-red-500",
    textColor: "text-red-500",
  },
}

export default function AimTrainerGame({ onBack, themeColor }: AimTrainerGameProps) {
  const [gameState, setGameState] = useState<"menu" | "countdown" | "playing" | "gameover">("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [targets, setTargets] = useState<TargetType[]>([])
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [targetsSpawned, setTargetsSpawned] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [countdown, setCountdown] = useState(3)
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  })
  
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const targetIdRef = useRef(0)
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const config = DIFFICULTY_CONFIG[difficulty]

  // Load best scores from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aimTrainerBestScores")
    if (saved) {
      setBestScores(JSON.parse(saved))
    }
  }, [])

  // Save best scores
  const saveBestScore = useCallback((score: number) => {
    setBestScores((prev) => {
      if (score > prev[difficulty]) {
        const newScores = { ...prev, [difficulty]: score }
        localStorage.setItem("aimTrainerBestScores", JSON.stringify(newScores))
        return newScores
      }
      return prev
    })
  }, [difficulty])

  // Spawn a new target
  const spawnTarget = useCallback(() => {
    if (!gameAreaRef.current) return

    const rect = gameAreaRef.current.getBoundingClientRect()
    const padding = config.targetSize
    const x = padding + Math.random() * (rect.width - padding * 2)
    const y = padding + Math.random() * (rect.height - padding * 2)

    const newTarget: TargetType = {
      id: targetIdRef.current++,
      x,
      y,
      size: config.targetSize,
      createdAt: Date.now(),
    }

    setTargets((prev) => [...prev, newTarget])
    setTargetsSpawned((prev) => prev + 1)
  }, [config.targetSize])

  // Handle target click
  const handleTargetClick = useCallback((target: TargetType, e: React.MouseEvent) => {
    e.stopPropagation()
    const reactionTime = Date.now() - target.createdAt
    setReactionTimes((prev) => [...prev, reactionTime])
    setHits((prev) => prev + 1)
    setTargets((prev) => prev.filter((t) => t.id !== target.id))
  }, [])

  // Handle miss (clicking game area but not target)
  const handleMiss = useCallback(() => {
    if (gameState === "playing") {
      setMisses((prev) => prev + 1)
    }
  }, [gameState])

  // Start countdown
  const startCountdown = useCallback(() => {
    setGameState("countdown")
    setCountdown(3)
  }, [])

  // Countdown effect
  useEffect(() => {
    if (gameState === "countdown") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        return () => clearTimeout(timer)
      } else {
        setGameState("playing")
        setHits(0)
        setMisses(0)
        setTargetsSpawned(0)
        setTargets([])
        setReactionTimes([])
        targetIdRef.current = 0
      }
    }
  }, [gameState, countdown])

  // Game loop - spawn targets
  useEffect(() => {
    if (gameState === "playing") {
      // Initial spawn
      spawnTarget()
      
      // Set up spawn interval
      spawnIntervalRef.current = setInterval(() => {
        setTargetsSpawned((prev) => {
          if (prev >= config.totalTargets) {
            return prev
          }
          spawnTarget()
          return prev
        })
      }, config.spawnInterval)

      // Set up cleanup interval for expired targets
      cleanupIntervalRef.current = setInterval(() => {
        const now = Date.now()
        setTargets((prev) => {
          const expired = prev.filter((t) => now - t.createdAt > config.targetDuration)
          if (expired.length > 0) {
            setMisses((m) => m + expired.length)
          }
          return prev.filter((t) => now - t.createdAt <= config.targetDuration)
        })
      }, 100)

      return () => {
        if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
        if (cleanupIntervalRef.current) clearInterval(cleanupIntervalRef.current)
      }
    }
  }, [gameState, config.spawnInterval, config.targetDuration, config.totalTargets, spawnTarget])

  // Check for game over
  useEffect(() => {
    if (gameState === "playing" && targetsSpawned >= config.totalTargets && targets.length === 0) {
      setGameState("gameover")
      const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0
      saveBestScore(accuracy)
    }
  }, [gameState, targetsSpawned, targets.length, config.totalTargets, hits, misses, saveBestScore])

  const getAccuracy = () => {
    const total = hits + misses
    return total > 0 ? Math.round((hits / total) * 100) : 0
  }

  const getAvgReactionTime = () => {
    if (reactionTimes.length === 0) return 0
    return Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
  }

  // Menu screen
  if (gameState === "menu") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 mb-4">
            <Crosshair className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Aim Trainer</h1>
          <p className="text-gray-400">Test your mouse accuracy and reaction time</p>
        </div>

        <div className="w-full max-w-md space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-white text-center mb-4">Select Difficulty</h2>
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => {
            const cfg = DIFFICULTY_CONFIG[diff]
            const isSelected = difficulty === diff
            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${cfg.borderColor} bg-gray-800`
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className={`font-bold ${isSelected ? cfg.textColor : "text-white"}`}>
                      {cfg.label}
                    </div>
                    <div className="text-sm text-gray-400">{cfg.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Best</div>
                    <div className={`font-bold ${cfg.textColor}`}>{bestScores[diff]}%</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <Button
          onClick={startCountdown}
          className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl"
        >
          <Target className="w-5 h-5 mr-2" />
          Start Training
        </Button>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Click the targets as fast as you can!</p>
          <p>Missing a target or letting it expire counts as a miss.</p>
        </div>
      </div>
    )
  }

  // Countdown screen
  if (gameState === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-8xl font-bold text-white animate-pulse">{countdown}</div>
          <p className="text-gray-400 mt-4">Get ready...</p>
        </div>
      </div>
    )
  }

  // Game over screen
  if (gameState === "gameover") {
    const accuracy = getAccuracy()
    const avgReaction = getAvgReactionTime()
    const isNewBest = accuracy > bestScores[difficulty]

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center mb-8">
          {isNewBest && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-bold mb-4">
              <Trophy className="w-4 h-4" />
              New Best Score!
            </div>
          )}
          <h1 className="text-4xl font-bold text-white mb-2">Training Complete</h1>
          <p className="text-gray-400">Here are your results</p>
        </div>

        <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-white mb-2">{accuracy}%</div>
            <div className="text-gray-400">Accuracy</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-500 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-2xl font-bold">{hits}</span>
              </div>
              <div className="text-sm text-gray-400">Hits</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-red-500 mb-1">
                <span className="text-2xl font-bold">{misses}</span>
              </div>
              <div className="text-sm text-gray-400">Misses</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center col-span-2">
              <div className="flex items-center justify-center gap-2 text-blue-500 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-2xl font-bold">{avgReaction}ms</span>
              </div>
              <div className="text-sm text-gray-400">Avg Reaction Time</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={startCountdown}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl"
          >
            Play Again
          </Button>
          <Button
            onClick={() => setGameState("menu")}
            variant="outline"
            className="px-6 py-3 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl"
          >
            Change Difficulty
          </Button>
        </div>
      </div>
    )
  }

  // Playing screen
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* HUD */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-white font-bold">{hits}</span>
            <span className="text-gray-500">hits</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">{misses}</span>
            <span className="text-gray-500">misses</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-white font-mono">
            {targetsSpawned}/{config.totalTargets}
          </span>
        </div>
        <div className="text-white font-bold">
          {getAccuracy()}% accuracy
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        onClick={handleMiss}
        className="flex-1 relative cursor-crosshair bg-gradient-to-b from-gray-800 to-gray-900"
        style={{ minHeight: "500px" }}
      >
        {targets.map((target) => {
          const age = Date.now() - target.createdAt
          const progress = age / config.targetDuration
          const scale = 1 - progress * 0.3
          const opacity = 1 - progress * 0.5

          return (
            <button
              key={target.id}
              onClick={(e) => handleTargetClick(target, e)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-110 focus:outline-none"
              style={{
                left: target.x,
                top: target.y,
                width: target.size,
                height: target.size,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
              }}
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
              {/* Main target */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50">
                {/* Inner circles */}
                <div className="absolute inset-2 rounded-full bg-white/20" />
                <div className="absolute inset-4 rounded-full bg-red-500" />
                <div
                  className="absolute rounded-full bg-white"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: "20%",
                    height: "20%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
