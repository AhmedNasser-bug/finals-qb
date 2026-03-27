"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Props = {
  onBack: () => void
  themeColor?: string
}

type Question = {
  a: number
  b: number
  op: "+" | "-" | "×"
  answer: number
  options: number[]
}

function useBestScore(key: string) {
  const [best, setBest] = useState<number>(0)
  useEffect(() => {
    const v = Number(localStorage.getItem(key) || 0)
    if (!Number.isNaN(v)) setBest(v)
  }, [key])
  const update = useCallback(
    (score: number) => {
      setBest((prev) => {
        const next = Math.max(prev, score)
        localStorage.setItem(key, String(next))
        return next
      })
    },
    [key],
  )
  return { best, update }
}

export default function QuickMathGame({ onBack, themeColor = "#111827" }: Props) {
  const DURATION = 60 // seconds
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [running, setRunning] = useState(true)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [question, setQuestion] = useState<Question | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const tickRef = useRef<number | null>(null)
  const { best, update } = useBestScore("quick_math_best")

  const accuracy = useMemo(() => (total ? Math.round((correct / total) * 100) : 0), [correct, total])

  const makeQuestion = useCallback((): Question => {
    const ops: Array<Question["op"]> = ["+", "-", "×"]
    const op = ops[Math.floor(Math.random() * ops.length)]
    let a = 0
    let b = 0
    switch (op) {
      case "+":
        a = Math.floor(Math.random() * 40) + 1
        b = Math.floor(Math.random() * 40) + 1
        break
      case "-":
        a = Math.floor(Math.random() * 40) + 10
        b = Math.floor(Math.random() * a) // ensure non-negative
        break
      case "×":
        a = Math.floor(Math.random() * 10) + 1
        b = Math.floor(Math.random() * 10) + 1
        break
    }
    const answer = op === "+" ? a + b : op === "-" ? a - b : a * b

    // Build options: 1 correct + 3 distractors near the answer
    const deltas = new Set<number>()
    while (deltas.size < 6) deltas.add(Math.floor(Math.random() * 9) - 4) // -4..+4
    const all = Array.from(deltas)
      .map((d) => answer + d)
      .filter((n) => n !== answer && n >= 0)
    const distractors = all.slice(0, 3)
    const options = [...distractors, answer].sort(() => Math.random() - 0.5)
    return { a, b, op, answer, options }
  }, [])

  const nextQuestion = useCallback(() => {
    setSelected(null)
    setQuestion(makeQuestion())
  }, [makeQuestion])

  useEffect(() => {
    nextQuestion()
  }, [nextQuestion])

  // Timer
  useEffect(() => {
    if (!running) return
    tickRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(tickRef.current!)
          tickRef.current = null
          setRunning(false)
          update(score)
          return 0
        }
        return t - 1
      })
    }, 1000) as unknown as number
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [running, score, update])

  const handlePick = (value: number) => {
    if (!question || !running) return
    setSelected(value)
    setTotal((t) => t + 1)
    if (value === question.answer) {
      setCorrect((c) => c + 1)
      setScore((s) => s + 10)
    }
    // move to next after a brief pause
    setTimeout(nextQuestion, 350)
  }

  const reset = () => {
    setTimeLeft(DURATION)
    setScore(0)
    setTotal(0)
    setCorrect(0)
    setRunning(true)
    nextQuestion()
  }

  const accentStyle = { "--accent": themeColor } as React.CSSProperties
  const percent = Math.max(0, Math.min(100, (timeLeft / DURATION) * 100))

  return (
    <div
      className="w-full h-full min-h-screen bg-white flex flex-col items-center justify-start pt-20 px-4"
      style={accentStyle}
    >
      <div className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline" className="bg-white">
            Back
          </Button>
          <div className="text-sm text-gray-600">
            Best: <span className="font-semibold text-black">{best}</span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${percent}%`, backgroundColor: "var(--accent)" }}
            aria-label={`Time left ${timeLeft}s`}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <Card className="p-3">
            <div className="text-xs text-gray-500">Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </Card>
          <Card className="p-3">
            <div className="text-xs text-gray-500">Accuracy</div>
            <div className="text-2xl font-bold">{accuracy}%</div>
          </Card>
          <Card className="p-3">
            <div className="text-xs text-gray-500">Time</div>
            <div className="text-2xl font-bold">{timeLeft}s</div>
          </Card>
        </div>

        {/* Question */}
        <Card className="p-6 text-center">
          <div className="text-sm text-gray-500 mb-2">Solve</div>
          <div className="text-4xl font-bold tracking-tight text-black">
            {question ? (
              <>
                {question.a} {question.op} {question.b} = ?
              </>
            ) : (
              "..."
            )}
          </div>
        </Card>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {question?.options.map((opt) => {
            const isRight = selected !== null && opt === question.answer
            const isWrongPick = selected === opt && opt !== question.answer
            return (
              <button
                key={opt}
                className={`rounded-xl border p-4 text-xl font-semibold transition-all
                  ${isRight ? "bg-green-500 text-white border-green-500" : ""}
                  ${isWrongPick ? "bg-red-500 text-white border-red-500" : ""}
                  ${selected === null ? "bg-white hover:bg-gray-50 border-gray-200 text-black" : ""}
                `}
                onClick={() => handlePick(opt)}
                disabled={!running || selected !== null}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* Game Over */}
        {!running && (
          <div className="mt-6 rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold mb-1">Time's up!</div>
            <div className="text-gray-600 mb-4">
              Score {score} • Accuracy {accuracy}% • Questions {total}
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={reset} className="text-white" style={{ backgroundColor: "var(--accent)" }}>
                Play Again
              </Button>
              <Button onClick={onBack} variant="outline">
                Back to Menu
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
