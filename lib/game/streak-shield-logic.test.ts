import { test } from "node:test"
import assert from "node:assert/strict"
import { evaluateStreakAndShield } from "./streak-shield-logic.ts"

test("evaluateStreakAndShield: correct answer increments streak", () => {
  const result = evaluateStreakAndShield(true, 2, false)
  assert.equal(result.streak, 3)
  assert.equal(result.streakShieldActive, false)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})

test("evaluateStreakAndShield: activates shield at 5 streak", () => {
  const result = evaluateStreakAndShield(true, 4, false)
  assert.equal(result.streak, 5)
  assert.equal(result.streakShieldActive, true)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})

test("evaluateStreakAndShield: does not reactivate shield if already active at 5+ streak", () => {
  const result = evaluateStreakAndShield(true, 5, true)
  assert.equal(result.streak, 6)
  assert.equal(result.streakShieldActive, true)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})

test("evaluateStreakAndShield: incorrect answer uses shield and protects streak", () => {
  const result = evaluateStreakAndShield(false, 5, true)
  assert.equal(result.streak, 5) // Streak protected
  assert.equal(result.streakShieldActive, false) // Shield consumed
  assert.equal(result.streakShieldTriggeredThisQuestion, true)
})

test("evaluateStreakAndShield: incorrect answer without shield resets streak to 0", () => {
  const result = evaluateStreakAndShield(false, 3, false)
  assert.equal(result.streak, 0)
  assert.equal(result.streakShieldActive, false)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})

test("evaluateStreakAndShield: incorrect answer after shield is used resets streak", () => {
  // First, get incorrect with shield (tested above, streak=5, shieldActive=false)
  // Now, next question is incorrect again
  const result = evaluateStreakAndShield(false, 5, false)
  assert.equal(result.streak, 0)
  assert.equal(result.streakShieldActive, false)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})
