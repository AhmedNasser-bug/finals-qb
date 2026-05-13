import { test } from "node:test"
import assert from "node:assert/strict"
import { getStreakTier, getNextStreakThreshold, getStreakTierProgress } from "./mold-types.ts"

test("getStreakTier", () => {
  assert.equal(getStreakTier(0).name, "DORMANT")
  assert.equal(getStreakTier(1).name, "FOCUSED")
  assert.equal(getStreakTier(3).name, "LOCKED IN")
  assert.equal(getStreakTier(5).name, "PRECISION")
  assert.equal(getStreakTier(8).name, "OVERCLOCK")
  assert.equal(getStreakTier(12).name, "MASTERY")
})

test("getNextStreakThreshold", () => {
  assert.equal(getNextStreakThreshold(0), 1)
  assert.equal(getNextStreakThreshold(1), 3)
  assert.equal(getNextStreakThreshold(3), 5)
  assert.equal(getNextStreakThreshold(5), 8)
  assert.equal(getNextStreakThreshold(8), 12)
  assert.equal(getNextStreakThreshold(12), null)
})

test("getStreakTierProgress", () => {
  // Boundary (start-of-tier): FOCUSED tier starts at 1, next is LOCKED IN at 3.
  // When streak is 1, current is 0, total is 2. (progress = 0)
  assert.deepEqual(getStreakTierProgress(1), { current: 0, total: 2 })

  // Mid-tier value: between FOCUSED (1) and LOCKED IN (3).
  // When streak is 2, current is 1, total is 2. (progress = 0.5)
  assert.deepEqual(getStreakTierProgress(2), { current: 1, total: 2 })

  // Top tier threshold: MASTERY starts at 12.
  // Since it's the max tier, we expect current 1, total 1. (progress = 1)
  assert.deepEqual(getStreakTierProgress(12), { current: 1, total: 1 })
})
