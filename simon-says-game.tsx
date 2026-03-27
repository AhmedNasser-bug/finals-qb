"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, RotateCcw, Volume2, Zap, Clock, Flame } from "lucide-react"

interface SimonSaysGameProps {
  onBack: () => void
  themeColor: string
}

type GameState = "menu" | "difficulty" | "showing" | "waiting" | "game-over"
type Color = "red" | "blue" | "green" | "yellow"
type Difficulty = "easy" | "medium" | "hard"

const difficultyConfig = {
  easy: {
    name: "Easy",
    icon: Clock,
    color: "from-green-500 to-emerald-500",
    sequenceDelay: 1200,
    buttonHighlight: 800,
    description: "Relaxed pace, perfect for beginners",
  },
  medium: {
    name: "Medium",
    icon: Zap,
    color: "from-blue-500 to-purple-500",
    sequenceDelay: 600,
    buttonHighlight: 500,
    description: "Moderate speed, good challenge",
  },
  hard: {
    name: "Hard",
    icon: Flame,
    color: "from-red-500 to-pink-500",
    sequenceDelay: 300,
    buttonHighlight: 200,
    description: "Lightning fast, for experts only",
  },
}

export default function SimonSaysGame({ onBack, themeColor }: SimonSaysGameProps) {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [sequence, setSequence] = useState<Color[]>([])
  const [playerSequence, setPlayerSequence] = useState<Color[]>([])
  const [score, setScore] = useState(0)
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  })
  const [activeButton, setActiveButton] = useState<Color | null>(null)
  const [sequenceIndex, setSequenceIndex] = useState(0)

  const colors: Color[] = ["red", "blue", "green", "yellow"]
  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600 active:bg-red-700",
    blue: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
    green: "bg-green-500 hover:bg-green-600 active:bg-green-700",
    yellow: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
  }

  useEffect(() => {
    const savedEasy = localStorage.getItem("simon-says-best-easy")
    const savedMedium = localStorage.getItem("simon-says-best-medium")
    const savedHard = localStorage.getItem("simon-says-best-hard")

    setBestScores({
      easy: savedEasy ? Number.parseInt(savedEasy) : 0,
      medium: savedMedium ? Number.parseInt(savedMedium) : 0,
      hard: savedHard ? Number.parseInt(savedHard) : 0,
    })
  }, [])

  useEffect(() => {
    if (score > bestScores[difficulty]) {
      const newBestScores = { ...bestScores, [difficulty]: score }
      setBestScores(newBestScores)
      localStorage.setItem(`simon-says-best-${difficulty}`, score.toString())
    }
  }, [score, bestScores, difficulty])

  const generateRandomColor = (): Color => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const playSound = (color: Color) => {
    try {
      // Create different frequency tones for each color
      const frequencies = { red: 220, blue: 277, green: 330, yellow: 392 }
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequencies[color]
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log("[v0] Audio not available:", error)
    }
  }

  const showNextInSequence = useCallback(() => {
    console.log("[v0] showNextInSequence called, sequenceIndex:", sequenceIndex, "sequence length:", sequence.length)
    if (sequenceIndex < sequence.length) {
      const color = sequence[sequenceIndex]
      console.log("[v0] Showing color:", color, "at index:", sequenceIndex)
      setActiveButton(color)
      playSound(color)

      const config = difficultyConfig[difficulty]
      setTimeout(() => {
        setActiveButton(null)
        if (sequenceIndex + 1 < sequence.length) {
          setSequenceIndex((prev) => prev + 1)
        } else {
          // Sequence complete, player's turn
          console.log("[v0] Sequence complete, switching to waiting")
          setTimeout(() => {
            setGameState("waiting")
            setPlayerSequence([])
          }, 300)
        }
      }, config.buttonHighlight)
    }
  }, [sequence, sequenceIndex, difficulty])

  useEffect(() => {
    if (gameState === "showing") {
      console.log("[v0] Game state is showing, sequenceIndex:", sequenceIndex)
      if (sequenceIndex < sequence.length) {
        const config = difficultyConfig[difficulty]
        const timer = setTimeout(showNextInSequence, config.sequenceDelay)
        return () => clearTimeout(timer)
      }
    }
  }, [gameState, sequenceIndex, sequence.length, showNextInSequence, difficulty])

  const startGame = () => {
    console.log("[v0] Starting new game with difficulty:", difficulty)
    const newSequence = [generateRandomColor()]
    console.log("[v0] New sequence:", newSequence)
    setSequence(newSequence)
    setPlayerSequence([])
    setScore(0)
    setSequenceIndex(0)
    setGameState("showing")
  }

  const nextRound = () => {
    console.log("[v0] Starting next round, current score:", score)
    const newSequence = [...sequence, generateRandomColor()]
    console.log("[v0] New sequence:", newSequence)
    setSequence(newSequence)
    setPlayerSequence([])
    setScore((prev) => prev + 1)
    setSequenceIndex(0)
    setGameState("showing")
  }

  const handleButtonClick = (color: Color) => {
    if (gameState !== "waiting") return

    console.log("[v0] Player clicked:", color, "Expected:", sequence[playerSequence.length])

    playSound(color)
    setActiveButton(color)
    setTimeout(() => setActiveButton(null), 200)

    const newPlayerSequence = [...playerSequence, color]
    setPlayerSequence(newPlayerSequence)

    // Check if the clicked color is correct
    if (color !== sequence[newPlayerSequence.length - 1]) {
      console.log("[v0] Wrong color! Game over")
      setGameState("game-over")
      return
    }

    // Check if player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      console.log("[v0] Sequence completed! Moving to next round")
      setTimeout(() => {
        nextRound()
      }, 1000)
    }
  }

  const resetGame = () => {
    console.log("[v0] Resetting game")
    setGameState("menu")
    setSequence([])
    setPlayerSequence([])
    setScore(0)
    setActiveButton(null)
    setSequenceIndex(0)
  }

  if (gameState === "difficulty") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Difficulty</h2>
            <p className="text-gray-600">Select your challenge level</p>
          </div>

          <div className="space-y-4 mb-8">
            {(Object.keys(difficultyConfig) as Difficulty[]).map((diff) => {
              const config = difficultyConfig[diff]
              const Icon = config.icon
              return (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-200
                    ${
                      difficulty === diff
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-800">{config.name}</div>
                      <div className="text-sm text-gray-600">{config.description}</div>
                      <div className="text-xs text-purple-600 font-medium">Best: {bestScores[diff]}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="space-y-3">
            <Button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
            <Button onClick={() => setGameState("menu")} variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Simon Says</h1>
            <p className="text-gray-600">Watch the sequence and repeat it back!</p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            {(Object.keys(difficultyConfig) as Difficulty[]).map((diff) => {
              const config = difficultyConfig[diff]
              return (
                <div key={diff} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{config.name}</div>
                  <div className="text-lg font-bold text-purple-600">{bestScores[diff]}</div>
                </div>
              )
            })}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setGameState("difficulty")}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Game
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>💡 Watch the pattern, then click the buttons in the same order!</p>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "game-over") {
    const config = difficultyConfig[difficulty]
    return (
      <div className={`min-h-screen bg-gradient-to-br ${config.color} flex items-center justify-center p-4`}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
            <p className="text-gray-600">
              You made it to round {score + 1} on {config.name} mode!
            </p>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">Your Score</div>
            <div className="text-3xl font-bold text-red-500">{score}</div>
            {score === bestScores[difficulty] && score > 0 && (
              <div className="text-sm text-green-600 font-semibold mt-1">🎉 New Best Score!</div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={startGame}
              className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl`}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            <Button onClick={() => setGameState("difficulty")} variant="outline" className="w-full bg-transparent">
              Change Difficulty
            </Button>
            <Button onClick={resetGame} variant="outline" className="w-full bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const config = difficultyConfig[difficulty]
  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.color} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">Round ({config.name})</div>
            <div className="text-2xl font-bold text-purple-600">{score + 1}</div>
          </div>

          {gameState === "showing" && (
            <div className="text-lg font-semibold text-gray-700 animate-pulse">
              Watch the sequence... ({sequenceIndex + 1}/{sequence.length})
            </div>
          )}

          {gameState === "waiting" && (
            <div className="text-lg font-semibold text-green-600">
              Your turn! ({playerSequence.length + 1}/{sequence.length})
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleButtonClick(color)}
              disabled={gameState !== "waiting"}
              className={`
                aspect-square rounded-2xl transition-all duration-150 transform
                ${colorClasses[color]}
                ${activeButton === color ? "scale-95 brightness-125 shadow-lg" : ""}
                ${gameState === "waiting" ? "hover:scale-105 active:scale-95" : ""}
                ${gameState !== "waiting" ? "cursor-not-allowed opacity-75" : "cursor-pointer"}
                shadow-md
              `}
            >
              <div className="w-full h-full rounded-2xl bg-white/20" />
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>
              {playerSequence.length}/{sequence.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: sequence.length > 0 ? `${(playerSequence.length / sequence.length) * 100}%` : "0%",
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={resetGame} variant="outline" className="flex-1 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu
          </Button>
          <Button onClick={startGame} variant="outline" className="flex-1 bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>
      </div>
    </div>
  )
}
