"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RotateCcw } from "lucide-react"

interface Tile {
  id: number
  value: number
}

interface Game2048Props {
  onBack?: () => void
  themeColor?: string
}

const GRID_SIZE = 4

const getTileAppearance = (value: number) => {
  const baseClasses =
    "font-bold rounded-md flex items-center justify-center w-full aspect-square transition-all duration-200"
  const sizeClass = value < 100 ? "text-4xl" : value < 1000 ? "text-3xl" : "text-2xl"

  switch (value) {
    case 2:
      return `${baseClasses} ${sizeClass} bg-gray-200 text-gray-800`
    case 4:
      return `${baseClasses} ${sizeClass} bg-gray-300 text-gray-800`
    case 8:
      return `${baseClasses} ${sizeClass} bg-amber-300 text-white`
    case 16:
      return `${baseClasses} ${sizeClass} bg-amber-400 text-white`
    case 32:
      return `${baseClasses} ${sizeClass} bg-amber-500 text-white`
    case 64:
      return `${baseClasses} ${sizeClass} bg-red-400 text-white`
    case 128:
      return `${baseClasses} ${sizeClass} bg-yellow-400 text-white`
    case 256:
      return `${baseClasses} ${sizeClass} bg-yellow-500 text-white`
    case 512:
      return `${baseClasses} ${sizeClass} bg-yellow-600 text-white`
    case 1024:
      return `${baseClasses} ${sizeClass} bg-indigo-400 text-white`
    case 2048:
      return `${baseClasses} ${sizeClass} bg-indigo-600 text-white`
    default:
      return `${baseClasses} ${sizeClass} bg-black text-white`
  }
}

export default function Game2048({ onBack, themeColor = "#f59e0b" }: Game2048Props) {
  const [board, setBoard] = useState<(Tile | null)[]>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  const addRandomTile = (currentBoard: (Tile | null)[]) => {
    const emptyCells = currentBoard.map((_, i) => i).filter((i) => currentBoard[i] === null)
    if (emptyCells.length === 0) return currentBoard

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const newValue = Math.random() < 0.9 ? 2 : 4
    const newBoard = [...currentBoard]
    newBoard[randomIndex] = { id: Date.now() + Math.random(), value: newValue }
    return newBoard
  }

  const resetGame = useCallback(() => {
    let newBoard = Array(GRID_SIZE * GRID_SIZE).fill(null)
    newBoard = addRandomTile(newBoard)
    newBoard = addRandomTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setIsGameOver(false)
  }, [])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  const checkGameOver = (currentBoard: (Tile | null)[]) => {
    const emptyCells = currentBoard.filter((cell) => cell === null).length
    if (emptyCells > 0) return false

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = currentBoard[i * GRID_SIZE + j]
        if (current) {
          if (j + 1 < GRID_SIZE && current.value === currentBoard[i * GRID_SIZE + j + 1]?.value) return false
          if (i + 1 < GRID_SIZE && current.value === currentBoard[(i + 1) * GRID_SIZE + j]?.value) return false
        }
      }
    }
    setIsGameOver(true)
    return true
  }

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (isGameOver) return

      const originalBoardState = JSON.stringify(board)
      const currentBoard = [...board]
      let currentScore = score

      const operateRow = (row: (Tile | null)[]) => {
        const filteredRow = row.filter((tile) => tile !== null)
        const newRow: (Tile | null)[] = []
        let scoreToAdd = 0
        for (let i = 0; i < filteredRow.length; i++) {
          if (i + 1 < filteredRow.length && filteredRow[i]!.value === filteredRow[i + 1]!.value) {
            const newValue = filteredRow[i]!.value * 2
            newRow.push({ id: Date.now() + Math.random(), value: newValue })
            scoreToAdd += newValue
            i++
          } else {
            newRow.push(filteredRow[i])
          }
        }
        while (newRow.length < GRID_SIZE) {
          newRow.push(null)
        }
        return { result: newRow, score: scoreToAdd }
      }

      const getRow = (i: number) => currentBoard.slice(i * GRID_SIZE, i * GRID_SIZE + GRID_SIZE)
      const getCol = (i: number) => Array.from({ length: GRID_SIZE }, (_, j) => currentBoard[j * GRID_SIZE + i])
      const setRow = (i: number, row: (Tile | null)[]) =>
        row.forEach((tile, j) => (currentBoard[i * GRID_SIZE + j] = tile))
      const setCol = (i: number, col: (Tile | null)[]) =>
        col.forEach((tile, j) => (currentBoard[j * GRID_SIZE + i] = tile))

      if (direction === "left" || direction === "right") {
        for (let i = 0; i < GRID_SIZE; i++) {
          const row = getRow(i)
          if (direction === "right") row.reverse()
          const { result, score: newScore } = operateRow(row)
          currentScore += newScore
          if (direction === "right") result.reverse()
          setRow(i, result)
        }
      } else {
        for (let i = 0; i < GRID_SIZE; i++) {
          const col = getCol(i)
          if (direction === "down") col.reverse()
          const { result, score: newScore } = operateRow(col)
          currentScore += newScore
          if (direction === "down") result.reverse()
          setCol(i, result)
        }
      }

      if (JSON.stringify(currentBoard) !== originalBoardState) {
        const boardWithNewTile = addRandomTile(currentBoard)
        setBoard(boardWithNewTile)
        setScore(currentScore)
        if (currentScore > bestScore) setBestScore(currentScore)
        checkGameOver(boardWithNewTile)
      }
    },
    [board, score, bestScore, isGameOver],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      switch (e.key) {
        case "ArrowUp":
        case "w":
          move("up")
          break
        case "ArrowDown":
        case "s":
          move("down")
          break
        case "ArrowLeft":
        case "a":
          move("left")
          break
        case "ArrowRight":
        case "d":
          move("right")
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [move])

  return (
    <div className="min-h-screen bg-amber-50 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-amber-800">2048</h1>
          <Button onClick={resetGame} variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Card className="p-2 px-4 text-center bg-amber-200">
            <div className="text-sm font-medium text-amber-700">SCORE</div>
            <div className="text-xl font-bold text-amber-900">{score}</div>
          </Card>
          <Card className="p-2 px-4 text-center bg-amber-200">
            <div className="text-sm font-medium text-amber-700">BEST</div>
            <div className="text-xl font-bold text-amber-900">{bestScore}</div>
          </Card>
        </div>

        <Card className="p-3 bg-amber-200 relative">
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-full aspect-square bg-amber-100 rounded-md" />
            ))}
          </div>
          <div className="absolute inset-3 grid grid-cols-4 gap-3">
            {board.map((tile, i) =>
              tile ? (
                <div key={tile.id} className={getTileAppearance(tile.value)}>
                  {tile.value}
                </div>
              ) : (
                <div key={i} />
              ),
            )}
          </div>
          {isGameOver && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-3xl font-bold text-amber-800 mb-4">Game Over!</h2>
              <Button onClick={resetGame} style={{ backgroundColor: themeColor }} className="text-white">
                Try Again
              </Button>
            </div>
          )}
        </Card>
        <p className="text-center mt-4 text-amber-700">Use arrow keys or WASD to move the tiles.</p>
      </div>
    </div>
  )
}
