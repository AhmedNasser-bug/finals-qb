import { test } from "node:test"
import assert from "node:assert/strict"
import { evaluateStreakAndShield } from "./streak-shield-logic.ts"

test("evaluateStreakAndShield: correct answer increases streak", () => {
  const result = evaluateStreakAndShield(true, 0, false)
  assert.equal(result.streak, 1)
  assert.equal(result.streakShieldActive, false)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})

test("evaluateStreakAndShield: reaching 5 streak activates shield", () => {
  const result = evaluateStreakAndShield(true, 4, false)
  assert.equal(result.streak, 5)
  assert.equal(result.streakShieldActive, true)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})

test("evaluateStreakAndShield: shield stays active when answering correctly over 5 streak", () => {
  const result = evaluateStreakAndShield(true, 5, true)
  assert.equal(result.streak, 6)
  assert.equal(result.streakShieldActive, true)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})

test("evaluateStreakAndShield: incorrect answer without shield resets streak", () => {
  const result = evaluateStreakAndShield(false, 3, false)
  assert.equal(result.streak, 0)
  assert.equal(result.streakShieldActive, false)
  assert.equal(result.streakShieldTriggeredThisQuestion, false)
})

test("evaluateStreakAndShield: incorrect answer with shield preserves streak and breaks shield", () => {
  const result = evaluateStreakAndShield(false, 5, true)
  assert.equal(result.streak, 5)
  assert.equal(result.streakShieldActive, false)
  assert.equal(result.streakShieldTriggeredThisQuestion, true)
})
