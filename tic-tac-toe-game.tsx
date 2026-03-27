"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Grid3X3 } from "lucide-react"

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600
const GRID_SIZE = 200

type Player = "X" | "O" | null
type GameMode = "human" | "ai"

interface TicTacToeGameProps {
  onBack: () => void
  themeColor: string
}

export default function TicTacToeGame({ onBack, themeColor }: TicTacToeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Player | "tie" | null>(null)
  const [gameMode, setGameMode] = useState<GameMode>("ai")
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 })
  const [isThinking, setIsThinking] = useState(false)

  const gameStateRef = useRef<{
    board: Player[]
    currentPlayer: Player
    winner: Player | "tie" | null
    gameMode: GameMode
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null
    animatingWin: boolean
    winLine: number[] | null
  }>({
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    gameMode: "ai",
    canvas: null,
    ctx: null,
    animatingWin: false,
    winLine: null,
  })

  const checkWinner = useCallback((board: Player[]): { winner: Player | "tie" | null; line: number[] | null } => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const line of lines) {
      const [a, b, c] = line
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line }
      }
    }

    if (board.every((cell) => cell !== null)) {
      return { winner: "tie", line: null }
    }

    return { winner: null, line: null }
  }, [])

  const minimax = useCallback(
    (board: Player[], depth: number, isMaximizing: boolean): number => {
      const { winner } = checkWinner(board)

      if (winner === "O") return 10 - depth
      if (winner === "X") return depth - 10
      if (winner === "tie") return 0

      if (isMaximizing) {
        let bestScore = Number.NEGATIVE_INFINITY
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = "O"
            const score = minimax(board, depth + 1, false)
            board[i] = null
            bestScore = Math.max(score, bestScore)
          }
        }
        return bestScore
      } else {
        let bestScore = Number.POSITIVE_INFINITY
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = "X"
            const score = minimax(board, depth + 1, true)
            board[i] = null
            bestScore = Math.min(score, bestScore)
          }
        }
        return bestScore
      }
    },
    [checkWinner],
  )

  const getBestMove = useCallback(
    (board: Player[]): number => {
      let bestScore = Number.NEGATIVE_INFINITY
      let bestMove = -1

      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "O"
          const score = minimax(board, 0, false)
          board[i] = null
          if (score > bestScore) {
            bestScore = score
            bestMove = i
          }
        }
      }

      return bestMove
    },
    [minimax],
  )

  const makeMove = useCallback(
    (index: number) => {
      if (board[index] !== null || winner !== null || isThinking) return

      const newBoard = [...board]
      newBoard[index] = currentPlayer
      setBoard(newBoard)
      gameStateRef.current.board = newBoard

      const { winner: gameWinner, line } = checkWinner(newBoard)

      if (gameWinner) {
        setWinner(gameWinner)
        gameStateRef.current.winner = gameWinner
        gameStateRef.current.winLine = line
        gameStateRef.current.animatingWin = true

        setScores((prev) => ({
          ...prev,
          [gameWinner === "tie" ? "ties" : gameWinner]: prev[gameWinner === "tie" ? "ties" : gameWinner] + 1,
        }))

        setTimeout(() => setGameState("gameOver"), 1500)
        return
      }

      const nextPlayer = currentPlayer === "X" ? "O" : "X"
      setCurrentPlayer(nextPlayer)
      gameStateRef.current.currentPlayer = nextPlayer

      // AI move
      if (gameMode === "ai" && nextPlayer === "O") {
        setIsThinking(true)
        setTimeout(() => {
          const aiMove = getBestMove(newBoard)
          if (aiMove !== -1) {
            const aiBoard = [...newBoard]
            aiBoard[aiMove] = "O"
            setBoard(aiBoard)
            gameStateRef.current.board = aiBoard

            const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard)
            if (aiWinner) {
              setWinner(aiWinner)
              gameStateRef.current.winner = aiWinner
              gameStateRef.current.winLine = aiLine
              gameStateRef.current.animatingWin = true

              setScores((prev) => ({
                ...prev,
                [aiWinner === "tie" ? "ties" : aiWinner]: prev[aiWinner === "tie" ? "ties" : aiWinner] + 1,
              }))

              setTimeout(() => setGameState("gameOver"), 1500)
            } else {
              setCurrentPlayer("X")
              gameStateRef.current.currentPlayer = "X"
            }
          }
          setIsThinking(false)
        }, 500)
      }
    },
    [board, currentPlayer, winner, isThinking, gameMode, checkWinner, getBestMove],
  )

  const resetGame = useCallback(() => {
    const newBoard = Array(9).fill(null)
    setBoard(newBoard)
    setCurrentPlayer("X")
    setWinner(null)
    setIsThinking(false)
    gameStateRef.current.board = newBoard
    gameStateRef.current.currentPlayer = "X"
    gameStateRef.current.winner = null
    gameStateRef.current.animatingWin = false
    gameStateRef.current.winLine = null
    setGameState("playing")
  }, [])

  const startGame = useCallback(
    (mode: GameMode) => {
      setGameMode(mode)
      gameStateRef.current.gameMode = mode
      resetGame()
    },
    [resetGame],
  )

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.fillStyle = "#fafafa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1
    for (let i = 0; i <= canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i <= canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw game grid
    ctx.strokeStyle = "#171717"
    ctx.lineWidth = 4

    // Vertical lines
    ctx.beginPath()
    ctx.moveTo(GRID_SIZE, 0)
    ctx.lineTo(GRID_SIZE, canvas.height)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(GRID_SIZE * 2, 0)
    ctx.lineTo(GRID_SIZE * 2, canvas.height)
    ctx.stroke()

    // Horizontal lines
    ctx.beginPath()
    ctx.moveTo(0, GRID_SIZE)
    ctx.lineTo(canvas.width, GRID_SIZE)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, GRID_SIZE * 2)
    ctx.lineTo(canvas.width, GRID_SIZE * 2)
    ctx.stroke()

    // Draw X's and O's
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3)
      const col = i % 3
      const x = col * GRID_SIZE + GRID_SIZE / 2
      const y = row * GRID_SIZE + GRID_SIZE / 2
      const player = gameStateRef.current.board[i]

      if (player === "X") {
        ctx.strokeStyle = themeColor
        ctx.lineWidth = 8
        ctx.lineCap = "round"

        ctx.beginPath()
        ctx.moveTo(x - 60, y - 60)
        ctx.lineTo(x + 60, y + 60)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + 60, y - 60)
        ctx.lineTo(x - 60, y + 60)
        ctx.stroke()
      } else if (player === "O") {
        ctx.strokeStyle = "#171717"
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.arc(x, y, 60, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Draw winning line
    if (gameStateRef.current.animatingWin && gameStateRef.current.winLine) {
      const line = gameStateRef.current.winLine
      ctx.strokeStyle = "#ff4444"
      ctx.lineWidth = 12
      ctx.lineCap = "round"

      const getPosition = (index: number) => {
        const row = Math.floor(index / 3)
        const col = index % 3
        return {
          x: col * GRID_SIZE + GRID_SIZE / 2,
          y: row * GRID_SIZE + GRID_SIZE / 2,
        }
      }

      const start = getPosition(line[0])
      const end = getPosition(line[2])

      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }

    // Draw current player indicator
    if (gameState === "playing" && !gameStateRef.current.winner) {
      ctx.fillStyle = "#171717"
      ctx.font = "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      ctx.textAlign = "center"

      if (isThinking) {
        ctx.fillText("AI is thinking...", canvas.width / 2, canvas.height - 30)
      } else {
        const playerText =
          gameMode === "ai" ? (currentPlayer === "X" ? "Your turn" : "AI's turn") : `Player ${currentPlayer}'s turn`
        ctx.fillText(playerText, canvas.width / 2, canvas.height - 30)
      }
    }
  }, [gameState, currentPlayer, isThinking, gameMode, themeColor])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (gameState !== "playing" || winner !== null || isThinking) return
      if (gameMode === "ai" && currentPlayer === "O") return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const col = Math.floor(x / GRID_SIZE)
      const row = Math.floor(y / GRID_SIZE)
      const index = row * 3 + col

      if (index >= 0 && index < 9) {
        makeMove(index)
      }
    },
    [gameState, winner, isThinking, gameMode, currentPlayer, makeMove],
  )

  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    gameStateRef.current.canvas = canvas
    gameStateRef.current.ctx = canvas.getContext("2d")
  }, [])

  useEffect(() => {
    const animate = () => {
      drawBoard()
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [drawBoard])

  useEffect(() => {
    initGame()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [initGame])

  useEffect(() => {
    if (gameState !== "gameOver") return
    const handleGameOverKeys = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") resetGame()
      else if (e.key === "Escape") setGameState("menu")
    }
    window.addEventListener("keydown", handleGameOverKeys)
    return () => window.removeEventListener("keydown", handleGameOverKeys)
  }, [gameState, resetGame])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg shadow-sm cursor-pointer"
          style={{ maxWidth: "100%", height: "auto" }}
          onClick={handleCanvasClick}
        />
        {gameState === "menu" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
              <div className="mb-6">
                <div
                  className="w-8 h-8 mx-auto mb-4 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: themeColor }}
                >
                  <Grid3X3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-medium text-gray-900 mb-2">Tic Tac Toe</h1>
                <p className="text-sm text-gray-600 mb-4">Classic strategy game - get three in a row!</p>
                <div className="bg-gray-50 rounded-lg p-3 text-left text-xs text-gray-600 space-y-1">
                  <div className="font-medium text-gray-800">How to Play:</div>
                  <div>• Click on empty squares to place your mark</div>
                  <div>• Get three X's or O's in a row to win</div>
                  <div>• Rows, columns, or diagonals all count!</div>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => startGame("ai")}
                  style={{ backgroundColor: themeColor }}
                  className="w-full text-white px-6 py-2 text-sm font-medium"
                >
                  Play vs AI
                </Button>
                <Button
                  onClick={() => startGame("human")}
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2 text-sm font-medium"
                >
                  Play vs Human
                </Button>
              </div>
              {(scores.X > 0 || scores.O > 0 || scores.ties > 0) && (
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <div className="font-medium">Score:</div>
                  <div>
                    X: {scores.X} | O: {scores.O} | Ties: {scores.ties}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-gray-200 shadow-sm w-96">
              <h2 className="text-lg font-medium text-gray-500 mb-1">Tic Tac Toe</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                {winner === "tie"
                  ? "It's a Tie! 🤝"
                  : winner === "X"
                    ? gameMode === "ai"
                      ? "You Win! 🎉"
                      : "X Wins! 🎉"
                    : gameMode === "ai"
                      ? "AI Wins! 🤖"
                      : "O Wins! 🎉"}
              </h3>
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">X Wins</div>
                    <div className="text-xl font-mono" style={{ color: themeColor }}>
                      {scores.X}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Ties</div>
                    <div className="text-xl font-mono text-gray-700">{scores.ties}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">O Wins</div>
                    <div className="text-xl font-mono text-gray-700">{scores.O}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={resetGame}
                  style={{ backgroundColor: themeColor }}
                  className="text-white px-4 py-2 text-sm font-medium"
                >
                  Play Again
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
          {gameState === "playing" ? "Click on empty squares to make your move" : "A v0 Mini Game"}
        </p>
      </div>
    </div>
  )
}
