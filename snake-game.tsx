"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface Position {
  x: number
  y: number
}

interface SnakeGameProps {
  onBack?: () => void
  themeColor?: string
}

const GRID_SIZE = 20
const CANVAS_SIZE = 400
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 150

export default function SnakeGame({ onBack, themeColor = "#22c55e" }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION)
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [score, setScore] = useState(0)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [bestScore, setBestScore] = useState(0)

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      }
    } while (snakeBody.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood({ x: 15, y: 15 })
    setScore(0)
    setGameRunning(false)
    setGameOver(false)
  }, [])

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake]
      const head = { ...newSnake[0] }
      head.x += direction.x
      head.y += direction.y

      // Check wall collision
      if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        setGameOver(true)
        setGameRunning(false)
        if (score > bestScore) {
          setBestScore(score)
        }
        return prevSnake
      }

      // Check self collision
      if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        setGameRunning(false)
        if (score > bestScore) {
          setBestScore(score)
        }
        return prevSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => prevScore + 10)
        setFood(generateFood(newSnake))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [gameRunning, gameOver, direction, food, score, bestScore, generateFood])

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED)
    return () => clearInterval(gameInterval)
  }, [moveSnake])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(CANVAS_SIZE, i)
      ctx.stroke()
    }

    // Draw snake
    ctx.fillStyle = themeColor
    snake.forEach((segment, index) => {
      ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2)
      if (index === 0) {
        // Draw eyes on head
        ctx.fillStyle = "#fff"
        ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 4, 3, 3)
        ctx.fillRect(segment.x * GRID_SIZE + 13, segment.y * GRID_SIZE + 4, 3, 3)
        ctx.fillStyle = themeColor
      }
    })

    // Draw food
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(food.x * GRID_SIZE + 1, food.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2)

    // Draw game over overlay
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
      ctx.fillStyle = "#fff"
      ctx.font = "24px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Game Over!", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 30)
      ctx.font = "16px Arial"
      ctx.fillText(`Score: ${score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2)
      ctx.fillText(`Best: ${bestScore}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 25)
      ctx.textAlign = "left"
    }
  }, [snake, food, gameOver, score, bestScore, themeColor])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameRunning && !gameOver && (event.key === " " || event.key === "Enter")) {
        setGameRunning(true)
        return
      }

      if (gameOver && (event.key === " " || event.key === "Enter")) {
        resetGame()
        return
      }

      if (!gameRunning) return

      switch (event.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 })
          break
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 })
          break
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 })
          break
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameRunning, gameOver, direction, resetGame])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Snake</h1>
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <Card className="p-4 mb-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="border border-gray-300 mx-auto block"
          />
        </Card>

        <div className="text-center space-y-2">
          <div className="flex justify-center gap-4 text-sm text-gray-700">
            <span>Score: {score}</span>
            <span>Best: {bestScore}</span>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setGameRunning(!gameRunning)}
              disabled={gameOver}
              size="sm"
              style={{ backgroundColor: gameRunning ? undefined : themeColor }}
            >
              {gameRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {gameRunning ? "Pause" : "Start"}
            </Button>
          </div>
          <p className="text-sm text-gray-600">Use arrow keys to control the snake</p>
        </div>
      </div>
    </div>
  )
}
