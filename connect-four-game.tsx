"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, User, Bot } from "lucide-react"

interface ConnectFourGameProps {
  onBack: () => void
  themeColor: string
}

type Player = 1 | 2
type Cell = 0 | Player
type Board = Cell[][]
type GameMode = "pvp" | "cpu"
type GameState = "playing" | "won" | "draw"

const ROWS = 6
const COLS = 7

export default function ConnectFourGame({ onBack, themeColor }: ConnectFourGameProps) {
  const [board, setBoard] = useState<Board>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [winner, setWinner] = useState<Player | null>(null)
  const [gameMode, setGameMode] = useState<GameMode | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [cpuLastMove, setCpuLastMove] = useState<{ row: number; col: number } | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  const resetGame = useCallback(() => {
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(0)),
    )
    setCurrentPlayer(1)
    setGameState("playing")
    setWinner(null)
    setHoveredCol(null)
    setCpuLastMove(null)
    setIsThinking(false)
  }, [])

  const checkWinner = useCallback((board: Board, row: number, col: number, player: Player): boolean => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal /
      [1, -1], // diagonal \
    ]

    for (const [dx, dy] of directions) {
      let count = 1

      // Check positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === player) {
          count++
        } else {
          break
        }
      }

      // Check negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === player) {
          count++
        } else {
          break
        }
      }

      if (count >= 4) return true
    }

    return false
  }, [])

  const isBoardFull = useCallback((board: Board): boolean => {
    return board[0].every((cell) => cell !== 0)
  }, [])

  const dropPiece = useCallback(
    (col: number, player: Player) => {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row])

        // Find the lowest empty row in the column
        for (let row = ROWS - 1; row >= 0; row--) {
          if (newBoard[row][col] === 0) {
            newBoard[row][col] = player

            // Track CPU moves for animation
            if (player === 2 && gameMode === "cpu") {
              setCpuLastMove({ row, col })
              // Clear the animation after 2 seconds
              setTimeout(() => setCpuLastMove(null), 2000)
            }

            // Check for winner
            if (checkWinner(newBoard, row, col, player)) {
              setGameState("won")
              setWinner(player)
            } else if (isBoardFull(newBoard)) {
              setGameState("draw")
            }

            return newBoard
          }
        }

        return prevBoard // Column is full
      })
    },
    [checkWinner, isBoardFull, gameMode],
  )

  const handleColumnClick = useCallback(
    (col: number) => {
      if (gameState !== "playing" || board[0][col] !== 0) return

      dropPiece(col, currentPlayer)

      if (gameState === "playing") {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
      }
    },
    [board, currentPlayer, gameState, dropPiece],
  )

  // CPU AI - Simple strategy
  const getCPUMove = useCallback(
    (board: Board): number => {
      // Check if CPU can win
      for (let col = 0; col < COLS; col++) {
        if (board[0][col] !== 0) continue

        const testBoard = board.map((row) => [...row])
        for (let row = ROWS - 1; row >= 0; row--) {
          if (testBoard[row][col] === 0) {
            testBoard[row][col] = 2
            if (checkWinner(testBoard, row, col, 2)) {
              return col
            }
            break
          }
        }
      }

      // Check if need to block player
      for (let col = 0; col < COLS; col++) {
        if (board[0][col] !== 0) continue

        const testBoard = board.map((row) => [...row])
        for (let row = ROWS - 1; row >= 0; row--) {
          if (testBoard[row][col] === 0) {
            testBoard[row][col] = 1
            if (checkWinner(testBoard, row, col, 1)) {
              return col
            }
            break
          }
        }
      }

      // Try center columns first
      const centerCols = [3, 2, 4, 1, 5, 0, 6]
      for (const col of centerCols) {
        if (board[0][col] === 0) {
          return col
        }
      }

      return 0 // Fallback
    },
    [checkWinner],
  )

  useEffect(() => {
    if (gameMode === "cpu" && currentPlayer === 2 && gameState === "playing") {
      setIsThinking(true)
      const timer = setTimeout(() => {
        const cpuCol = getCPUMove(board)
        dropPiece(cpuCol, 2)
        setCurrentPlayer(1)
        setIsThinking(false)
      }, 1000)

      return () => {
        clearTimeout(timer)
        setIsThinking(false)
      }
    }
  }, [gameMode, currentPlayer, gameState, board, getCPUMove, dropPiece])

  if (!gameMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: `${themeColor}20` }}>
        <Card className="w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Connect Four</h2>
          <p className="text-gray-600 mb-8">Choose your game mode</p>

          <div className="space-y-4">
            <Button
              onClick={() => setGameMode("pvp")}
              className="w-full h-16 text-lg"
              style={{ backgroundColor: themeColor }}
            >
              <User className="w-6 h-6 mr-3" />
              Player vs Player
            </Button>

            <Button
              onClick={() => setGameMode("cpu")}
              className="w-full h-16 text-lg"
              variant="outline"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              <Bot className="w-6 h-6 mr-3" />
              Player vs CPU
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: `${themeColor}20` }}
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <h2 className="text-2xl font-bold">Connect Four</h2>
            <p className="text-sm text-gray-600">{gameMode === "pvp" ? "Player vs Player" : "Player vs CPU"}</p>
          </div>

          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-8">
            {/* Player 1 */}
            <div
              className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
                currentPlayer === 1 && gameState === "playing"
                  ? "bg-red-100 border-2 border-red-400 scale-105"
                  : "bg-gray-100 opacity-60"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-black"></div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-semibold">Player 1</span>
              </div>
              {currentPlayer === 1 && gameState === "playing" && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>

            {/* VS */}
            <div className="text-2xl font-bold text-gray-400">VS</div>

            {/* Player 2 / CPU */}
            <div
              className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
                currentPlayer === 2 && gameState === "playing"
                  ? "bg-yellow-100 border-2 border-yellow-400 scale-105"
                  : "bg-gray-100 opacity-60"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-black"></div>
              <div className="flex items-center space-x-2">
                {gameMode === "cpu" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                <span className="font-semibold">{gameMode === "cpu" ? "CPU" : "Player 2"}</span>
              </div>
              {currentPlayer === 2 && gameState === "playing" && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              )}
              {isThinking && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          {gameState === "won" && winner && (
            <div className="p-4 rounded-lg bg-green-100 border-2 border-green-400">
              <p className="text-xl font-bold">
                {winner === 1 ? (
                  <span className="text-red-600">🎉 Player 1 Wins! 🎉</span>
                ) : (
                  <span className="text-yellow-600">🎉 {gameMode === "cpu" ? "CPU Wins!" : "Player 2 Wins!"} 🎉</span>
                )}
              </p>
            </div>
          )}

          {gameState === "draw" && (
            <div className="p-4 rounded-lg bg-gray-100 border-2 border-gray-400">
              <p className="text-xl font-bold text-gray-600">🤝 It's a Draw! 🤝</p>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-black">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: COLS }, (_, col) => (
              <div key={col} className="flex flex-col gap-2">
                {Array.from({ length: ROWS }, (_, row) => {
                  const isCpuLastMove = cpuLastMove && cpuLastMove.row === row && cpuLastMove.col === col

                  return (
                    <button
                      key={`${row}-${col}`}
                      onClick={() => handleColumnClick(col)}
                      onMouseEnter={() => setHoveredCol(col)}
                      onMouseLeave={() => setHoveredCol(null)}
                      disabled={gameState !== "playing" || board[0][col] !== 0 || isThinking}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-black transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed ${
                        isCpuLastMove ? "animate-pulse" : ""
                      }`}
                      style={{
                        backgroundColor:
                          board[row][col] === 1
                            ? "#ef4444"
                            : board[row][col] === 2
                              ? "#f59e0b"
                              : hoveredCol === col && gameState === "playing" && board[0][col] === 0 && !isThinking
                                ? `${currentPlayer === 1 ? "#ef4444" : "#f59e0b"}40`
                                : "#8b5cf6",
                        boxShadow: isCpuLastMove ? "0 0 20px #f59e0b" : "none",
                        animation: isCpuLastMove ? "blink 0.5s ease-in-out 4" : "none",
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        {gameState !== "playing" && (
          <div className="text-center mt-6">
            <Button onClick={resetGame} size="lg" style={{ backgroundColor: themeColor }}>
              Play Again
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
