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
