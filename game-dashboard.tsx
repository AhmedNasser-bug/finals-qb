"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Play,
  Triangle,
  PawPrint,
  Grid3X3,
  Gamepad2,
  Timer,
  Zap,
  Target,
  Square,
  Palette,
  Rocket,
  Brain,
  Bomb,
  BookOpen,
  Sparkles,
  Coins,
  Circle,
  Calculator,
  Keyboard,
  Crosshair,
} from "lucide-react"
import FlappyTriangle from "./flappy-triangle"
import DinoGame from "./dino-game"
import SnakeGame from "./snake-game"
import PongGame from "./pong-game"
import ReactionGame from "./reaction-game"
import TetrisGame from "./tetris-game"
import BreakoutGame from "./breakout-game"
import OrbitDefense from "./orbit-defense"
import ColorMatchGame from "./color-match-game"
import SpaceInvadersGame from "./space-invaders-game"
import TicTacToeGame from "./tic-tac-toe-game"
import MemoryMatchGame from "./memory-match-game"
import MinesweeperGame from "./minesweeper-game"
import WordScrambleGame from "./word-scramble-game"
import BubblePopGame from "./bubble-pop-game"
import CoinCollectorGame from "./coin-collector-game"
import ConnectFourGame from "./connect-four-game"
import WhackAMoleGame from "./whack-a-mole-game"
import SimonSaysGame from "./simon-says-game"
import Puzzle2048Game from "./puzzle-2048-game"
import QuickMathGame from "./quick-math-game"
import TypingSpeedGame from "./typing-speed-game"
import AimTrainerGame from "./aim-trainer-game"

type GameType =
  | "menu"
  | "2048"
  | "simon-says"
  | "whack-a-mole"
  | "coin-collector"
  | "bubble-pop"
  | "word-scramble"
  | "flappy"
  | "dino"
  | "snake"
  | "pong"
  | "reaction"
  | "tetris"
  | "breakout"
  | "orbit-defense"
  | "color-match"
  | "space-invaders"
  | "tic-tac-toe"
  | "memory-match"
  | "minesweeper"
  | "connect-four"
  | "quick-math"
  | "typing-speed"
  | "aim-trainer"

type Category = "All" | "Arcade" | "Puzzle" | "Strategy" | "Action"

