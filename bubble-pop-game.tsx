"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, RotateCcw } from "lucide-react"

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  color: string
  type: "normal" | "bonus" | "bomb" | "multiplier"
  speed: number
  opacity: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
  maxLife: number
}

interface BubblePopGameProps {
  onBack: () => void
  themeColor: string
}

export default function BubblePopGame({ onBack, themeColor }: BubblePopGameProps) {
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [combo, setCombo] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [multiplierTimeLeft, setMultiplierTimeLeft] = useState(0)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [nextBubbleId, setNextBubbleId] = useState(0)
  const [nextParticleId, setNextParticleId] = useState(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bubble-pop-best-score")
    if (saved) setBestScore(Number.parseInt(saved))
  }, [])

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("bubble-pop-best-score", score.toString())
    }
  }, [score, bestScore])

  const createBubble = useCallback(() => {
    if (!gameAreaRef.current) return null

    const rect = gameAreaRef.current.getBoundingClientRect()
    const types: Bubble["type"][] = ["normal", "normal", "normal", "bonus", "bomb", "multiplier"]
    const type = types[Math.floor(Math.random() * types.length)]

    const colors = {
      normal: "#3b82f6",
      bonus: "#f59e0b",
      bomb: "#ef4444",
      multiplier: "#8b5cf6",
    }

    return {
      id: nextBubbleId,
      x: Math.random() * (rect.width - 60) + 30,
      y: rect.height + 30,
      size: type === "bomb" ? 35 : Math.random() * 20 + 25,
      color: colors[type],
      type,
      speed: Math.random() * 2 + 1,
      opacity: 1,
    }
  }, [nextBubbleId])

  const createParticles = useCallback(
    (x: number, y: number, color: string, count = 8) => {
      const newParticles: Particle[] = []
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = Math.random() * 3 + 2
        newParticles.push({
          id: nextParticleId + i,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          life: 30,
          maxLife: 30,
        })
      }
      setNextParticleId((prev) => prev + count)
      return newParticles
    },
    [nextParticleId],
  )

  const popBubble = useCallback(
    (bubble: Bubble) => {
      const newParticles = createParticles(bubble.x, bubble.y, bubble.color)
      setParticles((prev) => [...prev, ...newParticles])

      let points = 0
      let comboChange = 0

      switch (bubble.type) {
        case "normal":
          points = 10
          comboChange = 1
          break
        case "bonus":
          points = 25
          comboChange = 1
          break
        case "bomb":
          points = -15
          comboChange = -combo
          setTimeLeft((prev) => Math.max(0, prev - 3)) // Reduce time by 3 seconds
          break
        case "multiplier":
          points = 15
          comboChange = 1
          setMultiplier(2)
          setMultiplierTimeLeft(5000) // 5 seconds
          break
      }

      const finalPoints = Math.max(0, points * multiplier)
      setScore((prev) => Math.max(0, prev + finalPoints))
      setCombo((prev) => Math.max(0, prev + comboChange))

      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id))
    },
    [combo, multiplier, createParticles],
  )

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return

    const interval = setInterval(() => {
      // Update bubbles
      setBubbles((prev) => {
        const updated = prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
          }))
          .filter((bubble) => bubble.y > -50)

        // Add new bubble occasionally
        if (Math.random() < 0.03 && updated.length < 8) {
          const newBubble = createBubble()
          if (newBubble) {
            setNextBubbleId((prev) => prev + 1)
            return [...updated, newBubble]
          }
        }

        return updated
      })

      // Update particles
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            life: particle.life - 1,
          }))
          .filter((particle) => particle.life > 0),
      )

      // Update multiplier
      setMultiplierTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 50)
        if (newTime === 0 && multiplier > 1) {
          setMultiplier(1)
        }
        return newTime
      })

      // Update timer
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setGameState("gameOver")
          return 0
        }
        return prev - 0.05
      })
    }, 50)

    return () => clearInterval(interval)
  }, [gameState, createBubble, multiplier])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(60)
    setCombo(0)
    setMultiplier(1)
    setMultiplierTimeLeft(0)
    setBubbles([])
    setParticles([])
    setNextBubbleId(0)
    setNextParticleId(0)
  }

  const resetGame = () => {
    setGameState("menu")
    setBubbles([])
    setParticles([])
  }

  if (gameState === "menu") {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: "#f0f9ff" }}
      >
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bubble Pop</h1>
              <p className="text-gray-600">Pop colorful bubbles and build combos!</p>
            </div>

            <div className="space-y-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center justify-between">
                <span>🔵 Normal Bubble</span>
                <span>10 points</span>
              </div>
              <div className="flex items-center justify-between">
                <span>⭐ Bonus Bubble</span>
                <span>25 points</span>
              </div>
              <div className="flex items-center justify-between">
                <span>💣 Bomb Bubble</span>
                <span>-15 points, -3 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span>✨ Multiplier Bubble</span>
                <span>2x points for 5s</span>
              </div>
            </div>

            {bestScore > 0 && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-2xl font-bold" style={{ color: themeColor }}>
                  {bestScore.toLocaleString()}
                </p>
              </div>
            )}

            <Button onClick={startGame} className="w-full" style={{ backgroundColor: themeColor }}>
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "gameOver") {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: "#f0f9ff" }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Game Over!</h1>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Final Score</p>
                <p className="text-3xl font-bold" style={{ color: themeColor }}>
                  {score.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">{bestScore.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Max Combo</p>
                <p className="text-xl font-bold" style={{ color: themeColor }}>
                  x{combo}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={startGame} className="flex-1" style={{ backgroundColor: themeColor }}>
                <Play className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button onClick={resetGame} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 min-w-[120px]">
          <div className="text-xs text-gray-600">Score</div>
          <div className="text-xl font-bold text-gray-900">{score.toLocaleString()}</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 min-w-[80px] text-center">
          <div className="text-xs text-gray-600">Time</div>
          <div className="text-xl font-bold text-gray-900">{Math.ceil(timeLeft)}</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 min-w-[100px] text-center">
          <div className="text-xs text-gray-600">Combo</div>
          <div className="text-xl font-bold" style={{ color: themeColor }}>
            x{combo}
          </div>
        </div>
      </div>

      {/* Multiplier indicator */}
      {multiplier > 1 && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
            2X MULTIPLIER! {Math.ceil(multiplierTimeLeft / 1000)}s
          </div>
        </div>
      )}

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="absolute inset-0 cursor-crosshair"
        onClick={(e) => {
          const rect = gameAreaRef.current?.getBoundingClientRect()
          if (!rect) return

          const clickX = e.clientX - rect.left
          const clickY = e.clientY - rect.top

          const clickedBubble = bubbles.find((bubble) => {
            const distance = Math.sqrt(Math.pow(clickX - bubble.x, 2) + Math.pow(clickY - bubble.y, 2))
            return distance <= bubble.size
          })

          if (clickedBubble) {
            popBubble(clickedBubble)
          }
        }}
      >
        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full cursor-pointer transition-transform hover:scale-110"
            style={{
              left: bubble.x - bubble.size,
              top: bubble.y - bubble.size,
              width: bubble.size * 2,
              height: bubble.size * 2,
              backgroundColor: bubble.color,
              opacity: bubble.opacity,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              animation: bubble.type === "bomb" ? "pulse 1s infinite" : undefined,
            }}
          >
            <div
              className="absolute inset-2 rounded-full bg-white opacity-30"
              style={{
                top: bubble.size * 0.3,
                left: bubble.size * 0.3,
                width: bubble.size * 0.6,
                height: bubble.size * 0.6,
              }}
            />
          </div>
        ))}

        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              opacity: particle.life / particle.maxLife,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
