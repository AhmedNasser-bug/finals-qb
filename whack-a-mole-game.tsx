"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Zap, Target, Flame } from "lucide-react"

interface WhackAMoleGameProps {
  onBack: () => void
  themeColor: string
}

interface Mole {
  id: number
  isVisible: boolean
  isHit: boolean
  timeoutId?: NodeJS.Timeout
}

type Difficulty = "easy" | "medium" | "hard"

interface DifficultyConfig {
  name: string
  icon: React.ReactNode
  color: string
  bgColor: string
  spawnInterval: number
  hideDelay: number
  maxSimultaneousMoles: number
  scoreMultiplier: number
  gameTime: number
  description: string
}

const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: "Easy",
    icon: <Target className="w-5 h-5" />,
    color: "text-green-600",
    bgColor: "bg-green-500",
    spawnInterval: 1800,
    hideDelay: 1500,
    maxSimultaneousMoles: 1,
    scoreMultiplier: 1,
    gameTime: 90,
    description: "Slow moles, long visibility, 90 seconds",
  },
  medium: {
    name: "Medium",
    icon: <Zap className="w-5 h-5" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
    spawnInterval: 1200,
    hideDelay: 1000,
    maxSimultaneousMoles: 2,
    scoreMultiplier: 1.5,
    gameTime: 60,
    description: "Moderate speed, 2 moles max, 60 seconds",
  },
  hard: {
    name: "Hard",
    icon: <Flame className="w-5 h-5" />,
    color: "text-red-600",
    bgColor: "bg-red-500",
    spawnInterval: 700,
    hideDelay: 500,
    maxSimultaneousMoles: 4,
    scoreMultiplier: 2,
    gameTime: 45,
    description: "Fast moles, short visibility, 4 moles max, 45 seconds",
  },
}

