"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Keyboard, Trophy, Clock, Target, Zap } from "lucide-react"

interface TypingSpeedGameProps {
  onBack: () => void
  themeColor: string
}

type Difficulty = "easy" | "medium" | "hard"
type SubmitKey = "space" | "enter"

const wordLists: Record<Difficulty, string[]> = {
  easy: [
    "cat",
    "dog",
    "run",
    "jump",
    "play",
    "blue",
    "red",
    "sun",
    "moon",
    "star",
    "tree",
    "fish",
    "bird",
    "book",
    "cake",
    "ball",
    "hand",
    "door",
    "rain",
    "snow",
    "milk",
    "food",
    "home",
    "love",
    "fast",
    "slow",
    "big",
    "small",
    "hot",
    "cold",
    "day",
    "night",
    "good",
    "bad",
    "new",
    "old",
    "high",
    "low",
    "long",
    "short",
  ],
  medium: [
    "keyboard",
    "computer",
    "program",
    "challenge",
    "adventure",
    "beautiful",
    "fantastic",
    "wonderful",
    "excellent",
    "brilliant",
    "creative",
    "amazing",
    "powerful",
    "exciting",
    "discover",
    "explore",
    "imagine",
    "consider",
    "remember",
    "understand",
    "important",
    "different",
    "possible",
    "necessary",
    "interesting",
    "development",
    "experience",
    "technology",
    "information",
    "communication",
    "environment",
    "opportunity",
    "performance",
  ],
  hard: [
    "extraordinary",
    "sophisticated",
    "revolutionary",
    "unprecedented",
    "comprehensive",
    "simultaneously",
    "approximately",
    "characteristics",
    "responsibilities",
    "acknowledgement",
    "mathematician",
    "philosophical",
    "entrepreneurship",
    "accomplishment",
    "infrastructure",
    "authentication",
    "configuration",
    "implementation",
    "transformation",
    "visualization",
    "cryptocurrency",
    "sustainability",
    "recommendation",
    "differentiation",
    "collaboration",
  ],
}

const difficultySettings: Record<Difficulty, { time: number; label: string; description: string; color: string }> = {
  easy: { time: 60, label: "Easy", description: "Simple 3-5 letter words", color: "bg-green-500" },
  medium: { time: 45, label: "Medium", description: "Common longer words", color: "bg-yellow-500" },
  hard: { time: 30, label: "Hard", description: "Complex vocabulary", color: "bg-red-500" },
}

