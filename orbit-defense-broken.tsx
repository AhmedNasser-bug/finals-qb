"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface Enemy {
  id: number
  x: number
  y: number
  health: number
  maxHealth: number
  speed: number
  angle: number
  radius: number
}

interface Tower {
  id: number
  x: number
  y: number
  range: number
  damage: number
  fireRate: number
  lastFired: number
  type: "basic" | "rapid" | "heavy"
  cost: number
}

interface Projectile {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  damage: number
  speed: number
}

interface OrbitDefenseProps {
  onBack?: () => void
  themeColor?: string
}

const CANVAS_SIZE = 400
const CENTER_X = CANVAS_SIZE / 2
const CENTER_Y = CANVAS_SIZE / 2
const CORE_RADIUS = 30

const TOWER_TYPES = {
  basic: { damage: 20, range: 80, fireRate: 1000, cost: 50, color: "#3b82f6" },
  rapid: { damage: 10, range: 60, fireRate: 300, cost: 75, color: "#ef4444" },
  heavy: { damage: 50, range: 100, fireRate: 2000, cost: 100, color: "#8b5cf6" },
}

export default function OrbitDefense({ onBack, themeColor = "#6366f1" }: OrbitDefenseProps) {
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [towers, setTowers] = useState<Tower[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [score, setScore] = useState(0)
  const [money, setMoney] = useState(200)
  const [wave, setWave] = useState(1)
  const [lives, setLives] = useState(10)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [selectedTowerType, setSelectedTowerType] = useState<keyof typeof TOWER_TYPES>("basic")
  const [enemySpawnTimer, setEnemySpawnTimer] = useState(0)

  const spawnEnemy = useCallback(() => {
    const angle = Math.random() * Math.PI * 2
    const distance = 250
    const newEnemy: Enemy = {
      id: Date.now() + Math.random(),
      x: CENTER_X + Math.cos(angle) * distance,
      y: CENTER_Y + Math.sin(angle) * distance,
      health: 50 + wave * 10,
      maxHealth: 50 + wave * 10,
      speed: 0.5 + wave * 0.1,
      angle: angle + Math.PI,
      radius: distance,
    }
    setEnemies((prev) => [...prev, newEnemy])
  }, [wave])

  const placeTower = (x: number, y: number) => {
    const towerType = TOWER_TYPES[selectedTowerType]
    if (money >= towerType.cost) {
      const newTower: Tower = {
        id: Date.now(),
        x,
        y,
        range: towerType.range,
        damage: towerType.damage,
        fireRate: towerType.fireRate,
        lastFired: 0,
        type: selectedTowerType,
        cost: towerType.cost,
      }
      setTowers((prev) => [...prev, newTower])
      setMoney((prev) => prev - towerType.cost)
    }
  }

  const gameLoop = useCallback(() => {
    if (!gameRunning || gameOver) return

    const currentTime = Date.now()

    // Move enemies
    setEnemies((prevEnemies) => {
      return prevEnemies
        .map((enemy) => {
          const newRadius = enemy.radius - enemy.speed
          if (newRadius <= CORE_RADIUS) {
            setLives((prev) => prev - 1)
            return null
          }
          return {
            ...enemy,
            radius: newRadius,
            x: CENTER_X + Math.cos(enemy.angle) * newRadius,
            y: CENTER_Y + Math.sin(enemy.angle) * newRadius,
          }
        })
        .filter(Boolean) as Enemy[]
    })

    // Tower shooting
    setProjectiles((prevProjectiles) => {
      const newProjectiles = [...prevProjectiles]

      towers.forEach((tower) => {
        if (currentTime - tower.lastFired > tower.fireRate) {
          const nearestEnemy = enemies
            .filter((enemy) => {
              const distance = Math.sqrt((enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2)
              return distance <= tower.range
            })
            .sort((a, b) => a.radius - b.radius)[0]

          if (nearestEnemy) {
            newProjectiles.push({
              id: Date.now() + Math.random(),
              x: tower.x,
              y: tower.y,
              targetX: nearestEnemy.x,
              targetY: nearestEnemy.y,
              damage: tower.damage,
              speed: 5,
            })
            tower.lastFired = currentTime
          }
        }
      })

      return newProjectiles
    })

    // Move projectiles
    setProjectiles((prevProjectiles) => {
      return prevProjectiles
        .map((projectile) => {
          const dx = projectile.targetX - projectile.x
          const dy = projectile.targetY - projectile.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < projectile.speed) {
            // Hit target
            setEnemies(
              (prevEnemies) =>
                prevEnemies
                  .map((enemy) => {
                    const enemyDistance = Math.sqrt(
                      (enemy.x - projectile.targetX) ** 2 + (enemy.y - projectile.targetY) ** 2,
                    )
                    if (enemyDistance < 20) {
                      const newHealth = enemy.health - projectile.damage
                      if (newHealth <= 0) {
                        setScore((prev) => prev + 10)
                        setMoney((prev) => prev + 15)
                        return null
                      }
                      return { ...enemy, health: newHealth }
                    }
                    return enemy
                  })
                  .filter(Boolean) as Enemy[],
            )
            return null
          }

          const moveX = (dx / distance) * projectile.speed
          const moveY = (dy / distance) * projectile.speed

          return {
            ...projectile,
            x: projectile.x + moveX,
            y: projectile.y + moveY,
          }
        })
        .filter(Boolean) as Projectile[]
    })

    // Spawn enemies
    setEnemySpawnTimer((prev) => {
      if (prev <= 0) {
        spawnEnemy()
        return 2000 - wave * 100 // Spawn faster each wave
      }
      return prev - 16
    })
  }, [gameRunning, gameOver, enemies, towers, wave, spawnEnemy])

  useEffect(() => {
    const interval = setInterval(gameLoop, 16)
    return () => clearInterval(interval)
  }, [gameLoop])

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true)
      setGameRunning(false)
    }
  }, [lives])

  const resetGame = () => {
    setEnemies([])
    setTowers([])
    setProjectiles([])
    setScore(0)
    setMoney(200)
    setWave(1)
    setLives(10)
    setGameRunning(false)
    setGameOver(false)
    setEnemySpawnTimer(0)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver) return

    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is not too close to center or existing towers
    const distanceFromCenter = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2)
    const tooCloseToTower = towers.some((tower) => {
      const distance = Math.sqrt((tower.x - x) ** 2 + (tower.y - y) ** 2)
      return distance < 40
    })

    if (distanceFromCenter > CORE_RADIUS + 20 && !tooCloseToTower) {
      placeTower(x, y)
    }
  }

  // Canvas drawing
  useEffect(() => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw orbit rings
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      ctx.arc(CENTER_X, CENTER_Y, CORE_RADIUS + i * 40, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw core
    ctx.fillStyle = themeColor
    ctx.beginPath()
    ctx.arc(CENTER_X, CENTER_Y, CORE_RADIUS, 0, Math.PI * 2)
    ctx.fill()

    // Draw towers
    towers.forEach((tower) => {
      const towerType = TOWER_TYPES[tower.type]
      ctx.fillStyle = towerType.color
      ctx.beginPath()
      ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2)
      ctx.fill()

      // Draw range when selected
      if (selectedTowerType === tower.type) {
        ctx.strokeStyle = towerType.color + "40"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2)
        ctx.stroke()
      }
    })

    // Draw enemies
    enemies.forEach((enemy) => {
      const healthPercent = enemy.health / enemy.maxHealth
      ctx.fillStyle = `hsl(${healthPercent * 120}, 70%, 50%)`
      ctx.beginPath()
      ctx.arc(enemy.x, enemy.y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Health bar
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(enemy.x - 10, enemy.y - 15, 20, 3)
      ctx.fillStyle = "#22c55e"
      ctx.fillRect(enemy.x - 10, enemy.y - 15, 20 * healthPercent, 3)
    })

    // Draw projectiles
    projectiles.forEach((projectile) => {
      ctx.fillStyle = "#fbbf24"
      ctx.beginPath()
      ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Orbit Defense</h1>
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="p-4 bg-gray-800 border-gray-700">
              <canvas
                id="gameCanvas"
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="border border-gray-600 cursor-crosshair mx-auto block"
                onClick={handleCanvasClick}
              />
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-gray-800 border-gray-700">
              <h3 className="font-bold mb-2">Game Stats</h3>
              <div className="space-y-2 text-sm">
                <div>Score: {score}</div>
                <div>Money: ${money}</div>
                <div>Wave: {wave}</div>
                <div>Lives: {lives}</div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-800 border-gray-700">
              <h3 className="font-bold mb-2">Controls</h3>
              <Button onClick={() => setGameRunning(!gameRunning)} className="w-full mb-2" disabled={gameOver}>
                {gameRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {gameRunning ? "Pause" : "Start"}
              </Button>
            </Card>

            <Card className="p-4 bg-gray-800 border-gray-700">
              <h3 className="font-bold mb-2">Towers</h3>
              <div className="space-y-2">
                {Object.entries(TOWER_TYPES).map(([type, config]) => (
                  <Button
                    key={type}
                    onClick={() => setSelectedTowerType(type as keyof typeof TOWER_TYPES)}
                    variant={selectedTowerType === type ? "default" : "outline"}
                    className="w-full text-left justify-start"
                    disabled={money < config.cost}
                  >
                    <div className="flex justify-between w-full">
                      <span className="capitalize">{type}</span>
                      <span>${config.cost}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="p-6 bg-gray-800 border-gray-700 text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="mb-4">Final Score: {score}</p>
              <Button onClick={resetGame}>Play Again</Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