export default function WhackAMoleGame({ onBack, themeColor }: WhackAMoleGameProps) {
  const [moles, setMoles] = useState<Mole[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState<"selectDifficulty" | "playing" | "gameOver">("selectDifficulty")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({ easy: 0, medium: 0, hard: 0 })
  const [level, setLevel] = useState(1)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)

  const config = difficultyConfigs[difficulty]

  // Initialize moles
  useEffect(() => {
    const initialMoles: Mole[] = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      isVisible: false,
      isHit: false,
    }))
    setMoles(initialMoles)

    // Load best scores from localStorage
    const savedEasy = localStorage.getItem("whack-a-mole-best-easy")
    const savedMedium = localStorage.getItem("whack-a-mole-best-medium")
    const savedHard = localStorage.getItem("whack-a-mole-best-hard")

    setBestScores({
      easy: savedEasy ? Number.parseInt(savedEasy) : 0,
      medium: savedMedium ? Number.parseInt(savedMedium) : 0,
      hard: savedHard ? Number.parseInt(savedHard) : 0,
    })
  }, [])

  // Game timer
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame()
    }
  }, [timeLeft, gameState])

  useEffect(() => {
    if (gameState !== "playing") return

    const spawnMole = () => {
      const visibleMoles = moles.filter((mole) => mole.isVisible).length
      if (visibleMoles >= config.maxSimultaneousMoles) return

      const availableHoles = moles.map((mole, index) => ({ mole, index })).filter(({ mole }) => !mole.isVisible)
      if (availableHoles.length === 0) return

      const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)]
      const moleIndex = randomHole.index

      setMoles((prev) => {
        const newMoles = [...prev]
        newMoles[moleIndex] = {
          ...newMoles[moleIndex],
          isVisible: true,
          isHit: false,
        }
        return newMoles
      })

      // Hide mole after difficulty-based delay
      const hideDelay = config.hideDelay - (level - 1) * 50
      const timeoutId = setTimeout(
        () => {
          setMoles((prev) => {
            const newMoles = [...prev]
            if (newMoles[moleIndex].isVisible && !newMoles[moleIndex].isHit) {
              newMoles[moleIndex].isVisible = false
              setMisses((m) => m + 1)
            }
            return newMoles
          })
        },
        Math.max(hideDelay, 300),
      )

      setMoles((prev) => {
        const newMoles = [...prev]
        newMoles[moleIndex].timeoutId = timeoutId
        return newMoles
      })
    }

    // Spawn moles at difficulty-based intervals
    const spawnInterval = config.spawnInterval - (level - 1) * 100
    const interval = setInterval(spawnMole, Math.max(spawnInterval, 400))

    return () => clearInterval(interval)
  }, [gameState, level, moles, config])

  // Level progression
  useEffect(() => {
    const newLevel = Math.floor(score / (150 / config.scoreMultiplier)) + 1
    if (newLevel !== level) {
      setLevel(newLevel)
    }
  }, [score, level, config.scoreMultiplier])

  const selectDifficulty = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty)
    setTimeLeft(difficultyConfigs[selectedDifficulty].gameTime)
  }

  const startGame = () => {
    setScore(0)
    setTimeLeft(config.gameTime)
    setLevel(1)
    setHits(0)
    setMisses(0)
    setGameState("playing")
    setMoles((prev) => prev.map((mole) => ({ ...mole, isVisible: false, isHit: false })))
  }

  const endGame = () => {
    setGameState("gameOver")

    // Clear all mole timeouts
    moles.forEach((mole) => {
      if (mole.timeoutId) {
        clearTimeout(mole.timeoutId)
      }
    })

    // Update best score for current difficulty
    if (score > bestScores[difficulty]) {
      const newBestScores = { ...bestScores, [difficulty]: score }
      setBestScores(newBestScores)
      localStorage.setItem(`whack-a-mole-best-${difficulty}`, score.toString())
    }
  }

  const whackMole = (moleIndex: number) => {
    if (gameState !== "playing") return

    const mole = moles[moleIndex]
    if (!mole.isVisible || mole.isHit) return

    // Clear the timeout for this mole
    if (mole.timeoutId) {
      clearTimeout(mole.timeoutId)
    }

    setMoles((prev) => {
      const newMoles = [...prev]
      newMoles[moleIndex] = {
        ...newMoles[moleIndex],
        isHit: true,
        isVisible: false,
      }
      return newMoles
    })

    const basePoints = 10 + (level - 1) * 5
    const points = Math.round(basePoints * config.scoreMultiplier)
    setScore((prev) => prev + points)
    setHits((h) => h + 1)
  }

  const backToMenu = () => {
    setGameState("selectDifficulty")
  }

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Whack-a-Mole</h1>
          <div className="w-20" />
        </div>

        {gameState === "selectDifficulty" && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-6">Choose Your Difficulty</h2>
            <div className="grid gap-4 mb-8">
              {(Object.entries(difficultyConfigs) as [Difficulty, DifficultyConfig][]).map(([key, config]) => (
                <div
                  key={key}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    difficulty === key
                      ? `border-${key === "easy" ? "green" : key === "medium" ? "yellow" : "red"}-500 bg-${key === "easy" ? "green" : key === "medium" ? "yellow" : "red"}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => selectDifficulty(key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.bgColor} text-white`}>{config.icon}</div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold">{config.name}</h3>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Best Score</div>
                      <div className="text-xl font-bold text-gray-800">{bestScores[key]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={startGame} className={`${config.bgColor} hover:opacity-90 text-white px-8 py-3 text-lg`}>
              Start {config.name} Game
            </Button>
          </div>
        )}

        {/* Game Stats - only show during gameplay */}
        {gameState === "playing" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{timeLeft}</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className={`${config.bgColor.replace("bg-", "bg-opacity-20 bg-")} rounded-lg p-3 text-center`}>
                <div className={`text-2xl font-bold ${config.color}`}>{config.name}</div>
                <div className="text-sm text-gray-600">Mode</div>
              </div>
            </div>

            {/* Game Board */}
            <div className="bg-amber-100 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                {moles.map((mole, index) => (
                  <div
                    key={mole.id}
                    className="relative aspect-square bg-amber-800 rounded-full border-4 border-amber-900 cursor-pointer overflow-hidden hover:scale-105 transition-transform"
                    onClick={() => whackMole(index)}
                  >
                    {/* Hole */}
                    <div className="absolute inset-2 bg-black rounded-full" />

                    {/* Mole */}
                    {mole.isVisible && (
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                          mole.isHit ? "animate-bounce" : "animate-pulse"
                        }`}
                      >
                        <div className="w-12 h-12 bg-amber-600 rounded-full border-2 border-amber-700 flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-black rounded-full mr-1" />
                          <div className="w-2 h-2 bg-black rounded-full ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Game Over Screen */}
        {gameState === "gameOver" && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Game Over!</h2>
            <div className={`mb-4 p-4 rounded-lg ${config.bgColor.replace("bg-", "bg-opacity-20 bg-")}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {config.icon}
                <span className={`font-semibold ${config.color}`}>{config.name} Mode</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-blue-800">Final Score</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{bestScores[difficulty]}</div>
                <div className="text-sm text-yellow-800">Best Score</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={startGame}
                className={`${config.bgColor} hover:opacity-90 text-white flex items-center gap-2`}
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </Button>
              <Button onClick={backToMenu} variant="outline" className="flex items-center gap-2 bg-transparent">
                Change Difficulty
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
