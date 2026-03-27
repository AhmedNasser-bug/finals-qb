"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PawPrint } from "lucide-react"

interface Sheep {
  x: number
  y: number
  velocity: number
  width: number
  height: number
  onGround: boolean
  animFrame: number
}

interface Hazard {
  x: number
  y: number
  width: number
  height: number
  type: "bush" | "wolf"
}

const GRAVITY = 0.9
const JUMP_FORCE = -18
const GROUND_Y = 500
const SHEEP_WIDTH = 50
const SHEEP_HEIGHT = 50

const WOLF_WIDTH = 60
const WOLF_HEIGHT = 40
const WOLF_Y_HIGH = GROUND_Y - 100 // Player must jump
const WOLF_Y_MIDDLE = GROUND_Y - 60 // Player must not jump

interface SheepRunGameProps {
  onBack: () => void
  themeColor: string
}

const drawSheep = (ctx: CanvasRenderingContext2D, sheep: Sheep, themeColor: string) => {
  ctx.fillStyle = themeColor
  const legFrame = sheep.onGround ? Math.floor(sheep.animFrame / 4) % 2 : 0

  // Body (oval shape for fluffiness)
  ctx.beginPath()
  ctx.ellipse(
    sheep.x + sheep.width / 2,
    sheep.y + sheep.height / 2,
    sheep.width / 2,
    sheep.height / 2 - 5,
    0,
    0,
    Math.PI * 2,
  )
  ctx.fill()

  // Head
  ctx.fillRect(sheep.x + sheep.width - 15, sheep.y + 10, 20, 15)
  // Ears
  ctx.fillRect(sheep.x + sheep.width - 10, sheep.y + 5, 5, 5)
  ctx.fillRect(sheep.x + sheep.width + 5, sheep.y + 5, 5, 5)

  // Legs
  ctx.fillStyle = "#171717" // Darker color for legs
  if (legFrame === 0) {
    ctx.fillRect(sheep.x + 10, sheep.y + sheep.height - 15, 10, 15)
    ctx.fillRect(sheep.x + 30, sheep.y + sheep.height - 15, 10, 15)
  } else {
    ctx.fillRect(sheep.x + 5, sheep.y + sheep.height - 15, 10, 15)
    ctx.fillRect(sheep.x + 35, sheep.y + sheep.height - 15, 10, 15)
  }

  // Eye
  ctx.fillStyle = "#fafafa"
  ctx.fillRect(sheep.x + sheep.width - 5, sheep.y + 15, 3, 3)
}

