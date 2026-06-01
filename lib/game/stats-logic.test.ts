import { test } from "node:test"
import assert from "node:assert/strict"
import { evaluateDailyMissions, evaluateMilestones } from "./stats-utils"
import type { RunRecord } from "../types/mold-types"

// Helper to create a dummy RunRecord
function createRun(date: string, totalQuestions = 5, score = 100, streak = 5): RunRecord {
  return {
    id: `run_${Math.random()}`,
    date,
    mode: "speedrun",
    score,
    correctAnswers: Math.round((score / 100) * totalQuestions),
    totalQuestions,
    timeTaken: 30,
    streak,
    grade: "S",
  }
}

test("evaluateDailyMissions: returns all missions at 0 when there are no runs", () => {
  const missions = evaluateDailyMissions([])
  assert.equal(missions.length, 3)
  assert.equal(missions[0].completed, false)
  assert.equal(missions[0].current, 0)
  assert.equal(missions[1].completed, false)
  assert.equal(missions[1].current, 0)
  assert.equal(missions[2].completed, false)
  assert.equal(missions[2].current, 0)
})

test("evaluateDailyMissions: run completed today completes Revisionist but not Precision Strike if low score", () => {
  const today = new Date()
  const todayStr = today.toISOString()
  
  const runs = [createRun(todayStr, 10, 70)] // 70% accuracy
  const missions = evaluateDailyMissions(runs, today)

  // Revisionist completed
  assert.equal(missions[0].completed, true)
  assert.equal(missions[0].current, 1)

  // Rampage (volume) has 10/15 questions
  assert.equal(missions[1].completed, false)
  assert.equal(missions[1].current, 10)

  // Precision Strike (>= 85%) not completed
  assert.equal(missions[2].completed, false)
  assert.equal(missions[2].current, 0)
})

test("evaluateDailyMissions: completes Rampage when answering 15+ questions", () => {
  const today = new Date()
  const todayStr = today.toISOString()
  
  const runs = [createRun(todayStr, 20, 90)]
  const missions = evaluateDailyMissions(runs, today)

  assert.equal(missions[1].completed, true)
  assert.equal(missions[1].current, 15) // capped at target
})

test("evaluateDailyMissions: completes Precision Strike when score is >= 85%", () => {
  const today = new Date()
  const todayStr = today.toISOString()
  
  const runs = [createRun(todayStr, 5, 90)]
  const missions = evaluateDailyMissions(runs, today)

  assert.equal(missions[2].completed, true)
  assert.equal(missions[2].current, 1)
})

test("evaluateDailyMissions: ignores runs completed yesterday", () => {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  const runs = [createRun(yesterday.toISOString(), 10, 100)]
  const missions = evaluateDailyMissions(runs, today)

  assert.equal(missions[0].completed, false)
  assert.equal(missions[0].current, 0)
})

test("evaluateMilestones: returns all milestones incomplete with 0 runs", () => {
  const milestones = evaluateMilestones([], 0, 0)
  assert.equal(milestones.length, 4)
  assert.equal(milestones.every(m => !m.completed), true)
})

test("evaluateMilestones: completes Core Initiate at 5 runs", () => {
  const runs = Array(5).fill(null).map(() => createRun(new Date().toISOString()))
  const milestones = evaluateMilestones(runs, 0, 0)

  // Core Initiate
  assert.equal(milestones[0].completed, true)
  assert.equal(milestones[0].current, 5)

  // Advanced Scholar
  assert.equal(milestones[1].completed, false)
  assert.equal(milestones[1].current, 5)
})

test("evaluateMilestones: completes Flame Novice at 3 study streak", () => {
  const milestones = evaluateMilestones([], 3, 0)
  assert.equal(milestones[2].completed, true)
  assert.equal(milestones[2].current, 3)
})

test("evaluateMilestones: completes Overclock Ascent at 8 peak question streak", () => {
  const milestones = evaluateMilestones([], 0, 8)
  assert.equal(milestones[3].completed, true)
  assert.equal(milestones[3].current, 8)
})
