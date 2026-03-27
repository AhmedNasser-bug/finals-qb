"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Trophy, Clock, Target, Play } from "lucide-react"

interface GameCard {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryMatchGameProps {
  onBack?: () => void
  themeColor?: string
}

const CARD_SYMBOLS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺", "🎻", "🎹", "🎤", "🎧", "🎬", "🎪", "🎨", "🎭"]

export default function MemoryMatchGame({ onBack, themeColor = "#ec4899" }: MemoryMatchGameProps) {
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [showStartModal, setShowStartModal] = useState(true)
  const [showEndModal, setShowEndModal] = useState(false)

  const getDifficultySettings = (diff: "easy" | "medium" | "hard") => {
    switch (diff) {
      case "easy":
        return {
          pairs: 6,
          gridCols: 4,
          flipBackDelay: 2000, // 2 seconds to see cards
          description: "6 pairs • 2 seconds to memorize",
        }
      case "medium":
        return {
          pairs: 8,
          gridCols: 4,
          flipBackDelay: 1200, // 1.2 seconds
          description: "8 pairs • 1.2 seconds to memorize",
        }
      case "hard":
        return {
          pairs: 12,
          gridCols: 6,
          flipBackDelay: 600, // 0.6 seconds - very fast!
          description: "12 pairs • 0.6 seconds to memorize",
        }
    }
  }

  const initializeGame = useCallback(() => {
    const { pairs } = getDifficultySettings(difficulty)
    const selectedSymbols = CARD_SYMBOLS.slice(0, pairs)
    const gameCards = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(gameCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimeElapsed(0)
    setGameStarted(false)
    setGameWon(false)
    setShowEndModal(false)
  }, [difficulty])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameWon])

  useEffect(() => {
    if (matchedPairs === getDifficultySettings(difficulty).pairs) {
      setGameWon(true)
      setGameStarted(false)
      setShowEndModal(true)
    }
  }, [matchedPairs, difficulty])

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true)

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      if (firstCard?.symbol === secondCard?.symbol) {
        // Match found
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c)))
          setMatchedPairs((prev) => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match - use difficulty-based timing
        const { flipBackDelay } = getDifficultySettings(difficulty)
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)))
          setFlippedCards([])
        }, flipBackDelay)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreRating = () => {
    const { pairs } = getDifficultySettings(difficulty)
    const perfectMoves = pairs
    const efficiency = perfectMoves / moves

    if (efficiency >= 0.9) return "Perfect!"
    if (efficiency >= 0.7) return "Excellent!"
    if (efficiency >= 0.5) return "Good!"
    return "Keep practicing!"
  }

  const startGameWithDifficulty = (selectedDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(selectedDifficulty)
    setShowStartModal(false)
    // Initialize game with new difficulty will happen via useEffect
  }

  const { gridCols } = getDifficultySettings(difficulty)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-semibold text-gray-900">Memory Match</h1>

          <Button
            onClick={() => setShowStartModal(true)}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Stats */}
        {!showStartModal && (
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Target className="w-4 h-4" />
              <span className="font-mono text-sm">{moves} moves</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Trophy className="w-4 h-4" />
              <span className="font-mono text-sm">
                {matchedPairs}/{getDifficultySettings(difficulty).pairs}
              </span>
            </div>
          </div>
        )}

        {/* Game Board */}
        {!showStartModal && (
          <div
            className={`grid gap-3 max-w-2xl mx-auto mb-8`}
            style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
          >
            {cards.map((card) => (
              <Card
                key={card.id}
                className={`
                  aspect-square flex items-center justify-center cursor-pointer
                  transition-all duration-300 hover:scale-105 select-none border-0 shadow-sm
                  ${
                    card.isMatched
                      ? "bg-green-50 opacity-60 cursor-default"
                      : card.isFlipped
                        ? "bg-white shadow-md"
                        : "bg-gray-100 hover:bg-gray-200 hover:shadow-md"
                  }
                `}
                onClick={() => handleCardClick(card.id)}
              >
                {card.isFlipped || card.isMatched ? (
                  <span className="text-3xl">{card.symbol}</span>
                ) : (
                  <div className="w-6 h-6 bg-gray-300 rounded-full opacity-40" />
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Start Modal */}
        {showStartModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-pink-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Memory Match</h2>
                <p className="text-gray-600 text-sm">Choose your difficulty level</p>
              </div>

              <div className="space-y-3 mb-6">
                {(["easy", "medium", "hard"] as const).map((diff) => {
                  const settings = getDifficultySettings(diff)
                  return (
                    <Button
                      key={diff}
                      onClick={() => startGameWithDifficulty(diff)}
                      variant="outline"
                      className="w-full p-4 h-auto text-left justify-start hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-start">
                        <div className="font-medium text-gray-900 capitalize mb-1">{diff}</div>
                        <div className="text-sm text-gray-500">{settings.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <h3 className="font-medium text-gray-800 mb-2">How to Play:</h3>
                <ul className="space-y-1">
                  <li>• Click cards to reveal symbols</li>
                  <li>• Find matching pairs</li>
                  <li>• Remember card positions quickly</li>
                  <li>• Match all pairs to win</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* End Modal */}
        {showEndModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Congratulations!</h2>
                <p className="text-gray-600 text-sm mb-6">
                  You completed the <span className="font-medium capitalize">{difficulty}</span> level
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Time</div>
                      <div className="font-mono text-lg text-gray-900">{formatTime(timeElapsed)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Moves</div>
                      <div className="font-mono text-lg text-gray-900">{moves}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-lg font-medium text-green-600">{getScoreRating()}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowEndModal(false)
                      initializeGame()
                    }}
                    className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button onClick={() => setShowStartModal(true)} variant="outline" className="flex-1">
                    New Level
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <button onClick={() => setShowEndModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">
                    Continue Playing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
