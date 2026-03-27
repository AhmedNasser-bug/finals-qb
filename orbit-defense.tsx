"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Target } from "lucide-react"

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 700
const PLANET_RADIUS = 50
const PLANET_X = CANVAS_WIDTH / 2
const PLANET_Y = CANVAS_HEIGHT / 2
const SATELLITE_RADIUS = 12
const ENEMY_RADIUS = 8
const BULLET_RADIUS = 3

interface Planet {
  x: number
  y: number
  radius: number
  health: number
  maxHealth: number
  shield: number
  maxShield: number
}
interface Satellite {
  x: number
  y: number
  angle: number
  radius: number
  range: number
  damage: number
  fireRate: number
  lastFired: number
  level: number
  cost: number
  type: "basic" | "laser" | "missile"
  targetLock?: number
}
interface Enemy {
  id: number
  x: number
  y: number
  radius: number
  health: number
  maxHealth: number
  speed: number
  value: number
  angle: number
  orbitRadius: number
  orbitSpeed: number
  phase: "approaching" | "orbiting" | "attacking"
  orbitTime: number
  type: "scout" | "heavy" | "fast"
  armor: number
}
interface Bullet {
  x: number
  y: number
  targetX: number
  targetY: number
  radius: number
  damage: number
  speed: number
  life: number
  type: "basic" | "laser" | "missile"
  targetEnemyId?: number
  trail: { x: number; y: number; alpha: number }[]
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
interface PowerUp {
  type: "shield" | "repair" | "credits"
  x: number
  y: number
  life: number
  collected: boolean
}

const SATELLITE_TYPES = {
  basic: { cost: 40, damage: 20, range: 120, fireRate: 800, color: "#ffffff" },
  laser: { cost: 80, damage: 15, range: 160, fireRate: 200, color: "#00ff88" },
  missile: { cost: 120, damage: 50, range: 200, fireRate: 1500, color: "#ff6600" },
}
const ENEMY_TYPES = {
  scout: { health: 40, speed: 1.2, value: 15, armor: 0, color: "#cccccc" },
  heavy: { health: 100, speed: 0.6, value: 35, armor: 10, color: "#999999" },
  fast: { health: 25, speed: 2.0, value: 25, armor: 0, color: "#eeeeee" },
}

let nextEnemyId = 0

interface OrbitDefenseProps {
  onBack: () => void
  themeColor: string
}

export default function OrbitDefense({ onBack, themeColor }: OrbitDefenseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver" | "paused">("menu")
  const [wave, setWave] = useState(1)
  const [credits, setCredits] = useState(120)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [selectedSatellite, setSelectedSatellite] = useState<number | null>(null)
  const [placingType, setPlacingType] = useState<"basic" | "laser" | "missile">("basic")

  const gameStateRef = useRef<{
    planet: Planet
    satellites: Satellite[]
    enemies: Enemy[]
    bullets: Bullet[]
    particles: Particle[]
    powerUps: PowerUp[]
    wave: number
    credits: number
    score: number
    enemiesToSpawn: number
    lastEnemySpawn: number
    lastPowerUpSpawn: number
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null
    mouseX: number
    mouseY: number
    waveInProgress: boolean
  }>({
    planet: { x: PLANET_X, y: PLANET_Y, radius: PLANET_RADIUS, health: 100, maxHealth: 100, shield: 50, maxShield: 50 },
    satellites: [],
    enemies: [],
    bullets: [],
    particles: [],
    powerUps: [],
    wave: 1,
    credits: 120,
    score: 0,
    enemiesToSpawn: 0,
    lastEnemySpawn: 0,
    lastPowerUpSpawn: 0,
    canvas: null,
    ctx: null,
    mouseX: 0,
    mouseY: 0,
    waveInProgress: false,
  })

  const createParticles = useCallback((x: number, y: number, color = "#ffffff", count = 6) => {
    for (let i = 0; i < count; i++) {
      gameStateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 40,
        maxLife: 40,
        size: Math.random() * 3 + 1,
        color,
      })
    }
  }, [])

  const startWave = useCallback((waveNumber: number) => {
    gameStateRef.current.wave = waveNumber
    gameStateRef.current.enemiesToSpawn = waveNumber * 5 + 5
    gameStateRef.current.waveInProgress = true
    setWave(waveNumber)
  }, [])

  const spawnEnemy = useCallback(() => {
    const types: (keyof typeof ENEMY_TYPES)[] = ["scout", "heavy", "fast"]
    const weights = [0.5, 0.3, 0.2]
    let randomValue = Math.random()
    let selectedType: keyof typeof ENEMY_TYPES = "scout"
    for (let i = 0; i < types.length; i++) {
      if (randomValue < weights[i]) {
        selectedType = types[i]
        break
      }
      randomValue -= weights[i]
    }
    const angle = Math.random() * Math.PI * 2
    const distance = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.6
    const startX = PLANET_X + Math.cos(angle) * distance
    const startY = PLANET_Y + Math.sin(angle) * distance
    const enemyData = ENEMY_TYPES[selectedType]
    gameStateRef.current.enemies.push({
      id: nextEnemyId++,
      x: startX,
      y: startY,
      radius: ENEMY_RADIUS + (selectedType === "heavy" ? 3 : 0),
      health: enemyData.health + Math.floor(gameStateRef.current.wave * 8),
      maxHealth: enemyData.health + Math.floor(gameStateRef.current.wave * 8),
      speed: enemyData.speed + gameStateRef.current.wave * 0.05,
      value: enemyData.value + gameStateRef.current.wave * 3,
      angle: Math.random() * Math.PI * 2,
      orbitRadius: PLANET_RADIUS + 60 + Math.random() * 30,
      orbitSpeed: 0.015 + Math.random() * 0.01,
      phase: "approaching",
      orbitTime: 0,
      type: selectedType,
      armor: enemyData.armor,
    })
  }, [])

  const spawnPowerUp = useCallback(() => {
    const types: ("shield" | "repair" | "credits")[] = ["shield", "repair", "credits"]
    const type = types[Math.floor(Math.random() * types.length)]
    const angle = Math.random() * Math.PI * 2
    const distance = 150 + Math.random() * 100
    gameStateRef.current.powerUps.push({
      type,
      x: PLANET_X + Math.cos(angle) * distance,
      y: PLANET_Y + Math.sin(angle) * distance,
      life: 600,
      collected: false,
    })
  }, [])

  const placeSatellite = useCallback((x: number, y: number, type: keyof typeof SATELLITE_TYPES) => {
    const satelliteData = SATELLITE_TYPES[type]
    if (gameStateRef.current.credits < satelliteData.cost) return false
    const distToPlanet = Math.sqrt((x - PLANET_X) ** 2 + (y - PLANET_Y) ** 2)
    if (distToPlanet < PLANET_RADIUS + 35) return false
    for (const satellite of gameStateRef.current.satellites) {
      const dist = Math.sqrt((x - satellite.x) ** 2 + (y - satellite.y) ** 2)
      if (dist < SATELLITE_RADIUS * 2.5) return false
    }
    const angle = Math.atan2(y - PLANET_Y, x - PLANET_X)
    gameStateRef.current.satellites.push({
      x,
      y,
      angle,
      radius: SATELLITE_RADIUS,
      range: satelliteData.range,
      damage: satelliteData.damage,
      fireRate: satelliteData.fireRate,
      lastFired: 0,
      level: 1,
      cost: satelliteData.cost,
      type,
    })
    gameStateRef.current.credits -= satelliteData.cost
    setCredits(gameStateRef.current.credits)
    return true
  }, [])

  const upgradeSatellite = useCallback(
    (index: number) => {
      const satellite = gameStateRef.current.satellites[index]
      if (!satellite) return false
      const upgradeCost = satellite.level * 25 + 30
      if (gameStateRef.current.credits < upgradeCost) return false
      satellite.level++
      satellite.damage += satellite.type === "missile" ? 25 : satellite.type === "laser" ? 5 : 10
      satellite.range += 15
      satellite.fireRate = Math.max(100, satellite.fireRate - (satellite.type === "laser" ? 10 : 50))
      gameStateRef.current.credits -= upgradeCost
      setCredits(gameStateRef.current.credits)
      createParticles(satellite.x, satellite.y, SATELLITE_TYPES[satellite.type].color, 8)
      return true
    },
    [createParticles],
  )

  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    gameStateRef.current = {
      planet: {
        x: PLANET_X,
        y: PLANET_Y,
        radius: PLANET_RADIUS,
        health: 100,
        maxHealth: 100,
        shield: 50,
        maxShield: 50,
      },
      satellites: [],
      enemies: [],
      bullets: [],
      particles: [],
      powerUps: [],
      wave: 1,
      credits: 120,
      score: 0,
      enemiesToSpawn: 0,
      lastEnemySpawn: 0,
      lastPowerUpSpawn: 0,
      canvas,
      ctx: canvas.getContext("2d"),
      mouseX: 0,
      mouseY: 0,
      waveInProgress: false,
    }
    setWave(1)
    setCredits(120)
    setScore(0)
    setSelectedSatellite(null)
    setPlacingType("basic")
    startWave(1)
  }, [startWave])

  const startGame = useCallback(() => {
    setGameState("playing")
    initGame()
  }, [initGame])

  const endGame = useCallback(() => {
    setGameState("gameOver")
    setHighScore((currentHighScore) => {
      if (gameStateRef.current.score > currentHighScore) {
        return gameStateRef.current.score
      }
      return currentHighScore
    })
    setScore(gameStateRef.current.score)
  }, [])

  const updateGame = useCallback(() => {
    const { planet, satellites, enemies, bullets, particles, powerUps, canvas, ctx } = gameStateRef.current
    if (!canvas || !ctx || gameState !== "playing") return
    const currentTime = Date.now()

    // Wave Management
    if (gameStateRef.current.waveInProgress) {
      if (
        gameStateRef.current.enemiesToSpawn > 0 &&
        currentTime - gameStateRef.current.lastEnemySpawn > Math.max(500, 2000 - gameStateRef.current.wave * 50)
      ) {
        spawnEnemy()
        gameStateRef.current.enemiesToSpawn--
        gameStateRef.current.lastEnemySpawn = currentTime
      }
      if (gameStateRef.current.enemiesToSpawn === 0 && enemies.length === 0) {
        gameStateRef.current.waveInProgress = false
        setTimeout(() => {
          gameStateRef.current.credits += 100 + gameStateRef.current.wave * 10
          setCredits((c) => c + 100 + gameStateRef.current.wave * 10)
          startWave(gameStateRef.current.wave + 1)
        }, 5000)
      }
    }

    // Power-up Spawning & Update
    if (currentTime - gameStateRef.current.lastPowerUpSpawn > 20000 && Math.random() < 0.001) {
      spawnPowerUp()
      gameStateRef.current.lastPowerUpSpawn = currentTime
    }
    for (let i = powerUps.length - 1; i >= 0; i--) {
      powerUps[i].life--
      if (powerUps[i].life <= 0) powerUps.splice(i, 1)
    }

    // Satellite Logic
    satellites.forEach((satellite) => {
      if (currentTime - satellite.lastFired > satellite.fireRate) {
        let target: Enemy | null = null
        let minDistance = satellite.range
        enemies.forEach((enemy) => {
          const distance = Math.sqrt((enemy.x - satellite.x) ** 2 + (enemy.y - satellite.y) ** 2)
          if (distance < minDistance) {
            minDistance = distance
            target = enemy
          }
        })
        if (target) {
          satellite.lastFired = currentTime
          const bulletSpeed = satellite.type === "missile" ? 6 : 12
          bullets.push({
            x: satellite.x,
            y: satellite.y,
            targetX: target.x,
            targetY: target.y,
            radius: BULLET_RADIUS + (satellite.type === "missile" ? 2 : 0),
            damage: satellite.damage,
            speed: bulletSpeed,
            life: 100,
            type: satellite.type,
            targetEnemyId: target.id,
            trail: [],
          })
        }
      }
    })

    // Bullet Update
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i]
      bullet.trail.push({ x: bullet.x, y: bullet.y, alpha: 1 })
      if (bullet.trail.length > 15) bullet.trail.shift()
      const targetEnemy = enemies.find((e) => e.id === bullet.targetEnemyId)
      if (bullet.type === "missile" && targetEnemy) {
        const angle = Math.atan2(targetEnemy.y - bullet.y, targetEnemy.x - bullet.x)
        bullet.x += Math.cos(angle) * bullet.speed
        bullet.y += Math.sin(angle) * bullet.speed
      } else {
        const angle = Math.atan2(bullet.targetY - bullet.y, bullet.targetX - bullet.x)
        bullet.x += Math.cos(angle) * bullet.speed
        bullet.y += Math.sin(angle) * bullet.speed
      }
      bullet.life--
      if (bullet.life <= 0) {
        bullets.splice(i, 1)
        continue
      }
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j]
        const dist = Math.sqrt((bullet.x - enemy.x) ** 2 + (bullet.y - enemy.y) ** 2)
        if (dist < enemy.radius + bullet.radius) {
          const damageDealt = Math.max(1, bullet.damage - enemy.armor)
          enemy.health -= damageDealt
          createParticles(bullet.x, bullet.y, SATELLITE_TYPES[bullet.type].color, 4)
          bullets.splice(i, 1)
          if (enemy.health <= 0) {
            createParticles(enemy.x, enemy.y, ENEMY_TYPES[enemy.type].color, 15)
            gameStateRef.current.credits += enemy.value
            gameStateRef.current.score += enemy.value * 2
            setCredits((c) => c + enemy.value)
            setScore((s) => s + enemy.value * 2)
            enemies.splice(j, 1)
          }
          break
        }
      }
    }

    // Enemy Update
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i]
      const distToPlanet = Math.sqrt((enemy.x - planet.x) ** 2 + (enemy.y - planet.y) ** 2)
      if (enemy.phase === "approaching") {
        if (distToPlanet <= enemy.orbitRadius) {
          enemy.phase = "orbiting"
          enemy.orbitTime = currentTime
        } else {
          const angle = Math.atan2(planet.y - enemy.y, planet.x - enemy.x)
          enemy.x += Math.cos(angle) * enemy.speed
          enemy.y += Math.sin(angle) * enemy.speed
        }
      } else if (enemy.phase === "orbiting") {
        enemy.angle += enemy.orbitSpeed
        enemy.x = planet.x + Math.cos(enemy.angle) * enemy.orbitRadius
        enemy.y = planet.y + Math.sin(enemy.angle) * enemy.orbitRadius
        if (currentTime - enemy.orbitTime > 5000) enemy.phase = "attacking"
      } else if (enemy.phase === "attacking") {
        const angle = Math.atan2(planet.y - enemy.y, planet.x - enemy.x)
        enemy.x += Math.cos(angle) * enemy.speed
        enemy.y += Math.sin(angle) * enemy.speed
      }
      if (distToPlanet < planet.radius + enemy.radius) {
        if (planet.shield > 0) planet.shield -= 10
        else planet.health -= 10
        createParticles(enemy.x, enemy.y, "#ff4444", 10)
        enemies.splice(i, 1)
        if (planet.health <= 0) {
          endGame()
          return
        }
      }
    }

    // Particle Update
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.95
      p.vy *= 0.95
      p.life--
      if (p.life <= 0) particles.splice(i, 1)
    }

    // --- Drawing ---
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#0a0a0a"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    particles.forEach((p) => {
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life / p.maxLife
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    })

    bullets.forEach((b) => {
      b.trail.forEach((t, index) => {
        ctx.fillStyle = SATELLITE_TYPES[b.type].color
        ctx.globalAlpha = (index / b.trail.length) * 0.5
        ctx.beginPath()
        ctx.arc(t.x, t.y, b.radius * 0.8, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      ctx.fillStyle = SATELLITE_TYPES[b.type].color
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    enemies.forEach((e) => {
      ctx.fillStyle = ENEMY_TYPES[e.type].color
      ctx.beginPath()
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ff4444"
      ctx.fillRect(e.x - e.radius, e.y - e.radius - 8, e.radius * 2, 4)
      ctx.fillStyle = "#44ff44"
      ctx.fillRect(e.x - e.radius, e.y - e.radius - 8, (e.radius * 2 * e.health) / e.maxHealth, 4)
    })

    satellites.forEach((s, i) => {
      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.rotate(s.angle + Math.PI / 2)
      ctx.fillStyle = SATELLITE_TYPES[s.type].color
      ctx.beginPath()
      ctx.moveTo(0, -s.radius)
      ctx.lineTo(s.radius * 0.8, s.radius * 0.8)
      ctx.lineTo(-s.radius * 0.8, s.radius * 0.8)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      if (selectedSatellite === i) {
        ctx.strokeStyle = themeColor
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.range, 0, Math.PI * 2)
        ctx.stroke()
      }
    })

    ctx.fillStyle = planet.health > 60 ? themeColor : planet.health > 30 ? "#ffaa00" : "#ff4444"
    ctx.beginPath()
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2)
    ctx.fill()
    if (planet.shield > 0) {
      ctx.strokeStyle = `rgba(0, 255, 136, ${(planet.shield / planet.maxShield) * 0.6})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(planet.x, planet.y, planet.radius + 8, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw UI
    ctx.fillStyle = "#ffffff"
    ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`Wave: ${gameStateRef.current.wave}`, 20, 30)
    ctx.fillText(`Credits: ${gameStateRef.current.credits}`, 20, 55)
    ctx.fillText(`Score: ${gameStateRef.current.score}`, 20, 80)
    if (gameStateRef.current.waveInProgress) {
      ctx.fillText(`Enemies: ${enemies.length + gameStateRef.current.enemiesToSpawn}`, 20, 105)
    } else {
      ctx.fillStyle = "#00ff88"
      ctx.fillText("Wave Complete! Next wave starting...", 20, 105)
    }

    gameLoopRef.current = requestAnimationFrame(updateGame)
  }, [gameState, spawnEnemy, spawnPowerUp, createParticles, endGame, startWave, selectedSatellite, themeColor])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    gameStateRef.current.mouseX = e.clientX - rect.left
    gameStateRef.current.mouseY = e.clientY - rect.top
  }, [])

  const handleMouseClick = useCallback(
    (e: React.MouseEvent) => {
      if (gameState !== "playing") return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      for (let i = 0; i < gameStateRef.current.powerUps.length; i++) {
        const powerUp = gameStateRef.current.powerUps[i]
        const dist = Math.sqrt((x - powerUp.x) ** 2 + (y - powerUp.y) ** 2)
        if (dist < 20) {
          switch (powerUp.type) {
            case "shield":
              gameStateRef.current.planet.shield = gameStateRef.current.planet.maxShield
              break
            case "repair":
              gameStateRef.current.planet.health = Math.min(
                gameStateRef.current.planet.maxHealth,
                gameStateRef.current.planet.health + 30,
              )
              break
            case "credits":
              gameStateRef.current.credits += 40
              setCredits(gameStateRef.current.credits)
              break
          }
          createParticles(powerUp.x, powerUp.y, "#00ff88", 12)
          gameStateRef.current.powerUps.splice(i, 1)
          return
        }
      }
      for (let i = 0; i < gameStateRef.current.satellites.length; i++) {
        const satellite = gameStateRef.current.satellites[i]
        const dist = Math.sqrt((x - satellite.x) ** 2 + (y - satellite.y) ** 2)
        if (dist < satellite.radius + 8) {
          if (selectedSatellite === i) upgradeSatellite(i)
          else setSelectedSatellite(i)
          return
        }
      }
      if (placeSatellite(x, y, placingType)) {
        setSelectedSatellite(null)
      }
    },
    [gameState, placeSatellite, upgradeSatellite, createParticles, placingType, selectedSatellite],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && (gameState === "menu" || gameState === "gameOver")) startGame()
      if (e.key === " " && gameState === "playing") {
        e.preventDefault()
        setGameState("paused")
      }
      if (e.key === " " && gameState === "paused") {
        e.preventDefault()
        setGameState("playing")
      }
      if (e.key === "Escape") setSelectedSatellite(null)
      if (gameState === "playing") {
        if (e.key === "1") setPlacingType("basic")
        if (e.key === "2") setPlacingType("laser")
        if (e.key === "3") setPlacingType("missile")
      }
    },
    [gameState, startGame],
  )

  useEffect(() => {
    initGame()
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [handleKeyDown, initGame])

  useEffect(() => {
    if (gameState === "playing") gameLoopRef.current = requestAnimationFrame(updateGame)
    else if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState, updateGame])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-800 rounded-lg shadow-sm cursor-crosshair"
          style={{ maxWidth: "100%", height: "auto" }}
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
        />
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-800 shadow-sm bg-black text-white max-w-md">
              <div className="mb-6">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: themeColor }}
                >
                  <Target className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Orbit Defense</h1>
                <p className="text-sm text-gray-400 mb-4">Strategic tower defense in space with orbital mechanics</p>
                <div className="bg-gray-900 rounded-lg p-4 text-left text-xs text-gray-300 space-y-1">
                  <div className="font-medium text-white">Controls:</div>
                  <div>
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">Mouse Click</kbd> to
                    Place/Upgrade
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">1</kbd>{" "}
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">2</kbd>{" "}
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">3</kbd> to Select
                    Satellite
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">Space</kbd> to Pause
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600 text-xs">Esc</kbd> to Deselect
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                style={{ backgroundColor: themeColor }}
                className="text-white px-8 py-3 text-lg font-medium"
              >
                Start Defense
              </Button>
            </Card>
          </div>
        )}
        {gameState === "paused" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm rounded-lg">
            <Card className="p-6 text-center border-gray-800 shadow-sm bg-black text-white">
              <h2 className="text-2xl font-bold text-white mb-4">Paused</h2>
              <p className="text-gray-400 mb-4">Press Space to continue</p>
              <Button
                onClick={() => setGameState("playing")}
                style={{ backgroundColor: themeColor }}
                className="text-white px-6 py-2 text-sm font-medium"
              >
                Resume
              </Button>
            </Card>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-800 shadow-sm bg-black text-white w-96">
              <h2 className="text-lg font-medium text-gray-500 mb-1">Orbit Defense</h2>
              <h3 className="text-xl font-bold text-white mb-4">Planet Destroyed! 💥</h3>
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Final Score</div>
                    <div className="text-2xl font-mono text-white" style={{ color: themeColor }}>
                      {score.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Waves Survived</div>
                    <div className="text-2xl font-mono text-gray-300">{wave - 1}</div>
                  </div>
                </div>
                {highScore > 0 && <p className="text-xs text-gray-500">Best Score: {highScore.toLocaleString()}</p>}
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={startGame}
                  style={{ backgroundColor: themeColor }}
                  className="text-white px-6 py-2 text-sm font-medium"
                >
                  Defend Again
                </Button>
                <Button
                  onClick={() => setGameState("menu")}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-2 text-sm font-medium"
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
          {gameState === "playing"
            ? `Placing: ${placingType.charAt(0).toUpperCase() + placingType.slice(1)} • 1,2,3 to switch types`
            : "A v0 Mini Game"}
        </p>
      </div>
    </div>
  )
}
