import { test, describe } from "node:test"
import assert from "node:assert"
import { renderMath } from "../utils/math-renderer"
import DOMPurify from "isomorphic-dompurify"
import { hasVisual } from "../types/mold-types"
import type { Question, GameConfig } from "../types/mold-types"
// Extensible visual layout and formatting tests without react dependencies

describe("Visual Specimen Panel & Extensible Layout Tests", () => {
  test("hasVisual encapsulates diagram, visualLatex, and visualHtml checking", () => {
    const q1: Question = {
      id: "q-1",
      type: "MCQ",
      difficulty: "Medium",
      category: "automata",
      question: "What is a DFA?",
      options: [],
      answer: "A",
      diagram: "graph TD; A-->B"
    }

    const q2: Question = {
      id: "q-2",
      type: "MCQ",
      difficulty: "Medium",
      category: "automata",
      question: "What is a DFA?",
      options: [],
      answer: "A",
      visualLatex: "\\sum_{i=1}^n i"
    }

    const q3: Question = {
      id: "q-3",
      type: "MCQ",
      difficulty: "Medium",
      category: "automata",
      question: "What is a DFA?",
      options: [],
      answer: "A",
      visualHtml: "<div>Sample Code</div>"
    }

    const q4: Question = {
      id: "q-4",
      type: "MCQ",
      difficulty: "Medium",
      category: "automata",
      question: "What is a DFA?",
      options: [],
      answer: "A"
    }

    assert.strictEqual(hasVisual(q1), true, "Should return true for diagram")
    assert.strictEqual(hasVisual(q2), true, "Should return true for visualLatex")
    assert.strictEqual(hasVisual(q3), true, "Should return true for visualHtml")
    assert.strictEqual(hasVisual(q4), false, "Should return false for plain question")
    assert.strictEqual(hasVisual(undefined), false, "Should handle undefined safely")
  })
})

describe("LaTeX and HTML Overlap Math Parsing", () => {
  test("renderMath successfully compiles inline LaTeX delimiters into KaTeX", () => {
    const text = "Evaluate $O(n \\log n)$ complexity."
    const parsed = renderMath(text)

    assert.match(parsed, /<span class="katex">/, "Should contain KaTeX base element")
    assert.match(parsed, /Evaluate /, "Should preserve plain text segments")
  })

  test("renderMath successfully compiles display display block LaTeX", () => {
    const text = "Sum formula: $$\\sum_{i=1}^n i$$"
    const parsed = renderMath(text)

    assert.match(parsed, /<span class="katex-display">/, "Should contain KaTeX block element")
  })

  test("renderMath and DOMPurify overlap coexists safely", () => {
    const rawInput = "Is <code>$x^2$</code> quadratic?"
    const cleanHtml = renderMath(DOMPurify.sanitize(rawInput))

    assert.match(cleanHtml, /<code>/, "Should preserve safe HTML tags")
    assert.match(cleanHtml, /<span class="katex">/, "Should compile LaTeX inside HTML blocks safely")
  })
})

import { evaluateStreakAndShield } from "./streak-shield-logic"

describe("Streak Shield State Transitions", () => {
  test("Streak Shield starts inactive, activates at 5-streak, and protects from one mistake", () => {
    let state = {
      streak: 0,
      streakShieldActive: false,
      streakShieldTriggeredThisQuestion: false,
    }

    // Initially, streak shield is inactive
    assert.strictEqual(state.streakShieldActive, false, "Shield should be inactive initially")
    assert.strictEqual(state.streak, 0, "Streak should start at 0")

    // Answer 1st question correctly
    state = evaluateStreakAndShield(true, state.streak, state.streakShieldActive)
    assert.strictEqual(state.streak, 1, "Streak should be 1")
    assert.strictEqual(state.streakShieldActive, false, "Shield should still be inactive at streak 1")

    // Advance and answer 2nd, 3rd, 4th, 5th correctly
    for (let i = 2; i <= 5; i++) {
      state = evaluateStreakAndShield(true, state.streak, state.streakShieldActive)
      assert.strictEqual(state.streak, i, `Streak should be ${i}`)
    }

    // Now at streak 5, shield should activate!
    assert.strictEqual(state.streakShieldActive, true, "Streak shield should activate at streak 5")

    // Answer 6th INCORRECTLY
    state = evaluateStreakAndShield(false, state.streak, state.streakShieldActive)

    // Shield should absorb the mistake: shield becomes inactive, but streak is preserved (remains 5)
    assert.strictEqual(state.streakShieldActive, false, "Streak shield should deactivate on mistake absorption")
    assert.strictEqual(state.streakShieldTriggeredThisQuestion, true, "Should flag that shield triggered")
    assert.strictEqual(state.streak, 5, "Streak should be preserved at 5 after mistake absorption")

    // Answer 7th INCORRECTLY (no shield)
    state = evaluateStreakAndShield(false, state.streak, state.streakShieldActive)

    // No shield to absorb mistake, so streak resets to 0!
    assert.strictEqual(state.streak, 0, "Streak should reset to 0 without shield protection")
    assert.strictEqual(state.streakShieldTriggeredThisQuestion, false, "Should not trigger shield flag")
  })
})
