"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react"

interface Puzzle2048GameProps {
  onBack: () => void
  themeColor: string
}

type Board = (number | null)[][]
type Direction = "up" | "down" | "left" | "right"

export default function Puzzle2048Game({ onBack, themeColor }: Puzzle2048GameProps) {
  const [board, setBoard] = useState<Board>(() => initializeBoard())
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("2048-best-score")
    if (saved) setBestScore(Number.parseInt(saved))
  }, [])

  // Save best score to localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("2048-best-score", score.toString())
    }
  }, [score, bestScore])

  function initializeBoard(): Board {
    const newBoard: Board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(null))
    addRandomTile(newBoard)
    addRandomTile(newBoard)
    return newBoard
  }

  function addRandomTile(board: Board): void {
    const emptyCells: [number, number][] = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === null) {
          emptyCells.push([i, j])
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      board[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  function moveBoard(board: Board, direction: Direction): { newBoard: Board; scoreGained: number; moved: boolean } {
    const newBoard = board.map((row) => [...row])
    let scoreGained = 0
    let moved = false

    function slideArray(arr: (number | null)[]): { newArr: (number | null)[]; score: number; moved: boolean } {
      const filtered = arr.filter((val) => val !== null) as number[]
      const newArr: (number | null)[] = []
      let score = 0
      let arrayMoved = false

      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          newArr.push(filtered[i] * 2)
          score += filtered[i] * 2
          i++ // Skip next element as it's merged
        } else {
          newArr.push(filtered[i])
        }
      }

      while (newArr.length < 4) {
        newArr.push(null)
      }

      // Check if array changed
      for (let i = 0; i < 4; i++) {
        if (arr[i] !== newArr[i]) {
          arrayMoved = true
          break
        }
      }

      return { newArr, score, moved: arrayMoved }
    }

    if (direction === "left") {
      for (let i = 0; i < 4; i++) {
        const { newArr, score, moved: rowMoved } = slideArray(newBoard[i])
        newBoard[i] = newArr
        scoreGained += score
        if (rowMoved) moved = true
      }
    } else if (direction === "right") {
      for (let i = 0; i < 4; i++) {
        const { newArr, score, moved: rowMoved } = slideArray([...newBoard[i]].reverse())
        newBoard[i] = newArr.reverse()
        scoreGained += score
        if (rowMoved) moved = true
      }
    } else if (direction === "up") {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]]
        const { newArr, score, moved: colMoved } = slideArray(column)
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = newArr[i]
        }
        scoreGained += score
        if (colMoved) moved = true
      }
    } else if (direction === "down") {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[3][j], newBoard[2][j], newBoard[1][j], newBoard[0][j]]
        const { newArr, score, moved: colMoved } = slideArray(column)
        for (let i = 0; i < 4; i++) {
          newBoard[3 - i][j] = newArr[i]
        }
        scoreGained += score
        if (colMoved) moved = true
      }
    }

    return { newBoard, scoreGained, moved }
  }

  function canMove(board: Board): boolean {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === null) return true
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i][j]
        if ((i < 3 && board[i + 1][j] === current) || (j < 3 && board[i][j + 1] === current)) {
          return true
        }
      }
    }

    return false
  }

  function checkWin(board: Board): boolean {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 2048) return true
      }
    }
    return false
  }

  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameOver || won) return

      const { newBoard, scoreGained, moved } = moveBoard(board, direction)

      if (moved) {
        addRandomTile(newBoard)
        setBoard(newBoard)
        setScore((prev) => prev + scoreGained)
        setMoveCount((prev) => prev + 1)

        if (checkWin(newBoard) && !won) {
          setWon(true)
        }

        if (!canMove(newBoard)) {
          setGameOver(true)
        }
      }
    },
    [board, gameOver, won],
  )

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault()
          handleMove("up")
          break
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault()
          handleMove("down")
          break
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault()
          handleMove("left")
          break
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault()
          handleMove("right")
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleMove])

  const resetGame = () => {
    setBoard(initializeBoard())
    setScore(0)
    setGameOver(false)
    setWon(false)
    setMoveCount(0)
  }

  const getTileColor = (value: number | null) => {
    if (!value) return "bg-gray-200"

    const colors: { [key: number]: string } = {
      2: "bg-gray-100 text-gray-800",
      4: "bg-gray-200 text-gray-800",
      8: "bg-orange-200 text-orange-800",
      16: "bg-orange-300 text-orange-900",
      32: "bg-orange-400 text-white",
      64: "bg-orange-500 text-white",
      128: "bg-yellow-400 text-white",
      256: "bg-yellow-500 text-white",
      512: "bg-yellow-600 text-white",
      1024: "bg-red-400 text-white",
      2048: "bg-red-500 text-white",
    }

    return colors[value] || "bg-purple-500 text-white"
  }

  const getTileSize = (value: number | null) => {
    if (!value) return ""
    if (value >= 1000) return "text-sm"
    if (value >= 100) return "text-base"
    return "text-lg"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">2048</h1>
          <Button
            onClick={resetGame}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Score Display */}
        <div className="flex gap-4 mb-6">
          <div className="bg-white rounded-lg p-3 flex-1 text-center shadow-sm">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-xl font-bold text-gray-800">{score.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg p-3 flex-1 text-center shadow-sm">
            <div className="text-sm text-gray-600">Best</div>
            <div className="text-xl font-bold text-gray-800">{bestScore.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg p-3 flex-1 text-center shadow-sm">
            <div className="text-sm text-gray-600">Moves</div>
            <div className="text-xl font-bold text-gray-800">{moveCount}</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-gray-300 rounded-lg p-3 mb-6 shadow-lg">
          <div className="grid grid-cols-4 gap-3">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center font-bold
                    transition-all duration-200 transform
                    ${getTileColor(cell)} ${getTileSize(cell)}
                    ${cell ? "scale-100" : "scale-95"}
                  `}
                >
                  {cell || ""}
                </div>
              )),
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm mb-4">Use arrow keys or WASD to move tiles</p>
          <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMove("up")}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              ↑
            </Button>
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMove("left")}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMove("down")}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              ↓
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMove("right")}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              →
            </Button>
          </div>
        </div>

        {/* Game Over/Win Modal */}
        {(gameOver || won) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center shadow-xl">
              <div className="mb-4">
                {won ? (
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-2xl">😔</span>
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-800">{won ? "You Win!" : "Game Over"}</h2>
                <p className="text-gray-600 mt-2">
                  {won
                    ? `Congratulations! You reached 2048 in ${moveCount} moves!`
                    : `Final Score: ${score.toLocaleString()}`}
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={resetGame} className="flex-1" style={{ backgroundColor: themeColor }}>
                  Play Again
                </Button>
                <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
                  Menu
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
