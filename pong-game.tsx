"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  speed: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

interface PongGameProps {
  onBack?: () => void
  themeColor?: string
}

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 80
const BALL_SIZE = 10
const INITIAL_BALL_SPEED = 4

export default function PongGame({ onBack, themeColor = "#3b82f6" }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED,
  })
  const [playerPaddle, setPlayerPaddle] = useState<Paddle>({
    x: 20,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 6,
  })
  const [aiPaddle, setAiPaddle] = useState<Paddle>({
    x: CANVAS_WIDTH - 30,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 4,
  })
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({})

  const resetBall = useCallback(() => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: Math.random() > 0.5 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED,
      dy: (Math.random() - 0.5) * INITIAL_BALL_SPEED,
      speed: INITIAL_BALL_SPEED,
    })
  }, [])

  const resetGame = useCallback(() => {
    setPlayerScore(0)
    setAiScore(0)
    setGameRunning(false)
    setGameOver(false)
    resetBall()
    setPlayerPaddle((prev) => ({ ...prev, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 }))
    setAiPaddle((prev) => ({ ...prev, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 }))
  }, [resetBall])

  const checkCollision = useCallback((ball: Ball, paddle: Paddle): boolean => {
    return (
      ball.x < paddle.x + paddle.width &&
      ball.x + BALL_SIZE > paddle.x &&
      ball.y < paddle.y + paddle.height &&
      ball.y + BALL_SIZE > paddle.y
    )
  }, [])

  const gameLoop = useCallback(() => {
    if (!gameRunning || gameOver) return

    // Move player paddle
    setPlayerPaddle((prev) => {
      let newY = prev.y
      if (keys["ArrowUp"] && newY > 0) {
        newY -= prev.speed
      }
      if (keys["ArrowDown"] && newY < CANVAS_HEIGHT - prev.height) {
        newY += prev.speed
      }
      return { ...prev, y: newY }
    })

    // Move AI paddle
    setAiPaddle((prev) => {
      const ballCenterY = ball.y + BALL_SIZE / 2
      const paddleCenterY = prev.y + prev.height / 2
      let newY = prev.y

      if (ballCenterY < paddleCenterY - 10) {
        newY -= prev.speed
      } else if (ballCenterY > paddleCenterY + 10) {
        newY += prev.speed
      }

      newY = Math.max(0, Math.min(CANVAS_HEIGHT - prev.height, newY))
      return { ...prev, y: newY }
    })

    // Move ball
    setBall((prev) => {
      const newBall = {
        ...prev,
        x: prev.x + prev.dx,
        y: prev.y + prev.dy,
      }

      // Ball collision with top and bottom walls
      if (newBall.y <= 0 || newBall.y >= CANVAS_HEIGHT - BALL_SIZE) {
        newBall.dy = -newBall.dy
      }

      // Ball collision with paddles
      if (checkCollision(newBall, playerPaddle)) {
        newBall.dx = Math.abs(newBall.dx)
        newBall.speed += 0.2
        newBall.dx = newBall.speed * (newBall.dx > 0 ? 1 : -1)
      }

      if (checkCollision(newBall, aiPaddle)) {
        newBall.dx = -Math.abs(newBall.dx)
        newBall.speed += 0.2
        newBall.dx = newBall.speed * (newBall.dx > 0 ? 1 : -1)
      }

      // Ball goes off screen (scoring)
      if (newBall.x <= 0) {
        setAiScore((prev) => prev + 1)
        setTimeout(resetBall, 1000)
        return prev
      }

      if (newBall.x >= CANVAS_WIDTH) {
        setPlayerScore((prev) => prev + 1)
        setTimeout(resetBall, 1000)
        return prev
      }

      return newBall
    })
  }, [gameRunning, gameOver, keys, ball, playerPaddle, aiPaddle, checkCollision, resetBall])

  // Game loop
  useEffect(() => {
    const interval = setInterval(gameLoop, 16)
    return () => clearInterval(interval)
  }, [gameLoop])

  // Check for game over
  useEffect(() => {
    if (playerScore >= 5 || aiScore >= 5) {
      setGameOver(true)
      setGameRunning(false)
    }
  }, [playerScore, aiScore])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw center line
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2, 0)
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw paddles
    ctx.fillStyle = themeColor
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height)
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height)

    // Draw ball
    ctx.fillStyle = "#fff"
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE)

    // Draw scores
    ctx.fillStyle = "#fff"
    ctx.font = "32px Arial"
    ctx.textAlign = "center"
    ctx.fillText(playerScore.toString(), CANVAS_WIDTH / 4, 50)
    ctx.fillText(aiScore.toString(), (3 * CANVAS_WIDTH) / 4, 50)

    // Draw game over overlay
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = "#fff"
      ctx.font = "24px Arial"
      ctx.fillText("Game Over!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30)
      ctx.font = "18px Arial"
      const winner = playerScore > aiScore ? "You Win!" : "AI Wins!"
      ctx.fillText(winner, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      ctx.fillText("Press Reset to play again", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
    }

    ctx.textAlign = "left"
  }, [ball, playerPaddle, aiPaddle, playerScore, aiScore, gameOver, themeColor])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [event.key]: true }))
      if (event.key === " ") {
        event.preventDefault()
        if (!gameRunning && !gameOver) {
          setGameRunning(true)
        }
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [event.key]: false }))
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameRunning, gameOver])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Pong</h1>
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <Card className="p-4 mb-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-gray-300 mx-auto block"
          />
        </Card>

        <div className="text-center space-y-2">
          <div className="flex justify-center gap-8 text-lg font-semibold text-gray-700">
            <span>You: {playerScore}</span>
            <span>AI: {aiScore}</span>
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
          <p className="text-sm text-gray-600">Use arrow keys to move your paddle • First to 5 wins!</p>
        </div>
      </div>
    </div>
  )
}
