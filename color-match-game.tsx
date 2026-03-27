"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Palette } from "lucide-react"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const CIRCLE_RADIUS = 60
const TARGET_RADIUS = 40

interface Circle {
  x: number
  y: number
  color: string
  radius: number
}

interface ColorMatchGameProps {
  onBack: () => void
  themeColor: string
}

const COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // yellow
  "#a855f7", // purple
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
]

export default function ColorMatchGame({ onBack, themeColor }: ColorMatchGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [targetColor, setTargetColor] = useState("")
  const [circles, setCircles] = useState<Circle[]>([])
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const generateCircles = useCallback(() => {
    const newCircles: Circle[] = []
    const target = COLORS[Math.floor(Math.random() * COLORS.length)]
    setTargetColor(target)

    // Always include one correct circle
    const correctIndex = Math.floor(Math.random() * 6)

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6
      const centerX = CANVAS_WIDTH / 2
      const centerY = CANVAS_HEIGHT / 2
      const distance = 180

      newCircles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        color: i === correctIndex ? target : COLORS[Math.floor(Math.random() * COLORS.length)],
        radius: CIRCLE_RADIUS,
      })
    }

    setCircles(newCircles)
  }, [])

  const startGame = useCallback(() => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(30)
    setStreak(0)
    generateCircles()

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameState("gameOver")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [generateCircles])

  const endGame = useCallback(() => {
    setGameState("gameOver")
    if (score > highScore) {
      setHighScore(score)
    }
    if (streak > bestStreak) {
      setBestStreak(streak)
    }
  }, [score, highScore, streak, bestStreak])

  const handleCorrectClick = useCallback(() => {
    setScore((prev) => prev + 10 + streak * 2)
    setStreak((prev) => prev + 1)
    generateCircles()
  }, [generateCircles, streak])

  const handleWrongClick = useCallback(() => {
    setScore((prev) => Math.max(0, prev - 5))
    setStreak(0)
    generateCircles()
  }, [generateCircles])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.fillStyle = "#fafafa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    if (gameState === "playing") {
      // Draw target color in center
      ctx.fillStyle = targetColor
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, TARGET_RADIUS, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#171717"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw target label
      ctx.fillStyle = "#171717"
      ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("MATCH THIS", canvas.width / 2, canvas.height / 2 - 60)

      // Draw circles
      circles.forEach((circle) => {
        ctx.fillStyle = circle.color
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#171717"
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Draw UI
      ctx.fillStyle = "#171717"
      ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${score}`, 20, 30)
      ctx.fillText(`Time: ${timeLeft}s`, 20, 60)
      ctx.fillText(`Streak: ${streak}`, 20, 90)
    }
  }, [gameState, targetColor, circles, score, timeLeft, streak])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (gameState !== "playing") return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if clicked on any circle
      for (const circle of circles) {
        const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2)
        if (distance <= circle.radius) {
          if (circle.color === targetColor) {
            handleCorrectClick()
          } else {
            handleWrongClick()
          }
          return
        }
      }
    },
    [gameState, circles, targetColor, handleCorrectClick, handleWrongClick],
  )

  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
  }, [])

  useEffect(() => {
    const animate = () => {
      drawCanvas()
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [drawCanvas])

  useEffect(() => {
    initGame()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [initGame])

  useEffect(() => {
    if (timeLeft === 0 && gameState === "playing") {
      endGame()
    }
  }, [timeLeft, gameState, endGame])

  useEffect(() => {
    if (gameState !== "gameOver") return
    const handleGameOverKeys = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") startGame()
      else if (e.key === "Escape") setGameState("menu")
    }
    window.addEventListener("keydown", handleGameOverKeys)
    return () => window.removeEventListener("keydown", handleGameOverKeys)
  }, [gameState, startGame])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg shadow-sm cursor-pointer"
          style={{ maxWidth: "100%", height: "auto" }}
          onClick={handleCanvasClick}
        />
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
              <div className="mb-6">
                <div
                  className="w-8 h-8 mx-auto mb-4 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: themeColor }}
                >
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-medium text-gray-900 mb-2">Color Match</h1>
                <p className="text-sm text-gray-600 mb-4">Click the circle that matches the target color!</p>
                <div className="bg-gray-50 rounded-lg p-3 text-left text-xs text-gray-600 space-y-1">
                  <div className="font-medium text-gray-800">How to Play:</div>
                  <div>• Look at the center target color</div>
                  <div>• Click the matching colored circle</div>
                  <div>• Build streaks for bonus points!</div>
                  <div>• You have 30 seconds to score as much as possible</div>
                </div>
              </div>
              <Button
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="text-white px-6 py-2 text-sm font-medium"
              >
                Start Game
              </Button>
              {highScore > 0 && (
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <div>Best Score: {highScore}</div>
                  <div>Best Streak: {bestStreak}</div>
                </div>
              )}
            </Card>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
              <h2 className="text-lg font-medium text-gray-500 mb-1">Color Match</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Time's Up!</h3>
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Final Score</div>
                    <div className="text-2xl font-mono" style={{ color: themeColor }}>
                      {score}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Best Streak</div>
                    <div className="text-2xl font-mono text-gray-700">{streak}</div>
                  </div>
                </div>
                {highScore > 0 && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>High Score: {highScore}</div>
                    <div>Best Streak Ever: {bestStreak}</div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={startGame}
                  style={{ backgroundColor: themeColor }}
                  className="text-white px-4 py-2 text-sm font-medium"
                >
                  Play Again
                </Button>
                <Button
                  onClick={() => setGameState("menu")}
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm font-medium"
                >
                  Menu
                </Button>
              </div>
              <div className="mt-4 text-xs text-gray-500 space-x-4">
                <span>
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> Again
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> Menu
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          {gameState === "playing" ? "Click the matching color circle!" : "A v0 Mini Game"}
        </p>
      </div>
    </div>
  )
}