const drawBush = (ctx: CanvasRenderingContext2D, hazard: Hazard) => {
  ctx.fillStyle = "#22c55e" // Green color for bushes
  ctx.beginPath()
  ctx.ellipse(
    hazard.x + hazard.width / 2,
    hazard.y + hazard.height / 2,
    hazard.width / 2,
    hazard.height / 2,
    0,
    0,
    Math.PI * 2,
  )
  ctx.fill()
  // Add some darker spots for texture
  ctx.fillStyle = "#16a34a"
  ctx.beginPath()
  ctx.arc(hazard.x + hazard.width * 0.2, hazard.y + hazard.height * 0.4, hazard.width * 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(hazard.x + hazard.width * 0.7, hazard.y + hazard.height * 0.6, hazard.width * 0.1, 0, Math.PI * 2)
  ctx.fill()
}

const drawWolf = (ctx: CanvasRenderingContext2D, hazard: Hazard, animFrame: number) => {
  ctx.fillStyle = "#404040" // Dark grey for wolf
  const wingYOffset = Math.sin(animFrame / 5) * 5 // Simple up/down movement

  // Body
  ctx.fillRect(hazard.x, hazard.y + 10 + wingYOffset, hazard.width, hazard.height - 20)
  // Head
  ctx.fillRect(hazard.x + hazard.width - 20, hazard.y + wingYOffset, 20, 20)
  // Snout
  ctx.fillRect(hazard.x + hazard.width - 10, hazard.y + 15 + wingYOffset, 10, 5)
  // Ears
  ctx.fillRect(hazard.x + hazard.width - 15, hazard.y + wingYOffset, 5, 5)
  ctx.fillRect(hazard.x + hazard.width, hazard.y + wingYOffset, 5, 5)
  // Legs (simple lines)
  ctx.fillRect(hazard.x + 10, hazard.y + hazard.height - 10 + wingYOffset, 5, 10)
  ctx.fillRect(hazard.x + hazard.width - 15, hazard.y + hazard.height - 10 + wingYOffset, 5, 10)
}

export default function SheepRunGame({ onBack, themeColor }: SheepRunGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const gameStateRef = useRef<{
    sheep: Sheep
    hazards: Hazard[]
    distance: number
    speed: number
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null
  }>({
    sheep: {
      x: 80,
      y: GROUND_Y - SHEEP_HEIGHT,
      velocity: 0,
      width: SHEEP_WIDTH,
      height: SHEEP_HEIGHT,
      onGround: true,
      animFrame: 0,
    },
    hazards: [],
    distance: 0,
    speed: 6,
    canvas: null,
    ctx: null,
  })

  const createHazard = useCallback((x: number) => {
    const isWolf = Math.random() > 0.65 // 35% chance for a wolf
    if (isWolf) {
      const wolfY = Math.random() > 0.5 ? WOLF_Y_MIDDLE : WOLF_Y_HIGH
      gameStateRef.current.hazards.push({
        x,
        y: wolfY,
        width: WOLF_WIDTH,
        height: WOLF_HEIGHT,
        type: "wolf",
      })
    } else {
      const bushTypes = [
        { width: 30, height: 30 },
        { width: 50, height: 30 },
        { width: 70, height: 30 },
      ]
      const type = bushTypes[Math.floor(Math.random() * bushTypes.length)]
      gameStateRef.current.hazards.push({
        x,
        y: GROUND_Y - type.height,
        width: type.width,
        height: type.height,
        type: "bush",
      })
    }
  }, [])

  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 800
    canvas.height = 600
    gameStateRef.current = {
      sheep: {
        x: 80,
        y: GROUND_Y - SHEEP_HEIGHT,
        velocity: 0,
        width: SHEEP_WIDTH,
        height: SHEEP_HEIGHT,
        onGround: true,
        animFrame: 0,
      },
      hazards: [],
      distance: 0,
      speed: 6,
      canvas,
      ctx: canvas.getContext("2d"),
    }
    createHazard(canvas.width)
  }, [createHazard])

  const jump = useCallback(() => {
    if (gameState === "playing" && gameStateRef.current.sheep.onGround) {
      gameStateRef.current.sheep.velocity = JUMP_FORCE
      gameStateRef.current.sheep.onGround = false
    }
  }, [gameState])

  const startGame = useCallback(() => {
    setGameState("playing")
    setScore(0)
    initGame()
  }, [initGame])

  const endGame = () => {
    setGameState("gameOver")
    const finalScore = Math.floor(gameStateRef.current.distance)
    if (finalScore > highScore) {
      setHighScore(finalScore)
    }
    setScore(finalScore)
  }

  const checkCollision = (sheep: Sheep, hazards: Hazard[]): boolean => {
    for (const hazard of hazards) {
      if (
        sheep.x < hazard.x + hazard.width &&
        sheep.x + sheep.width > hazard.x &&
        sheep.y < hazard.y + hazard.height &&
        sheep.y + sheep.height > hazard.y
      ) {
        return true
      }
    }
    return false
  }

  const updateGame = useCallback(() => {
    const { sheep, hazards, canvas, ctx } = gameStateRef.current
    if (!canvas || !ctx) return

    gameStateRef.current.distance += gameStateRef.current.speed / 10
    gameStateRef.current.speed += 0.003 // Gradually increase speed
    sheep.animFrame++

    ctx.fillStyle = "#fafafa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw ground
    ctx.strokeStyle = "#171717"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(canvas.width, GROUND_Y)
    ctx.stroke()

    // Update and draw sheep
    sheep.velocity += GRAVITY
    sheep.y += sheep.velocity
    if (sheep.y + sheep.height >= GROUND_Y) {
      sheep.y = GROUND_Y - sheep.height
      sheep.velocity = 0
      sheep.onGround = true
    }
    drawSheep(ctx, sheep, themeColor)

    // Update and draw hazards
    for (let i = hazards.length - 1; i >= 0; i--) {
      const hazard = hazards[i]
      hazard.x -= gameStateRef.current.speed
      if (hazard.x + hazard.width < 0) {
        hazards.splice(i, 1)
      }
      if (hazard.type === "bush") {
        drawBush(ctx, hazard)
      } else {
        drawWolf(ctx, hazard, sheep.animFrame)
      }
    }

    if (hazards.length === 0 || hazards[hazards.length - 1].x < canvas.width - 250 - Math.random() * 200) {
      createHazard(canvas.width)
    }

    if (checkCollision(sheep, hazards)) {
      endGame()
      return
    }

    // Draw score
    ctx.fillStyle = "#171717"
    ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "right"
    ctx.fillText(`HI ${Math.floor(highScore)}  ${Math.floor(gameStateRef.current.distance)}`, canvas.width - 20, 30)

    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(updateGame)
    }
  }, [gameState, themeColor, highScore, createHazard])

  useEffect(() => {
    initGame()
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault()
        if (gameState === "menu" || gameState === "gameOver") {
          startGame()
        } else {
          jump()
        }
      }
    }
    const handleClick = () => {
      if (gameState === "menu" || gameState === "gameOver") {
        startGame()
      } else {
        jump()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    const canvas = canvasRef.current
    canvas?.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      canvas?.removeEventListener("click", handleClick)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [jump, initGame, startGame, gameState])

  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(updateGame)
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState, updateGame])

  useEffect(() => {
    if (gameState !== "gameOver") return
    const handleGameOverKeys = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.code === "Space") startGame()
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
          className="border border-gray-200 rounded-lg shadow-sm"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
              <div className="mb-6">
                <div className="w-8 h-8 mx-auto mb-4 flex items-center justify-center" style={{ color: themeColor }}>
                  <PawPrint className="w-full h-full" />
                </div>
                <h1 className="text-2xl font-medium text-gray-900 mb-2">Sheep Run</h1>
                <p className="text-sm text-gray-600 mb-4">Jump over bushes and dodge wolves to survive.</p>
                <div className="bg-gray-50 rounded-lg p-3 text-left text-xs text-gray-600 space-y-1">
                  <div className="font-medium text-gray-800">Controls:</div>
                  <div>
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">Space</kbd>,{" "}
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">↑</kbd>, or{" "}
                    <kbd className="px-2 py-1 bg-white rounded border text-xs">Mouse Click</kbd> to Jump
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="text-white px-6 py-2 text-sm font-medium"
              >
                Start
              </Button>
              {highScore > 0 && <p className="mt-4 text-xs text-gray-500">High Score: {Math.floor(highScore)}</p>}
            </Card>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
              <h2 className="text-lg font-medium text-gray-500 mb-1">Sheep Run</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Game Over</h3>
              <div className="space-y-2 mb-6">
                <p className="text-2xl font-mono" style={{ color: themeColor }}>
                  {score}
                </p>
                <p className="text-xs text-gray-500">High Score: {highScore}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={startGame}
                  style={{ backgroundColor: themeColor }}
                  className="text-white px-4 py-2 text-sm font-medium"
                >
                  Again
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
          {gameState === "playing" ? "Click, Space, or ↑ to jump" : "A v0 Mini Game"}
        </p>
      </div>
    </div>
  )
}
