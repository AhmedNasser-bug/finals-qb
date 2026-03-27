"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Trophy, Shuffle, CheckCircle, RotateCcw } from "lucide-react"

interface WordScrambleGameProps {
  onBack?: () => void
  themeColor?: string
}

const WORD_CATEGORIES = {
  animals: ["elephant", "giraffe", "penguin", "butterfly", "kangaroo", "dolphin", "octopus", "flamingo"],
  countries: ["australia", "brazil", "canada", "denmark", "egypt", "france", "germany", "iceland"],
  foods: ["pizza", "hamburger", "spaghetti", "chocolate", "sandwich", "pancake", "avocado", "strawberry"],
  technology: ["computer", "internet", "keyboard", "smartphone", "software", "database", "algorithm", "programming"],
  nature: ["mountain", "rainbow", "thunder", "waterfall", "forest", "desert", "volcano", "glacier"],
}

type Category = keyof typeof WORD_CATEGORIES
type GameState = "menu" | "playing" | "correct" | "gameOver"

export default function WordScrambleGame({ onBack, themeColor = "#8b5cf6" }: WordScrambleGameProps) {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [category, setCategory] = useState<Category>("animals")
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledWord, setScrambledWord] = useState("")
  const [userGuess, setUserGuess] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [streak, setStreak] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [hint, setHint] = useState("")
  const [usedWords, setUsedWords] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const scrambleWord = (word: string): string => {
    const letters = word.split("")
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    return letters.join("")
  }

  const getHint = (word: string, category: Category): string => {
    const hints: Record<Category, Record<string, string>> = {
      animals: {
        elephant: "Large mammal with a trunk",
        giraffe: "Tallest animal in the world",
        penguin: "Black and white bird that can't fly",
        butterfly: "Colorful insect with wings",
        kangaroo: "Australian animal that hops",
        dolphin: "Intelligent marine mammal",
        octopus: "Sea creature with eight arms",
        flamingo: "Pink bird that stands on one leg",
      },
      countries: {
        australia: "Land down under",
        brazil: "Largest South American country",
        canada: "Northern neighbor of the USA",
        denmark: "Scandinavian kingdom",
        egypt: "Home of the pyramids",
        france: "Country of the Eiffel Tower",
        germany: "European country known for beer",
        iceland: "Nordic island nation",
      },
      foods: {
        pizza: "Italian dish with cheese and toppings",
        hamburger: "American sandwich with meat patty",
        spaghetti: "Long thin pasta",
        chocolate: "Sweet brown treat",
        sandwich: "Food between two slices of bread",
        pancake: "Flat breakfast cake",
        avocado: "Green fruit used in guacamole",
        strawberry: "Red berry with seeds on outside",
      },
      technology: {
        computer: "Electronic device for processing data",
        internet: "Global network of computers",
        keyboard: "Input device with keys",
        smartphone: "Mobile device with apps",
        software: "Computer programs",
        database: "Organized collection of data",
        algorithm: "Step-by-step problem-solving process",
        programming: "Writing computer code",
      },
      nature: {
        mountain: "Large natural elevation",
        rainbow: "Colorful arc in the sky",
        thunder: "Sound that follows lightning",
        waterfall: "Water falling from height",
        forest: "Large area covered with trees",
        desert: "Dry, sandy region",
        volcano: "Mountain that erupts lava",
        glacier: "Large mass of ice",
      },
    }
    return hints[category][word] || "No hint available"
  }

  const getNewWord = useCallback(() => {
    const categoryWords = WORD_CATEGORIES[category]
    const availableWords = categoryWords.filter((word) => !usedWords.includes(word))

    if (availableWords.length === 0) {
      // Reset used words if all have been used
      setUsedWords([])
      const newWord = categoryWords[Math.floor(Math.random() * categoryWords.length)]
      setCurrentWord(newWord)
      setScrambledWord(scrambleWord(newWord))
      setHint(getHint(newWord, category))
      setUsedWords([newWord])
    } else {
      const newWord = availableWords[Math.floor(Math.random() * availableWords.length)]
      setCurrentWord(newWord)
      setScrambledWord(scrambleWord(newWord))
      setHint(getHint(newWord, category))
      setUsedWords((prev) => [...prev, newWord])
    }
    setShowHint(false)
  }, [category, usedWords])

  const startGame = (selectedCategory: Category) => {
    setCategory(selectedCategory)
    setGameState("playing")
    setScore(0)
    setTimeLeft(60)
    setStreak(0)
    setUsedWords([])
    setUserGuess("")
    setShowHint(false)
  }

  const checkAnswer = () => {
    if (userGuess.toLowerCase().trim() === currentWord.toLowerCase()) {
      setGameState("correct")
      const points = 10 + streak * 2
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setTimeout(() => {
        setGameState("playing")
        getNewWord()
        setUserGuess("")
      }, 1500)
    } else {
      setStreak(0)
      // Visual feedback for wrong answer
      setUserGuess("")
    }
  }

  const skipWord = () => {
    setStreak(0)
    getNewWord()
    setUserGuess("")
  }

  const useHint = () => {
    if (!showHint) {
      setShowHint(true)
      setScore((prev) => Math.max(0, prev - 5)) // Penalty for using hint
    }
  }

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("gameOver")
      if (score > bestScore) {
        setBestScore(score)
      }
    }
  }, [gameState, timeLeft, score, bestScore])

  // Initialize first word when game starts
  useEffect(() => {
    if (gameState === "playing" && !currentWord) {
      getNewWord()
    }
  }, [gameState, currentWord, getNewWord])

  // Handle Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && gameState === "playing") {
        checkAnswer()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState, userGuess, currentWord])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {gameState === "menu" && (
          <div className="text-center">
            <Card className="p-8 shadow-xl border-purple-200">
              <div className="mb-6">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: themeColor }}
                >
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Word Scramble</h1>
                <p className="text-gray-600 mb-6">Unscramble the letters to form words!</p>

                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-gray-800">Choose a Category:</h3>
                  {Object.keys(WORD_CATEGORIES).map((cat) => (
                    <Button
                      key={cat}
                      onClick={() => startGame(cat as Category)}
                      variant="outline"
                      className="w-full capitalize hover:bg-purple-50 hover:border-purple-300"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                <div className="bg-purple-50 rounded-lg p-4 text-left text-sm text-gray-700">
                  <h4 className="font-semibold mb-2">How to Play:</h4>
                  <ul className="space-y-1">
                    <li>• Unscramble the letters to form the correct word</li>
                    <li>• Use hints if you're stuck (costs 5 points)</li>
                    <li>• Build streaks for bonus points</li>
                    <li>• You have 60 seconds to score as much as possible</li>
                  </ul>
                </div>

                {bestScore > 0 && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-purple-700">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">Best Score: {bestScore}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-xs text-gray-500">Score</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{timeLeft}</div>
                <div className="text-xs text-gray-500">Time</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{streak}</div>
                <div className="text-xs text-gray-500">Streak</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-sm font-bold text-gray-700 capitalize">{category}</div>
                <div className="text-xs text-gray-500">Category</div>
              </Card>
            </div>

            {/* Main Game Area */}
            <Card className="p-8 text-center shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Unscramble this word:</h2>
                <div className="text-4xl font-bold tracking-widest text-purple-600 mb-6 font-mono">
                  {scrambledWord.toUpperCase()}
                </div>

                {showHint && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="text-sm font-medium text-yellow-800">Hint:</div>
                    <div className="text-yellow-700">{hint}</div>
                  </div>
                )}

                <Input
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Type your answer here..."
                  className="text-center text-xl font-semibold mb-4"
                  autoFocus
                />

                <div className="flex gap-3 justify-center">
                  <Button onClick={checkAnswer} style={{ backgroundColor: themeColor }} className="text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                  <Button onClick={useHint} variant="outline" disabled={showHint}>
                    💡 Hint (-5 pts)
                  </Button>
                  <Button onClick={skipWord} variant="outline">
                    <Shuffle className="w-4 h-4 mr-2" />
                    Skip
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {gameState === "correct" && (
          <div className="text-center">
            <Card className="p-8 shadow-xl border-green-200 bg-green-50">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Correct!</h2>
              <p className="text-green-600 mb-4">
                The word was: <span className="font-bold">{currentWord}</span>
              </p>
              <div className="text-lg font-semibold text-green-700">
                +{10 + (streak - 1) * 2} points {streak > 1 && `(${streak} streak bonus!)`}
              </div>
            </Card>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="text-center">
            <Card className="p-8 shadow-xl border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Time's Up!</h2>
              <div className="space-y-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-3xl font-bold mb-2" style={{ color: themeColor }}>
                    {score}
                  </div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>

                {score === bestScore && score > 0 && (
                  <div className="flex items-center justify-center gap-2 text-purple-600 bg-purple-50 rounded-lg p-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">New Best Score!</span>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  Category: <span className="font-semibold capitalize">{category}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => startGame(category)}
                  style={{ backgroundColor: themeColor }}
                  className="text-white"
                >
                  Play Again
                </Button>
                <Button onClick={() => setGameState("menu")} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Menu
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