export default function TypingSpeedGame({ onBack, themeColor }: TypingSpeedGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle")
  const [submitKey, setSubmitKey] = useState<SubmitKey>("space")
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [typedWord, setTypedWord] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [correctWords, setCorrectWords] = useState(0)
  const [wrongWords, setWrongWords] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [bestWPM, setBestWPM] = useState<Record<Difficulty, number>>({ easy: 0, medium: 0, hard: 0 })

  const inputRef = useRef<HTMLInputElement>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("typing-speed-best")
    if (stored) {
      setBestWPM(JSON.parse(stored))
    }
    const storedKey = localStorage.getItem("typing-speed-submit-key")
    if (storedKey) {
      setSubmitKey(storedKey as SubmitKey)
    }
  }, [])

  const generateWords = useCallback((diff: Difficulty) => {
    const list = wordLists[diff]
    const shuffled = [...list].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 50)
  }, [])

  const startGame = useCallback(
    (diff: Difficulty) => {
      setDifficulty(diff)
      setWords(generateWords(diff))
      setCurrentWordIndex(0)
      setTypedWord("")
      setTimeLeft(difficultySettings[diff].time)
      setCorrectWords(0)
      setWrongWords(0)
      setTotalChars(0)
      setCorrectChars(0)
      setGameState("playing")
      startTimeRef.current = Date.now()
      setTimeout(() => inputRef.current?.focus(), 100)
    },
    [generateWords],
  )

  useEffect(() => {
    if (gameState !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  useEffect(() => {
    if (gameState === "finished" && difficulty) {
      const timeTaken = difficultySettings[difficulty].time
      const wpm = Math.round((correctWords / timeTaken) * 60)

      if (wpm > bestWPM[difficulty]) {
        const newBest = { ...bestWPM, [difficulty]: wpm }
        setBestWPM(newBest)
        localStorage.setItem("typing-speed-best", JSON.stringify(newBest))
      }
    }
  }, [gameState, correctWords, difficulty, bestWPM])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTypedWord(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((submitKey === "space" && e.key === " ") || (submitKey === "enter" && e.key === "Enter")) {
      e.preventDefault()

      const typed = typedWord.trim()
      if (!typed) return

      const currentWord = words[currentWordIndex]

      setTotalChars((prev) => prev + typed.length)

      if (typed === currentWord) {
        setCorrectWords((prev) => prev + 1)
        setCorrectChars((prev) => prev + typed.length)
      } else {
        setWrongWords((prev) => prev + 1)
      }

      setTypedWord("")
      setCurrentWordIndex((prev) => prev + 1)

      if (currentWordIndex >= words.length - 1) {
        setWords((prev) => [...prev, ...generateWords(difficulty!)])
      }
    }
  }

  const getCharColor = (charIndex: number) => {
    const currentWord = words[currentWordIndex]
    if (charIndex >= typedWord.length) return "text-gray-400"
    if (typedWord[charIndex] === currentWord[charIndex]) return "text-green-500"
    return "text-red-500"
  }

  const calculateWPM = () => {
    if (!difficulty) return 0
    const timeTaken = difficultySettings[difficulty].time - timeLeft
    if (timeTaken === 0) return 0
    return Math.round((correctWords / timeTaken) * 60)
  }

  const calculateAccuracy = () => {
    if (totalChars === 0) return 100
    return Math.round((correctChars / totalChars) * 100)
  }

  const resetGame = () => {
    setGameState("idle")
    setDifficulty(null)
    setTypedWord("")
    setCurrentWordIndex(0)
  }

  if (!difficulty) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: themeColor }}
      >
        <Card className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: themeColor }}
            >
              <Keyboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Typing Speed</h1>
            <p className="text-gray-500">Test how fast you can type</p>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Submit Key:</label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSubmitKey("space")
                  localStorage.setItem("typing-speed-submit-key", "space")
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                  submitKey === "space"
                    ? "text-white"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
                style={submitKey === "space" ? { backgroundColor: themeColor } : {}}
              >
                Space Bar
              </button>
              <button
                onClick={() => {
                  setSubmitKey("enter")
                  localStorage.setItem("typing-speed-submit-key", "enter")
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                  submitKey === "enter"
                    ? "text-white"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
                style={submitKey === "enter" ? { backgroundColor: themeColor } : {}}
              >
                Enter Key
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => startGame(diff)}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all text-left group hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${difficultySettings[diff].color}`} />
                    <div>
                      <div className="font-semibold text-gray-900">{difficultySettings[diff].label}</div>
                      <div className="text-sm text-gray-500">{difficultySettings[diff].description}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-600">
                    {difficultySettings[diff].time}s
                  </div>
                </div>
                {bestWPM[diff] > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                    <Trophy className="w-3 h-3" />
                    Best: {bestWPM[diff]} WPM
                  </div>
                )}
              </button>
            ))}
          </div>

          <Button onClick={onBack} variant="ghost" className="w-full mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </Card>
      </div>
    )
  }

  if (gameState === "finished") {
    const finalWPM = Math.round((correctWords / difficultySettings[difficulty].time) * 60)
    const isNewBest = finalWPM >= bestWPM[difficulty]

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: themeColor }}
      >
        <Card className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl text-center">
          {isNewBest && finalWPM > 0 && (
            <div className="mb-4 inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
              <Trophy className="w-4 h-4" />
              New Personal Best!
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Time's Up!</h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold" style={{ color: themeColor }}>
                {finalWPM}
              </div>
              <div className="text-sm text-gray-500">Words/Min</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-gray-900">{calculateAccuracy()}%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-500">{correctWords}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-500">{wrongWords}</div>
              <div className="text-sm text-gray-500">Wrong</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => startGame(difficulty)}
              className="flex-1 text-white"
              style={{ backgroundColor: themeColor }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={resetGame} variant="outline" className="flex-1 bg-transparent">
              Change Mode
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: themeColor }}>
      <Card className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-900"}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: themeColor }} />
              <span className="text-2xl font-bold" style={{ color: themeColor }}>
                {calculateWPM()} WPM
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{calculateAccuracy()}%</span>
            </div>
            <div className="text-green-500 font-medium">{correctWords} correct</div>
            <div className="text-red-500 font-medium">{wrongWords} wrong</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 min-h-[120px]">
          <div className="flex flex-wrap gap-3 text-xl leading-relaxed">
            {words.slice(currentWordIndex, currentWordIndex + 10).map((word, idx) => (
              <span
                key={`${currentWordIndex + idx}-${word}`}
                className={`px-2 py-1 rounded transition-all ${
                  idx === 0 ? "bg-white shadow-md font-medium" : "text-gray-400"
                }`}
              >
                {idx === 0
                  ? word.split("").map((char, charIdx) => (
                      <span key={charIdx} className={getCharColor(charIdx)}>
                        {char}
                      </span>
                    ))
                  : word}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={typedWord}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full text-xl p-4 rounded-xl border-2 border-gray-200 focus:outline-none transition-colors"
            style={{ borderColor: typedWord ? themeColor : undefined }}
            placeholder="Start typing..."
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            Press {submitKey === "space" ? "space" : "enter"} after each word
          </div>
        </div>

        <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 rounded-full"
            style={{
              width: `${(timeLeft / difficultySettings[difficulty].time) * 100}%`,
              backgroundColor: themeColor,
            }}
          />
        </div>
      </Card>
    </div>
  )
}
