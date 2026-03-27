"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Triangle, Trophy, RotateCcw } from "lucide-react"

interface TrianglePlayer {
  x: number
  y: number
  velocity: number
}

interface Obstacle {
  x: number
  topHeight: number
  bottomHeight: number
  width: number
  passed: boolean
}

interface FlappyTriangleProps {
  onBack?: () => void
  themeColor?: string
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const TRIANGLE_SIZE = 20
const GRAVITY = 0.6
const JUMP_FORCE = -12
const OBSTACLE_WIDTH = 60
const OBSTACLE_GAP = 150
const OBSTACLE_SPEED = 3

export default function FlappyTriangle({ onBack, themeColor = "#f59e0b" }: FlappyTriangleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [triangle, setTriangle] = useState<TrianglePlayer>({ x: 100, y: CANVAS_HEIGHT / 2, velocity: 0 })
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [score, setScore] = useState(0)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")

  const resetGame = useCallback(() => {
    setTriangle({ x: 100, y: CANVAS_HEIGHT / 2, velocity: 0 })
    setObstacles([])
    setScore(0)
    setGameRunning(false)
    setGameOver(false)
    setGameState("menu")
  }, [])

  const startGame = useCallback(() => {
    setGameState("playing")
    setGameRunning(true)
    setTriangle({ x: 100, y: CANVAS_HEIGHT / 2, velocity: 0 })
    setObstacles([])
    setScore(0)
    setGameOver(false)
  }, [])

  const jump = useCallback(() => {
    if (gameState === "menu") {
      startGame()
      return
    }
    if (gameState === "gameOver") {
      resetGame()
      return
    }
    if (gameState === "playing") {
      setTriangle((prev) => ({ ...prev, velocity: JUMP_FORCE }))
    }
  }, [gameState, startGame, resetGame])

  const generateObstacle = useCallback((x: number): Obstacle => {
    const topHeight = Math.random() * (CANVAS_HEIGHT - OBSTACLE_GAP - 100) + 50
    return {
      x,
      topHeight,
      bottomHeight: CANVAS_HEIGHT - topHeight - OBSTACLE_GAP,
      width: OBSTACLE_WIDTH,
      passed: false,
    }
  }, [])

  const checkCollision = useCallback((triangle: TrianglePlayer, obstacles: Obstacle[]): boolean => {
    // Check ground and ceiling collision
    if (triangle.y <= 0 || triangle.y >= CANVAS_HEIGHT - TRIANGLE_SIZE) {
      return true
    }

    // Check obstacle collision
    for (const obstacle of obstacles) {
      if (
        triangle.x + TRIANGLE_SIZE > obstacle.x &&
        triangle.x < obstacle.x + obstacle.width &&
        (triangle.y < obstacle.topHeight || triangle.y + TRIANGLE_SIZE > CANVAS_HEIGHT - obstacle.bottomHeight)
      ) {
        return true
      }
    }

    return false
  }, [])

  const gameLoop = useCallback(() => {
    if (!gameRunning || gameOver) return

    setTriangle((prev) => {
      const newTriangle = {
        ...prev,
        velocity: prev.velocity + GRAVITY,
        y: prev.y + prev.velocity,
      }

      return newTriangle
    })

    setObstacles((prev) => {
      let newObstacles = prev.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - OBSTACLE_SPEED,
      }))

      // Remove obstacles that are off screen
      newObstacles = newObstacles.filter((obstacle) => obstacle.x + obstacle.width > 0)

      // Add new obstacles
      if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < CANVAS_WIDTH - 200) {
        newObstacles.push(generateObstacle(CANVAS_WIDTH))
      }

      // Check for passed obstacles and update score
      newObstacles.forEach((obstacle) => {
        if (!obstacle.passed && obstacle.x + obstacle.width < triangle.x) {
          obstacle.passed = true
          setScore((prevScore) => prevScore + 1)
        }
      })

      return newObstacles
    })
  }, [gameRunning, gameOver, triangle.x, generateObstacle])

  // Game loop
  useEffect(() => {
    const interval = setInterval(gameLoop, 16)
    return () => clearInterval(interval)
  }, [gameLoop])

  // Collision detection
  useEffect(() => {
    if (gameRunning && checkCollision(triangle, obstacles)) {
      setGameOver(true)
      setGameRunning(false)
      setGameState("gameOver")
      if (score > bestScore) {
        setBestScore(score)
      }
    }
  }, [triangle, obstacles, gameRunning, checkCollision, score, bestScore])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
    gradient.addColorStop(0, "#87ceeb")
    gradient.addColorStop(1, "#e0f6ff")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 + Date.now() * 0.02) % (CANVAS_WIDTH + 100)
      const y = 50 + i * 30
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, Math.PI * 2)
      ctx.arc(x + 25, y, 30, 0, Math.PI * 2)
      ctx.arc(x + 50, y, 20, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw obstacles with gradient
    obstacles.forEach((obstacle) => {
      const obstacleGradient = ctx.createLinearGradient(obstacle.x, 0, obstacle.x + obstacle.width, 0)
      obstacleGradient.addColorStop(0, "#22c55e")
      obstacleGradient.addColorStop(1, "#16a34a")
      ctx.fillStyle = obstacleGradient

      // Top obstacle
      ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight)
      // Bottom obstacle
      ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight, obstacle.width, obstacle.bottomHeight)

      // Add highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fillRect(obstacle.x, 0, 5, obstacle.topHeight)
      ctx.fillRect(obstacle.x, CANVAS_HEIGHT - obstacle.bottomHeight, 5, obstacle.bottomHeight)
    })

    // Draw triangle with glow effect
    ctx.shadowColor = themeColor
    ctx.shadowBlur = 10
    ctx.fillStyle = themeColor
    ctx.beginPath()
    ctx.moveTo(triangle.x, triangle.y)
    ctx.lineTo(triangle.x + TRIANGLE_SIZE, triangle.y + TRIANGLE_SIZE / 2)
    ctx.lineTo(triangle.x, triangle.y + TRIANGLE_SIZE)
    ctx.closePath()
    ctx.fill()
    ctx.shadowBlur = 0

    // Draw score with better styling
    ctx.fillStyle = "#000"
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "center"
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 4
    ctx.strokeText(`${score}`, CANVAS_WIDTH / 2, 60)
    ctx.fillText(`${score}`, CANVAS_WIDTH / 2, 60)
    ctx.textAlign = "left"
  }, [triangle, obstacles, score, themeColor])

  // Keyboard and click controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault()
        jump()
      }
    }

    const handleClick = () => jump()

    window.addEventListener("keydown", handleKeyPress)
    const canvas = canvasRef.current
    canvas?.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      canvas?.removeEventListener("click", handleClick)
    }
  }, [jump])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-amber-200 rounded-xl shadow-2xl cursor-pointer mx-auto block bg-white"
          onClick={jump}
        />

        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
            <Card className="p-8 text-center border-amber-200 shadow-xl w-96">
              <div className="mb-6">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: themeColor }}
                >
                  <Triangle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Flappy Triangle</h1>
                <p className="text-gray-600 mb-4">Navigate through the obstacles and score high!</p>
                <div className="bg-amber-50 rounded-lg p-4 text-left text-sm text-gray-700 space-y-2">
                  <div className="font-semibold text-amber-800">Controls:</div>
                  <div>
                    • <kbd className="px-2 py-1 bg-white rounded border text-xs">Space</kbd> or{" "}
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">↑</kbd> to jump
                  </div>
                  <div>
                    • <kbd className="px-2 py-1 bg-white rounded border text-xs">Click</kbd> anywhere to jump
                  </div>
                  <div>• Avoid the green pipes!</div>
                </div>
              </div>
              <Button
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Flying
              </Button>
              {bestScore > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2 text-amber-700">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Best: {bestScore}</span>
                </div>
              )}
            </Card>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
            <Card className="p-8 text-center border-amber-200 shadow-xl w-96">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Over!</h2>
              <div className="space-y-4 mb-6">
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2" style={{ color: themeColor }}>
                    {score}
                  </div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                {score === bestScore && score > 0 && (
                  <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 rounded-lg p-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">New Best Score!</span>
                  </div>
                )}
                {bestScore > 0 && score !== bestScore && (
                  <div className="text-sm text-gray-500">Best Score: {bestScore}</div>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={startGame}
                  style={{ backgroundColor: themeColor }}
                  className="text-white px-6 py-2 font-semibold shadow-lg"
                >
                  Play Again
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 px-6 py-2 font-semibold bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Menu
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-amber-700 font-medium">
          {gameState === "playing" ? "Keep flying! Avoid the pipes!" : "Click anywhere or press Space to jump"}
        </p>
      </div>
    </div>
  )
}
