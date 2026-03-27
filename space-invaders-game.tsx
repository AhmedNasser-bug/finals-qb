"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Rocket } from "lucide-react"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PLAYER_WIDTH = 40
const PLAYER_HEIGHT = 30
const PLAYER_SPEED = 6
const BULLET_WIDTH = 4
const BULLET_HEIGHT = 10
const BULLET_SPEED = 8
const INVADER_WIDTH = 30
const INVADER_HEIGHT = 20
const INVADER_ROWS = 5
const INVADER_COLS = 10
const INVADER_SPEED = 1

interface Player {
  x: number
  y: number
  width: number
  height: number
}

interface Bullet {
  x: number
  y: number
  width: number
  height: number
  speed: number
  isPlayerBullet: boolean
}

interface Invader {
  x: number
  y: number
  width: number
  height: number
  alive: boolean
  type: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

interface SpaceInvadersGameProps {
  onBack: () => void
  themeColor: string
}

export default function SpaceInvadersGame({ onBack, themeColor }: SpaceInvadersGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver" | "won">("menu")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [wave, setWave] = useState(1)
  const [highScore, setHighScore] = useState(0)

  const gameStateRef = useRef<{
    player: Player
    bullets: Bullet[]
    invaders: Invader[]
    particles: Particle[]
    score: number
    lives: number
    wave: number
    invaderDirection: number
    lastInvaderMove: number
    lastInvaderShot: number
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null
    keys: Set<string>
  }>({
    player: {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - 60,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    },
    bullets: [],
    invaders: [],
    particles: [],
    score: 0,
    lives: 3,
    wave: 1,
    invaderDirection: 1,
    lastInvaderMove: 0,
    lastInvaderShot: 0,
    canvas: null,
    ctx: null,
    keys: new Set(),
  })

  const createParticles = useCallback((x: number, y: number, color = "#ffffff", count = 8) => {
    for (let i = 0; i < count; i++) {
      gameStateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 30,
        maxLife: 30,
        size: Math.random() * 3 + 1,
        color,
      })
    }
  }, [])

  const createInvaders = useCallback(() => {
    const invaders: Invader[] = []
    const startX = 100
    const startY = 80
    const spacingX = 50
    const spacingY = 40

    for (let row = 0; row < INVADER_ROWS; row++) {
      for (let col = 0; col < INVADER_COLS; col++) {
        invaders.push({
          x: startX + col * spacingX,
          y: startY + row * spacingY,
          width: INVADER_WIDTH,
          height: INVADER_HEIGHT,
          alive: true,
          type: row, // Different types for different rows
        })
      }
    }
    return invaders
  }, [])

  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    gameStateRef.current = {
      player: {
        x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: CANVAS_HEIGHT - 60,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      },
      bullets: [],
      invaders: createInvaders(),
      particles: [],
      score: 0,
      lives: 3,
      wave: 1,
      invaderDirection: 1,
      lastInvaderMove: 0,
      lastInvaderShot: 0,
      canvas,
      ctx: canvas.getContext("2d"),
      keys: new Set(),
    }
    setScore(0)
    setLives(3)
    setWave(1)
  }, [createInvaders])

  const startGame = useCallback(() => {
    setGameState("playing")
    initGame()
  }, [initGame])

  const nextWave = useCallback(() => {
    gameStateRef.current.wave++
    gameStateRef.current.invaders = createInvaders()
    gameStateRef.current.bullets = []
    gameStateRef.current.invaderDirection = 1
    setWave(gameStateRef.current.wave)
  }, [createInvaders])

  const endGame = useCallback(
    (won: boolean) => {
      setGameState(won ? "won" : "gameOver")
      if (gameStateRef.current.score > highScore) {
        setHighScore(gameStateRef.current.score)
      }
      setScore(gameStateRef.current.score)
    },
    [highScore],
  )

  const shoot = useCallback(() => {
    const { player, bullets } = gameStateRef.current
    // Limit player bullets
    const playerBullets = bullets.filter((b) => b.isPlayerBullet)
    if (playerBullets.length < 3) {
      bullets.push({
        x: player.x + player.width / 2 - BULLET_WIDTH / 2,
        y: player.y,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        speed: -BULLET_SPEED,
        isPlayerBullet: true,
      })
    }
  }, [])

  const checkCollision = (rect1: any, rect2: any): boolean => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }

  const updateGame = useCallback(() => {
    const { player, bullets, invaders, particles, canvas, ctx, keys } = gameStateRef.current
    if (!canvas || !ctx || gameState !== "playing") return

    const currentTime = Date.now()

    // Player movement
    if (keys.has("arrowleft") || keys.has("a")) {
      player.x = Math.max(0, player.x - PLAYER_SPEED)
    }
    if (keys.has("arrowright") || keys.has("d")) {
      player.x = Math.min(canvas.width - player.width, player.x + PLAYER_SPEED)
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i]
      bullet.y += bullet.speed

      // Remove bullets that are off screen
      if (bullet.y < 0 || bullet.y > canvas.height) {
        bullets.splice(i, 1)
        continue
      }

      // Check bullet-invader collisions
      if (bullet.isPlayerBullet) {
        for (let j = 0; j < invaders.length; j++) {
          const invader = invaders[j]
          if (invader.alive && checkCollision(bullet, invader)) {
            invader.alive = false
            bullets.splice(i, 1)
            const points = (4 - invader.type) * 10 + gameStateRef.current.wave * 5
            gameStateRef.current.score += points
            setScore(gameStateRef.current.score)
            createParticles(invader.x + invader.width / 2, invader.y + invader.height / 2, themeColor, 12)
            break
          }
        }
      } else {
        // Enemy bullet hitting player
        if (checkCollision(bullet, player)) {
          bullets.splice(i, 1)
          gameStateRef.current.lives--
          setLives(gameStateRef.current.lives)
          createParticles(player.x + player.width / 2, player.y + player.height / 2, "#ff4444", 15)
          if (gameStateRef.current.lives <= 0) {
            endGame(false)
            return
          }
        }
      }
    }

    // Move invaders
    if (currentTime - gameStateRef.current.lastInvaderMove > Math.max(200, 800 - gameStateRef.current.wave * 50)) {
      let shouldMoveDown = false
      const aliveInvaders = invaders.filter((inv) => inv.alive)

      // Check if any invader hits the edge
      for (const invader of aliveInvaders) {
        if (
          (gameStateRef.current.invaderDirection > 0 && invader.x + invader.width >= canvas.width - 20) ||
          (gameStateRef.current.invaderDirection < 0 && invader.x <= 20)
        ) {
          shouldMoveDown = true
          break
        }
      }

      if (shouldMoveDown) {
        gameStateRef.current.invaderDirection *= -1
        for (const invader of aliveInvaders) {
          invader.y += 20
          // Check if invaders reached the player
          if (invader.y + invader.height >= player.y) {
            endGame(false)
            return
          }
        }
      } else {
        for (const invader of aliveInvaders) {
          invader.x += INVADER_SPEED * gameStateRef.current.invaderDirection
        }
      }
      gameStateRef.current.lastInvaderMove = currentTime
    }

    // Invader shooting
    if (currentTime - gameStateRef.current.lastInvaderShot > 1000 + Math.random() * 2000) {
      const aliveInvaders = invaders.filter((inv) => inv.alive)
      if (aliveInvaders.length > 0) {
        const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)]
        bullets.push({
          x: shooter.x + shooter.width / 2 - BULLET_WIDTH / 2,
          y: shooter.y + shooter.height,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          speed: BULLET_SPEED * 0.6,
          isPlayerBullet: false,
        })
      }
      gameStateRef.current.lastInvaderShot = currentTime
    }

    // Check win condition
    const aliveInvaders = invaders.filter((inv) => inv.alive)
    if (aliveInvaders.length === 0) {
      setTimeout(() => nextWave(), 1000)
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.98
      p.vy *= 0.98
      p.life--
      if (p.life <= 0) particles.splice(i, 1)
    }

    // Drawing
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw stars background
    ctx.fillStyle = "#ffffff"
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % canvas.width
      const y = (i * 73.3) % canvas.height
      ctx.fillRect(x, y, 1, 1)
    }

    // Draw particles
    particles.forEach((p) => {
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life / p.maxLife
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1

    // Draw player
    ctx.fillStyle = themeColor
    ctx.fillRect(player.x, player.y, player.width, player.height)
    // Player details
    ctx.fillRect(player.x + 5, player.y - 5, 5, 5)
    ctx.fillRect(player.x + player.width - 10, player.y - 5, 5, 5)
    ctx.fillRect(player.x + player.width / 2 - 2, player.y - 8, 4, 8)

    // Draw invaders
    const invaderColors = ["#ff4444", "#ff8844", "#ffcc44", "#44ff44", "#44ccff"]
    invaders.forEach((invader) => {
      if (invader.alive) {
        ctx.fillStyle = invaderColors[invader.type] || "#ffffff"
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height)
        // Simple invader details
        ctx.fillStyle = "#000000"
        ctx.fillRect(invader.x + 5, invader.y + 5, 4, 4)
        ctx.fillRect(invader.x + invader.width - 9, invader.y + 5, 4, 4)
        ctx.fillRect(invader.x + 8, invader.y + 12, invader.width - 16, 3)
      }
    })

    // Draw bullets
    bullets.forEach((bullet) => {
      ctx.fillStyle = bullet.isPlayerBullet ? themeColor : "#ff4444"
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    })

    // Draw UI
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${gameStateRef.current.score}`, 20, 30)
    ctx.fillText(`Lives: ${gameStateRef.current.lives}`, 20, 55)
    ctx.fillText(`Wave: ${gameStateRef.current.wave}`, 20, 80)

    gameLoopRef.current = requestAnimationFrame(updateGame)
  }, [gameState, themeColor, createParticles, endGame, nextWave])

  useEffect(() => {
    initGame()
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys.add(e.key.toLowerCase())
      if (gameState === "playing" && e.key === " ") {
        e.preventDefault()
        shoot()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys.delete(e.key.toLowerCase())
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [initGame, gameState, shoot])

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
    if (gameState !== "gameOver" && gameState !== "won") return
    const handleEndKeys = (e: KeyboardEvent) => {
      if (e.key === "Enter") startGame()
      else if (e.key === "Escape") setGameState("menu")
    }
    window.addEventListener("keydown", handleEndKeys)
    return () => window.removeEventListener("keydown", handleEndKeys)
  }, [gameState, startGame])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-800 rounded-lg shadow-sm"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-800 shadow-sm bg-black text-white w-96">
              <div className="mb-6">
                <div
                  className="w-8 h-8 mx-auto mb-4 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: themeColor }}
                >
                  <Rocket className="w-5 h-5 text-black" />
                </div>
                <h1 className="text-2xl font-medium text-white mb-2">Space Invaders</h1>
                <p className="text-sm text-gray-400 mb-4">Defend Earth from the alien invasion!</p>
                <div className="bg-gray-900 rounded-lg p-3 text-left text-xs text-gray-300 space-y-1">
                  <div className="font-medium text-white">Controls:</div>
                  <div>
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">←→</kbd> or{" "}
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">A D</kbd> to Move
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">Space</kbd> to Shoot
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="text-black px-6 py-2 text-sm font-medium"
              >
                Start Defense
              </Button>
              {highScore > 0 && <p className="mt-4 text-xs text-gray-500">High Score: {highScore}</p>}
            </Card>
          </div>
        )}
        {(gameState === "gameOver" || gameState === "won") && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-800 shadow-sm bg-black text-white w-96">
              <h2 className="text-lg font-medium text-gray-500 mb-1">Space Invaders</h2>
              <h3 className="text-xl font-medium text-white mb-4">
                {gameState === "won" ? "Victory! 🚀" : "Earth Invaded! 💥"}
              </h3>
              <div className="space-y-2 mb-6">
                <p className="text-2xl font-mono" style={{ color: themeColor }}>
                  {score}
                </p>
                <p className="text-sm text-gray-400">Wave {wave}</p>
                <p className="text-xs text-gray-500">High Score: {highScore}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={startGame}
                  style={{ backgroundColor: themeColor }}
                  className="text-black px-4 py-2 text-sm font-medium"
                >
                  Defend Again
                </Button>
                <Button
                  onClick={() => setGameState("menu")}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-4 py-2 text-sm font-medium"
                >
                  Menu
                </Button>
              </div>
              <div className="mt-4 text-xs text-gray-500 space-x-4">
                <span>
                  <kbd className="px-1 py-0.5 bg-gray-700 rounded border-gray-600 text-xs">Enter</kbd> Again
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-gray-700 rounded border-gray-600 text-xs">Esc</kbd> Menu
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          {gameState === "playing" ? "Use arrow keys or WASD to move, Space to shoot" : "A v0 Mini Game"}
        </p>
      </div>
    </div>
  )
}
