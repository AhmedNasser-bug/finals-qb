"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Timer, Zap, Trophy, Target, TrendingUp, RotateCcw } from "lucide-react"

interface ReactionGameProps {
  onBack?: () => void
  themeColor?: string
}

export default function ReactionGame({ onBack, themeColor = "#ef4444" }: ReactionGameProps) {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "clicked" | "too-early">("waiting")
  const [startTime, setStartTime] = useState<number>(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)

  const resetGame = useCallback(() => {
    setGameState("waiting")
    setStartTime(0)
    setReactionTime(null)
    setCountdown(null)
  }, [])

  const resetAllStats = useCallback(() => {
    setAttempts([])
    setBestTime(null)
    resetGame()
  }, [resetGame])

  const startGame = useCallback(() => {
    setGameState("ready")
    const delay = Math.random() * 4000 + 1000 // 1-5 seconds

    // Show countdown for dramatic effect
    let countdownValue = 3
    setCountdown(countdownValue)

    const countdownInterval = setInterval(() => {
      countdownValue--
      if (countdownValue > 0) {
        setCountdown(countdownValue)
      } else {
        setCountdown(null)
        clearInterval(countdownInterval)

        // Start the actual waiting period
        setTimeout(() => {
          setGameState("go")
          setStartTime(Date.now())
        }, delay)
      }
    }, 800)
  }, [])

  const handleClick = useCallback(() => {
    if (gameState === "waiting") {
      startGame()
    } else if (gameState === "ready") {
      setGameState("too-early")
      setCountdown(null)
    } else if (gameState === "go") {
      const endTime = Date.now()
      const reaction = endTime - startTime
      setReactionTime(reaction)
      setGameState("clicked")
      setAttempts((prev) => [...prev, reaction])

      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction)
      }
    } else if (gameState === "clicked" || gameState === "too-early") {
      resetGame()
    }
  }, [gameState, startTime, startGame, resetGame, bestTime])

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault()
        handleClick()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleClick])

  const getAverageTime = () => {
    if (attempts.length === 0) return null
    return Math.round(attempts.reduce((sum, time) => sum + time, 0) / attempts.length)
  }

  const getPerformanceRating = (time: number) => {
    if (time < 200) return { text: "Lightning Fast! ⚡", color: "text-green-600", bgColor: "bg-green-50" }
    if (time < 250) return { text: "Excellent! 🎯", color: "text-green-500", bgColor: "bg-green-50" }
    if (time < 300) return { text: "Good! 👍", color: "text-blue-500", bgColor: "bg-blue-50" }
    if (time < 400) return { text: "Average 📊", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { text: "Keep Practicing 💪", color: "text-red-500", bgColor: "bg-red-50" }
  }

  const getStateConfig = () => {
    switch (gameState) {
      case "waiting":
        return {
          bg: "bg-gradient-to-br from-blue-500 to-blue-600",
          text: "Click to Start",
          subtext: "Test your lightning-fast reflexes",
          icon: <Target className="w-12 h-12 text-white mb-4" />,
        }
      case "ready":
        return {
          bg: "bg-gradient-to-br from-red-500 to-red-600",
          text: countdown ? countdown.toString() : "Wait for Green...",
          subtext: countdown ? "Get ready..." : "Don't click yet!",
          icon: <Timer className="w-12 h-12 text-white mb-4" />,
        }
      case "go":
        return {
          bg: "bg-gradient-to-br from-green-500 to-green-600",
          text: "CLICK NOW!",
          subtext: "React as fast as you can!",
          icon: <Zap className="w-12 h-12 text-white mb-4 animate-pulse" />,
        }
      case "clicked":
        const rating = getPerformanceRating(reactionTime!)
        return {
          bg: "bg-gradient-to-br from-gray-100 to-gray-200",
          text: `${reactionTime}ms`,
          subtext: rating.text,
          icon: <Trophy className="w-12 h-12 text-gray-700 mb-4" />,
        }
      case "too-early":
        return {
          bg: "bg-gradient-to-br from-red-500 to-red-600",
          text: "Too Early!",
          subtext: "Wait for the green signal",
          icon: <Timer className="w-12 h-12 text-white mb-4" />,
        }
    }
  }

  const config = getStateConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" size="sm" className="shadow-md bg-transparent">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Reaction Time Challenge</h1>
          <Button onClick={resetAllStats} variant="outline" size="sm" className="shadow-md bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Stats
          </Button>
        </div>

        {/* Main Game Area */}
        <Card
          className={`${config.bg} border-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] mb-8 shadow-2xl`}
          onClick={handleClick}
        >
          <div className="h-80 flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
              <div className="absolute top-12 right-8 w-4 h-4 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-8 left-12 w-6 h-6 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10 text-center">
              {config.icon}
              <div className="text-5xl font-bold mb-4">{config.text}</div>
              <div className="text-xl opacity-90 mb-4">{config.subtext}</div>

              {gameState === "clicked" && reactionTime && (
                <div
                  className={`mt-6 px-6 py-3 rounded-full text-lg font-semibold ${getPerformanceRating(reactionTime).bgColor} ${getPerformanceRating(reactionTime).color} bg-opacity-90`}
                >
                  {getPerformanceRating(reactionTime).text}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="font-semibold text-gray-700">Best Time</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{bestTime ? `${bestTime}ms` : "—"}</div>
            {bestTime && (
              <div className={`text-sm mt-2 ${getPerformanceRating(bestTime).color}`}>
                {getPerformanceRating(bestTime).text}
              </div>
            )}
          </Card>

          <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
              <span className="font-semibold text-gray-700">Average</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{getAverageTime() ? `${getAverageTime()}ms` : "—"}</div>
            {getAverageTime() && <div className="text-sm text-gray-500 mt-2">Over {attempts.length} attempts</div>}
          </Card>

          <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-green-500 mr-2" />
              <span className="font-semibold text-gray-700">Attempts</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{attempts.length}</div>
            <div className="text-sm text-gray-500 mt-2">Total clicks</div>
          </Card>

          <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-purple-500 mr-2" />
              <span className="font-semibold text-gray-700">Last Result</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{reactionTime ? `${reactionTime}ms` : "—"}</div>
            {reactionTime && (
              <div className={`text-sm mt-2 ${getPerformanceRating(reactionTime).color}`}>
                {getPerformanceRating(reactionTime).text.split(" ")[0]}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <Card className="p-6 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Timer className="w-5 h-5 mr-2" />
              Recent Attempts
            </h3>
            <div className="flex flex-wrap gap-3">
              {attempts
                .slice(-15)
                .reverse()
                .map((time, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                      time === bestTime
                        ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300 shadow-md"
                        : time < 250
                          ? "bg-green-100 text-green-800"
                          : time < 350
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {time}ms
                    {time === bestTime && <Trophy className="w-3 h-3 inline ml-1" />}
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <div className="text-center mt-8">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-3">How to Play</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  1
                </div>
                <span>Click the blue area to start</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  2
                </div>
                <span>Wait for the green signal</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  3
                </div>
                <span>Click as fast as you can!</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Average human reaction time is around 250ms • Use Space or Enter for keyboard control
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
