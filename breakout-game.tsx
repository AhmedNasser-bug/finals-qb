"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Zap } from "lucide-react"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PADDLE_WIDTH = 100
const PADDLE_HEIGHT = 15
const BALL_RADIUS = 8
const PADDLE_SPEED = 8
const BRICK_WIDTH = 75
const BRICK_HEIGHT = 20
const BRICK_ROWS = 8
const BRICK_COLS = 10
const BRICK_PADDING = 5

interface Paddle {
  x: number
  y: number
  width: number
  height: number
}
interface Ball {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
}
interface Brick {
  x: number
  y: number
  width: number
  height: number
  visible: boolean
  color: string
}
interface BreakoutGameProps {
  onBack: () => void
  themeColor: string
}

export default function BreakoutGame({ onBack, themeColor }: BreakoutGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver" | "won">("menu")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [highScore, setHighScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const gameStateRef = useRef<{
    paddle: Paddle
    ball: Ball
    bricks: Brick[][]
    score: number
    lives: number
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null
    keys: Set<string>
    isPaused: boolean
  }>({
    paddle: {
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: CANVAS_HEIGHT - 40,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 60, radius: BALL_RADIUS, dx: 4, dy: -4 },
    bricks: [],
    score: 0,
    lives: 3,
    canvas: null,
    ctx: null,
    keys: new Set(),
    isPaused: false,
  })

  const createBricks = useCallback(() => {
    const bricks: Brick[][] = []
    const colors = ["#ff4444", "#ff8844", "#ffcc44", "#44ff44", "#44ccff", "#4488ff", "#8844ff", "#ff44cc"]
    for (let row = 0; row < BRICK_ROWS; row++) {
      bricks[row] = []
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks[row][col] = {
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING + 25,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING + 60,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          visible: true,
          color: colors[row] || "#ffffff",
        }
      }
    }
    return bricks
  }, [])

  const resetBall = useCallback(() => {
    gameStateRef.current.ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 60,
      radius: BALL_RADIUS,
      dx: (Math.random() > 0.5 ? 1 : -1) * 4,
      dy: -4,
    }
  }, [])

  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    gameStateRef.current.paddle = {
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: CANVAS_HEIGHT - 40,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    }
    gameStateRef.current.ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 60, radius: BALL_RADIUS, dx: 4, dy: -4 }
    gameStateRef.current.bricks = createBricks()
    gameStateRef.current.score = 0
    gameStateRef.current.lives = 3
    gameStateRef.current.canvas = canvas
    gameStateRef.current.ctx = canvas.getContext("2d")
    gameStateRef.current.isPaused = false
    setScore(0)
    setLives(3)
    setIsPaused(false)
  }, [createBricks])

  const startGame = useCallback(() => {
    setGameState("playing")
    setIsPaused(false)
    initGame()
  }, [initGame])
  const endGame = useCallback((won: boolean) => {
    setGameState(won ? "won" : "gameOver")
    setHighScore((currentHighScore) => {
      if (gameStateRef.current.score > currentHighScore) {
        return gameStateRef.current.score
      }
      return currentHighScore
    })
    setScore(gameStateRef.current.score)
  }, [])

  const checkCollision = (ball: Ball, rect: { x: number; y: number; width: number; height: number }): boolean => {
    return (
      ball.x + ball.radius > rect.x &&
      ball.x - ball.radius < rect.x + rect.width &&
      ball.y + ball.radius > rect.y &&
      ball.y - ball.radius < rect.y + rect.height
    )
  }

  const updatePaddlePosition = useCallback(() => {
    const { paddle, keys } = gameStateRef.current
    const movingLeft = ["arrowleft", "a"].some((key) => keys.has(key))
    const movingRight = ["arrowright", "d"].some((key) => keys.has(key))
    if (movingLeft && !movingRight) paddle.x = Math.max(0, paddle.x - PADDLE_SPEED)
    else if (movingRight && !movingLeft) paddle.x = Math.min(CANVAS_WIDTH - paddle.width, paddle.x + PADDLE_SPEED)
  }, [])

  const updateGame = useCallback(() => {
    const { paddle, ball, bricks, canvas, ctx } = gameStateRef.current
    if (!canvas || !ctx || gameState !== "playing") return

    if (isPaused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#ffffff"
      ctx.font = "48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2)
      ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      ctx.fillText("Press P or Space to resume", canvas.width / 2, canvas.height / 2 + 40)
      gameLoopRef.current = requestAnimationFrame(updateGame)
      return
    }

    updatePaddlePosition()
    ctx.fillStyle = "#fafafa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ball.x += ball.dx
    ball.y += ball.dy

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1
    if (ball.y - ball.radius < 0) ball.dy *= -1
    if (checkCollision(ball, paddle) && ball.dy > 0) {
      ball.dy *= -1
      ball.dx = ((ball.x - paddle.x) / paddle.width - 0.5) * 8
    }

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const brick = bricks[row][col]
        if (brick.visible && checkCollision(ball, brick)) {
          brick.visible = false
          ball.dy *= -1
          gameStateRef.current.score += 10
          setScore(gameStateRef.current.score)
        }
      }
    }

    if (ball.y + ball.radius > canvas.height) {
      gameStateRef.current.lives--
      setLives(gameStateRef.current.lives)
      if (gameStateRef.current.lives <= 0) {
        endGame(false)
        return
      } else resetBall()
    }

    if (bricks.flat().every((brick) => !brick.visible)) {
      endGame(true)
      return
    }

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const brick = bricks[row][col]
        if (brick.visible) {
          ctx.fillStyle = brick.color
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
        }
      }
    }

    ctx.fillStyle = themeColor
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#171717"
    ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${gameStateRef.current.score}`, 20, 30)
    ctx.fillText(`Lives: ${gameStateRef.current.lives}`, 20, 55)

    gameLoopRef.current = requestAnimationFrame(updateGame)
  }, [gameState, updatePaddlePosition, resetBall, endGame, isPaused, themeColor])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (gameState !== "playing" || isPaused) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      let newX = e.clientX - rect.left - gameStateRef.current.paddle.width / 2
      if (newX < 0) newX = 0
      if (newX + gameStateRef.current.paddle.width > canvas.width)
        newX = canvas.width - gameStateRef.current.paddle.width
      gameStateRef.current.paddle.x = newX
    },
    [gameState, isPaused],
  )

  useEffect(() => {
    initGame()
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys.add(e.key.toLowerCase())
      if (gameState === "playing" && (e.key === "p" || e.key === "P" || e.key === " ")) {
        e.preventDefault()
        setIsPaused((p) => !p)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => gameStateRef.current.keys.delete(e.key.toLowerCase())
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [initGame])

  useEffect(() => {
    if (gameState === "playing") gameLoopRef.current = requestAnimationFrame(updateGame)
    else if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState, updateGame])

  useEffect(() => {
    if (gameState !== "gameOver" && gameState !== "won") return
    const handleEndKeys = (e: KeyboardEvent) => {
      if (e.key === "Enter") startGame()
      else if (e.key === "Escape") setGameState("menu")
    }
    window.addEventListener("keydown", handleEndKeys)
    return () => window.removeEventListener("keydown", handleEndKeys)
  }, [gameState, startGame])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg shadow-sm cursor-none"
          style={{ maxWidth: "100%", height: "auto" }}
          onMouseMove={handleMouseMove}
        />
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
              <div className="mb-6">
                <div
                  className="w-8 h-8 mx-auto mb-4 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: themeColor }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-medium text-gray-900 mb-2">Breakout</h1>
                <p className="text-sm text-gray-600 mb-4">Break all the bricks with your ball</p>
                <div className="bg-gray-50 rounded-lg p-3 text-left text-xs text-gray-600 space-y-1">
                  <div className="font-medium text-gray-800">Controls:</div>
                  <div>
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">←→</kbd> or{" "}
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">A D</kbd> or{" "}
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">Mouse</kbd> to Move
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">P</kbd> or{" "}
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">Space</kbd> to Pause
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="text-white px-6 py-2 text-sm font-medium"
              >
                Start Game
              </Button>
            </Card>
          </div>
        )}
        {(gameState === "gameOver" || gameState === "won") && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
              <h2 className="text-lg font-medium text-gray-500 mb-1">Breakout</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                {gameState === "won" ? "You Win! 🎉" : "Game Over"}
              </h3>
              <div className="space-y-2 mb-6">
                <p className="text-2xl font-mono" style={{ color: themeColor }}>
                  {score}
                </p>
                <p className="text-xs text-gray-500">Best: {highScore}</p>
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
          {gameState === "playing" ? "Use Mouse or Keyboard to move" : "A v0 Mini Game"}
        </p>
      </div>
    </div>
  )
}
