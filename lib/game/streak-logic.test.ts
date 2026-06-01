import { test } from "node:test"
import assert from "node:assert/strict"
import { calculateDayStreak } from "./streak-utils.ts"

test("calculateDayStreak: empty run history returns 0", () => {
  assert.equal(calculateDayStreak([]), 0)
})

test("calculateDayStreak: single run today returns 1", () => {
  const todayStr = new Date().toISOString()
  const runs = [{ date: todayStr }]
  assert.equal(calculateDayStreak(runs), 1)
})

test("calculateDayStreak: single run yesterday (today pending) returns 1", () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString()
  
  const runs = [{ date: yesterdayStr }]
  assert.equal(calculateDayStreak(runs), 1)
})

test("calculateDayStreak: run today and run yesterday returns 2", () => {
  const todayStr = new Date().toISOString()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString()

  const runs = [
    { date: yesterdayStr },
    { date: todayStr }
  ]
  assert.equal(calculateDayStreak(runs), 2)
})

test("calculateDayStreak: multiple runs on the same day count as 1 day in streak", () => {
  const today = new Date()
  const todayStr1 = today.toISOString()
  
  today.setHours(today.getHours() - 2)
  const todayStr2 = today.toISOString()

  const runs = [
    { date: todayStr1 },
    { date: todayStr2 }
  ]
  assert.equal(calculateDayStreak(runs), 1)
})

test("calculateDayStreak: consecutive runs with gaps larger than 1 day break the streak", () => {
  const todayStr = new Date().toISOString()
  
  // 3 days ago (gap of 2 days between today and 3 days ago)
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  const threeDaysAgoStr = threeDaysAgo.toISOString()

  const runs = [
    { date: threeDaysAgoStr },
    { date: todayStr }
  ]
  // The streak from 3 days ago is broken, so only today's run counts (streak = 1)
  assert.equal(calculateDayStreak(runs), 1)
})

test("calculateDayStreak: three consecutive days return 3", () => {
  const todayStr = new Date().toISOString()
  
  const d1 = new Date()
  d1.setDate(d1.getDate() - 1)
  const yesterdayStr = d1.toISOString()

  const d2 = new Date()
  d2.setDate(d2.getDate() - 2)
  const twoDaysAgoStr = d2.toISOString()

  const runs = [
    { date: twoDaysAgoStr },
    { date: yesterdayStr },
    { date: todayStr }
  ]
  assert.equal(calculateDayStreak(runs), 3)
})

test("calculateDayStreak: last run 2 days ago returns 0 (streak completely broken)", () => {
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  const twoDaysAgoStr = twoDaysAgo.toISOString()

  const runs = [{ date: twoDaysAgoStr }]
  assert.equal(calculateDayStreak(runs), 0)
})
