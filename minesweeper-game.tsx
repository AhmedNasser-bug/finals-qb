"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Flag, Bomb, Timer } from "lucide-react"

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

type GameStatus = "ready" | "playing" | "won" | "lost"
type Difficulty = "easy" | "medium" | "hard"

interface MinesweeperGameProps {
  onBack?: () => void
  themeColor?: string
}

const DIFFICULTY_SETTINGS = {
  easy: { rows: 9, cols: 9, mines: 10, label: "Easy (9x9, 10 mines)" },
  medium: { rows: 16, cols: 16, mines: 40, label: "Medium (16x16, 40 mines)" },
  hard: { rows: 16, cols: 30, mines: 99, label: "Hard (16x30, 99 mines)" },
}

export default function MinesweeperGame({ onBack, themeColor = "#374151" }: MinesweeperGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>("ready")
  const [time, setTime] = useState(0)
  const [flags, setFlags] = useState(0)
  const [showStartModal, setShowStartModal] = useState(true)
  const [showEndModal, setShowEndModal] = useState(false)

  const createBoard = useCallback(
    (firstClickRow: number, firstClickCol: number) => {
      const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty]
      const newBoard: Cell[][] = Array(rows)
        .fill(null)
        .map(() =>
          Array(cols)
            .fill(null)
            .map(() => ({ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 })),
        )

      // Place mines, avoiding the first click
      let minesPlaced = 0
      while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows)
        const col = Math.floor(Math.random() * cols)
        if (!newBoard[row][col].isMine && !(row === firstClickRow && col === firstClickCol)) {
          newBoard[row][col].isMine = true
          minesPlaced++
        }
      }

      // Calculate adjacent mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) continue
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr
              const nc = c + dc
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++
              }
            }
          }
          newBoard[r][c].adjacentMines = count
        }
      }
      return newBoard
    },
    [difficulty],
  )

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff)
    setGameStatus("ready")
    setTime(0)
    setFlags(0)
    setBoard(
      Array(DIFFICULTY_SETTINGS[diff].rows)
        .fill(null)
        .map(() =>
          Array(DIFFICULTY_SETTINGS[diff].cols)
            .fill(null)
            .map(() => ({ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 })),
        ),
    )
    setShowStartModal(false)
    setShowEndModal(false)
  }

  useEffect(() => {
    if (gameStatus === "playing") {
      const timer = setInterval(() => setTime((t) => t + 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameStatus])

  const revealCell = (row: number, col: number, currentBoard: Cell[][]): Cell[][] => {
    const { rows, cols } = DIFFICULTY_SETTINGS[difficulty]
    if (row < 0 || row >= rows || col < 0 || col >= cols || currentBoard[row][col].isRevealed) {
      return currentBoard
    }

    let newBoard = currentBoard.map((r) => r.map((c) => ({ ...c })))
    newBoard[row][col].isRevealed = true
    newBoard[row][col].isFlagged = false

    if (newBoard[row][col].adjacentMines === 0 && !newBoard[row][col].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          newBoard = revealCell(row + dr, col + dc, newBoard)
        }
      }
    }
    return newBoard
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus === "won" || gameStatus === "lost" || board[row][col].isRevealed || board[row][col].isFlagged) return

    let currentBoard = board
    if (gameStatus === "ready") {
      currentBoard = createBoard(row, col)
      setGameStatus("playing")
    }

    if (currentBoard[row][col].isMine) {
      setGameStatus("lost")
      const newBoard = currentBoard.map((r) => r.map((c) => ({ ...c, isRevealed: c.isMine || c.isRevealed })))
      setBoard(newBoard)
      setShowEndModal(true)
      return
    }

    const newBoard = revealCell(row, col, currentBoard)
    setBoard(newBoard)
    checkWinCondition(newBoard)
  }

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameStatus !== "playing" || board[row][col].isRevealed) return

    const newBoard = [...board]
    const cell = newBoard[row][col]
    if (!cell.isFlagged && flags < DIFFICULTY_SETTINGS[difficulty].mines) {
      cell.isFlagged = true
      setFlags((f) => f + 1)
    } else if (cell.isFlagged) {
      cell.isFlagged = false
      setFlags((f) => f - 1)
    }
    setBoard(newBoard)
  }

  const checkWinCondition = (currentBoard: Cell[][]) => {
    const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty]
    const revealedCount = currentBoard.flat().filter((c) => c.isRevealed).length
    if (rows * cols - revealedCount === mines) {
      setGameStatus("won")
      setShowEndModal(true)
    }
  }

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return <Flag className="w-4 h-4 text-red-500" />
    if (!cell.isRevealed) return null
    if (cell.isMine) return <Bomb className="w-4 h-4 text-gray-800" />
    if (cell.adjacentMines > 0) {
      const colors = [
        "",
        "text-blue-500",
        "text-green-600",
        "text-red-500",
        "text-purple-700",
        "text-maroon-700",
        "text-cyan-500",
        "text-black",
        "text-gray-500",
      ]
      return <span className={`font-bold ${colors[cell.adjacentMines]}`}>{cell.adjacentMines}</span>
    }
    return null
  }

  const { cols, mines } = DIFFICULTY_SETTINGS[difficulty]

  const handleChangeDifficulty = () => {
    setShowEndModal(false)
    setShowStartModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-max">
        {!showStartModal && (
          <>
            <div className="flex items-center justify-between mb-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Minesweeper</h1>
              <Button onClick={() => setShowStartModal(true)} variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>
            </div>

            <Card className="p-4 mb-4">
              <div className="flex justify-between items-center mb-4 bg-gray-200 p-2 rounded-md">
                <div className="flex items-center gap-2 font-mono text-lg">
                  <Flag className="w-5 h-5 text-red-500" />
                  {mines - flags}
                </div>
                <div className="flex items-center gap-2 font-mono text-lg">
                  <Timer className="w-5 h-5" />
                  {time}
                </div>
              </div>
              <div className="bg-gray-300 p-1 inline-block">
                <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 24px)` }}>
                  {board.map((row, r) =>
                    row.map((cell, c) => (
                      <div
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        onContextMenu={(e) => handleRightClick(e, r, c)}
                        className={`w-6 h-6 flex items-center justify-center text-sm border
                          ${
                            cell.isRevealed
                              ? "bg-gray-200 border-gray-300"
                              : "bg-gray-400 border-l-gray-100 border-t-gray-100 border-r-gray-500 border-b-gray-500 hover:bg-gray-300"
                          } cursor-pointer select-none`}
                      >
                        {getCellContent(cell)}
                      </div>
                    )),
                  )}
                </div>
              </div>
            </Card>
          </>
        )}

        {showStartModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-4">Minesweeper</h2>
              <p className="text-gray-600 mb-6">Select a difficulty to start.</p>
              <div className="space-y-3 mb-6">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <Button key={d} onClick={() => startGame(d)} className="w-full capitalize" variant="outline">
                    {DIFFICULTY_SETTINGS[d].label}
                  </Button>
                ))}
              </div>
              <div className="text-left text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold mb-1">Rules:</h3>
                <ul className="list-disc list-inside">
                  <li>Click a cell to reveal it.</li>
                  <li>If you reveal a mine, you lose.</li>
                  <li>Numbers show adjacent mines.</li>
                  <li>Right-click to flag suspected mines.</li>
                  <li>Clear all non-mine cells to win!</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {showEndModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 text-center w-full max-w-sm">
              <h2 className="text-2xl font-bold mb-2">{gameStatus === "won" ? "You Win! 🎉" : "Game Over 💥"}</h2>
              <p className="text-gray-600 mb-6">Your time: {time} seconds</p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => startGame(difficulty)}>Play Again ({difficulty})</Button>
                <Button onClick={handleChangeDifficulty} variant="outline">
                  Change Difficulty
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