export default function GameDashboard() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu")
  const [selectedCategory, setSelectedCategory] = useState<Category>("All")

  const games = [
    {
      id: "aim-trainer" as const,
      title: "Aim Trainer",
      description: "Test your mouse accuracy and reaction time - click targets fast!",
      icon: Crosshair,
      color: "bg-red-500",
      themeColor: "#ef4444",
      category: "Action" as const,
      isNew: true,
    },
    {
      id: "typing-speed" as const,
      title: "Typing Speed",
      description: "Test your typing speed and accuracy with timed challenges!",
      icon: Keyboard,
      color: "bg-teal-500",
      themeColor: "#14b8a6",
      category: "Action" as const,
      isNew: true,
    },
    {
      id: "2048" as const,
      title: "2048",
      description: "Slide numbered tiles to reach 2048 - addictive puzzle challenge!",
      icon: Grid3X3,
      color: "bg-amber-500",
      themeColor: "#f59e0b",
      category: "Puzzle" as const,
      isNew: true,
    },
    {
      id: "simon-says" as const,
      title: "Simon Says",
      description: "Watch the pattern and repeat it back - test your memory!",
      icon: Brain,
      color: "bg-purple-600",
      themeColor: "#9333ea",
      category: "Action" as const,
      isNew: true,
    },
    {
      id: "whack-a-mole" as const,
      title: "Whack-a-Mole",
      description: "Quick reflexes needed - whack the moles before they hide!",
      icon: Target,
      color: "bg-green-500",
      themeColor: "#22c55e",
      category: "Action" as const,
      isNew: true,
    },
    {
      id: "connect-four" as const,
      title: "Connect Four",
      description: "Drop pieces to get four in a row - play vs friends or CPU",
      icon: Circle,
      color: "bg-red-500",
      themeColor: "#ef4444",
      category: "Strategy" as const,
      isNew: true,
    },
    {
      id: "word-scramble" as const,
      title: "Word Scramble",
      description: "Unscramble letters to form words quickly",
      icon: BookOpen,
      color: "bg-purple-500",
      themeColor: "#8b5cf6",
      category: "Puzzle" as const,
      isNew: true,
    },
    {
      id: "memory-match" as const,
      title: "Memory Match",
      description: "Match pairs of cards with memory",
      icon: Brain,
      color: "bg-pink-500",
      themeColor: "#ec4899",
      category: "Puzzle" as const,
    },
    {
      id: "coin-collector" as const,
      title: "Coin Collector",
      description: "Jump and collect coins in this platformer adventure",
      icon: Coins,
      color: "bg-yellow-500",
      themeColor: "#f59e0b",
      category: "Arcade" as const,
    },
    {
      id: "bubble-pop" as const,
      title: "Bubble Pop",
      description: "Pop colorful bubbles and build combos",
      icon: Sparkles,
      color: "bg-cyan-500",
      themeColor: "#4ecdc4",
      category: "Arcade" as const,
    },
    {
      id: "minesweeper" as const,
      title: "Minesweeper",
      description: "Clear the board without hitting mines",
      icon: Bomb,
      color: "bg-gray-700",
      themeColor: "#374151",
      category: "Strategy" as const,
    },
    {
      id: "flappy" as const,
      title: "Triangle",
      description: "Navigate through obstacles with precise timing.",
      icon: Triangle,
      color: "bg-yellow-500",
      themeColor: "#f59e0b",
      category: "Arcade" as const,
    },
    {
      id: "dino" as const,
      title: "Sheep Run",
      description: "Jump over cacti and dodge flying birds.",
      icon: PawPrint,
      color: "bg-gray-700",
      themeColor: "#374151",
      category: "Arcade" as const,
    },
    {
      id: "snake" as const,
      title: "Snake",
      description: "A modern, minimalistic take on the classic.",
      icon: Grid3X3,
      color: "bg-green-500",
      themeColor: "#22c55e",
      category: "Arcade" as const,
    },
    {
      id: "pong" as const,
      title: "Pong",
      description: "The timeless arcade classic. Play against an AI.",
      icon: Gamepad2,
      color: "bg-blue-500",
      themeColor: "#3b82f6",
      category: "Arcade" as const,
    },
    {
      id: "reaction" as const,
      title: "Reaction Time",
      description: "Test your reflexes. How fast can you click?",
      icon: Timer,
      color: "bg-red-500",
      themeColor: "#ef4444",
      category: "Action" as const,
    },
    {
      id: "tetris" as const,
      title: "Tetris",
      description: "Stack falling blocks to clear lines and score high.",
      icon: Square,
      color: "bg-purple-500",
      themeColor: "#a855f7",
      category: "Puzzle" as const,
    },
    {
      id: "breakout" as const,
      title: "Breakout",
      description: "Break all the bricks with your ball and paddle.",
      icon: Zap,
      color: "bg-orange-500",
      themeColor: "#f97316",
      category: "Arcade" as const,
    },
    {
      id: "orbit-defense" as const,
      title: "Orbit Defense",
      description: "Strategic tower defense in the vastness of space.",
      icon: Target,
      color: "bg-indigo-500",
      themeColor: "#6366f1",
      category: "Strategy" as const,
    },
    {
      id: "color-match" as const,
      title: "Color Match",
      description: "Match the target color as fast as you can!",
      icon: Palette,
      color: "bg-pink-500",
      themeColor: "#ec4899",
      category: "Action" as const,
    },
    {
      id: "space-invaders" as const,
      title: "Space Invaders",
      description: "Defend Earth from waves of alien invaders in this classic arcade shooter.",
      icon: Rocket,
      color: "bg-cyan-500",
      themeColor: "#06b6d4",
      category: "Action" as const,
    },
    {
      id: "tic-tac-toe" as const,
      title: "Tic Tac Toe",
      description: "Classic strategy game - get three in a row to win!",
      icon: Grid3X3,
      color: "bg-emerald-500",
      themeColor: "#10b981",
      category: "Strategy" as const,
    },
    {
      id: "quick-math" as const,
      title: "Quick Math",
      description: "Answer as many math questions as you can in 60 seconds.",
      icon: Calculator,
      color: "bg-sky-500",
      themeColor: "#0ea5e9",
      category: "Puzzle" as const,
      isNew: true,
    },
  ]

  const categories: Category[] = ["All", "Arcade", "Puzzle", "Strategy", "Action"]

  const filteredGames = selectedCategory === "All" ? games : games.filter((game) => game.category === selectedCategory)

  const renderGame = () => {
    const gameData = games.find((g) => g.id === currentGame)
    const commonProps = {
      onBack: () => setCurrentGame("menu"),
      themeColor: gameData ? gameData.themeColor : "#000000",
    }
    switch (currentGame) {
      case "typing-speed":
        return <TypingSpeedGame {...commonProps} />
      case "aim-trainer":
        return <AimTrainerGame {...commonProps} />
      case "2048":
        return <Puzzle2048Game {...commonProps} />
      case "simon-says":
        return <SimonSaysGame {...commonProps} />
      case "whack-a-mole":
        return <WhackAMoleGame {...commonProps} />
      case "coin-collector":
        return <CoinCollectorGame {...commonProps} />
      case "bubble-pop":
        return <BubblePopGame {...commonProps} />
      case "word-scramble":
        return <WordScrambleGame {...commonProps} />
      case "connect-four":
        return <ConnectFourGame {...commonProps} />
      case "memory-match":
        return <MemoryMatchGame {...commonProps} />
      case "minesweeper":
        return <MinesweeperGame {...commonProps} />
      case "flappy":
        return <FlappyTriangle {...commonProps} />
      case "dino":
        return <DinoGame {...commonProps} />
      case "snake":
        return <SnakeGame {...commonProps} />
      case "pong":
        return <PongGame {...commonProps} />
      case "reaction":
        return <ReactionGame {...commonProps} />
      case "tetris":
        return <TetrisGame {...commonProps} />
      case "breakout":
        return <BreakoutGame {...commonProps} />
      case "orbit-defense":
        return <OrbitDefense {...commonProps} />
      case "color-match":
        return <ColorMatchGame {...commonProps} />
      case "space-invaders":
        return <SpaceInvadersGame {...commonProps} />
      case "tic-tac-toe":
        return <TicTacToeGame {...commonProps} />
      case "quick-math":
        return <QuickMathGame {...commonProps} />
      default:
        return null
    }
  }

  if (currentGame !== "menu") {
    return (
      <div className="relative w-full h-full">
        <Button
          onClick={() => setCurrentGame("menu")}
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>
        {renderGame()}
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-4">
            Crafted on v0.dev by{" "}
            <a
              href="https://x.com/shribuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black underline underline-offset-2"
            >
              shrix1
            </a>
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">v0 Mini Game Arcade</h1>
          <p className="text-gray-600 text-lg">A collection of simple games build with v0.dev</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                selectedCategory === category
                  ? "bg-black text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-black hover:bg-gray-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Card
              key={game.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer bg-white hover:shadow-lg"
              onClick={() => setCurrentGame(game.id)}
            >
              {game.isNew && (
                <div className="absolute top-3 right-3 bg-black text-white text-xs font-medium px-2 py-1 rounded-full z-10">
                  NEW
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${game.color} text-white`}>
                    <game.icon className="w-5 h-5" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Play className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-black">{game.title}</CardTitle>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{game.category}</span>
                  </div>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {game.description}
                  </CardDescription>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
