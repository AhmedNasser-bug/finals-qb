import { test } from "node:test"
import assert from "node:assert/strict"
import {
  getStreakTier,
  getNextStreakThreshold,
  getStreakTierProgress,
  formatTime,
  computeAggregateStats,
  formatLabel,
  calculateAccuracy
} from "./mold-types.ts"

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

test('formatTime utility', async (t) => {
  await t.test('returns "—" for 0 seconds', () => {
    assert.strictEqual(formatTime(0), "—");
  });

  await t.test('formats seconds under a minute correctly', () => {
    assert.strictEqual(formatTime(45), "0:45");
  });

  await t.test('formats seconds over a minute correctly', () => {
    assert.strictEqual(formatTime(125), "2:05");
  });

  await t.test('formats exactly 60 seconds correctly', () => {
    assert.strictEqual(formatTime(60), "1:00");
  });

  await t.test('formats large values into total minutes correctly', () => {
    // 3661 seconds = 61 minutes and 1 second
    assert.strictEqual(formatTime(3661), "61:01");
  });
});

test('computeAggregateStats aggregate stats utility', async (t) => {
  await t.test('handles empty runs array correctly', () => {
    const emptyStats = computeAggregateStats([]);
    assert.strictEqual(emptyStats.totalRuns, 0);
    assert.strictEqual(emptyStats.bestScore, 0);
    assert.strictEqual(emptyStats.bestStreak, 0);
    assert.strictEqual(emptyStats.averageScore, 0);
    assert.strictEqual(emptyStats.averageResponseTimeMs, 0);
  });

  const mockRuns = [
    { id: '1', date: '2026-05-12T23:25:55Z', mode: 'blitz', score: 80, correctAnswers: 8, totalQuestions: 10, timeTaken: 50, streak: 5, grade: 'B+' },
    { id: '2', date: '2026-05-13T23:25:55Z', mode: 'speedrun', score: 90, correctAnswers: 9, totalQuestions: 10, timeTaken: 60, streak: 8, grade: 'A' },
    { id: '3', date: '2026-05-14T23:25:55Z', mode: 'survival', score: 71, correctAnswers: 7, totalQuestions: 10, timeTaken: 70, streak: 2, grade: 'C+' }
  ];

  await t.test('aggregates multiple runs statistics correctly', () => {
    const aggregated = computeAggregateStats(mockRuns as any);
    assert.strictEqual(aggregated.totalRuns, 3);
    assert.strictEqual(aggregated.bestScore, 90);
    assert.strictEqual(aggregated.bestStreak, 8);
    // Average score: (80 + 90 + 71) / 3 = 80.33 -> round is 80
    assert.strictEqual(aggregated.averageScore, 80);
    // Average response time: (50+60+70)*1000 / 30 = 6000ms
    assert.strictEqual(aggregated.averageResponseTimeMs, 6000);
  });

  await t.test('handles rounding correct average score boundary values', () => {
    const boundaryRuns = [
      { id: '1', score: 80 },
      { id: '2', score: 81 }
    ];
    // Average score: 80.5 -> round is 81
    const aggregated = computeAggregateStats(boundaryRuns as any);
    assert.strictEqual(aggregated.averageScore, 81);
  });
});

test("formatLabel converts kebab-case to Title Case", () => {
  assert.strictEqual(formatLabel("finite-automata"), "Finite Automata");
  assert.strictEqual(formatLabel("hello"), "Hello");
  assert.strictEqual(formatLabel(""), "");
  assert.strictEqual(formatLabel("a-b-c"), "A B C");
  assert.strictEqual(formatLabel("a"), "A");
});

test('calculateAccuracy utility', async (t) => {
  await t.test('handles zero division edge case (0 answered)', () => {
    assert.strictEqual(calculateAccuracy(0, 0), 0);
  });

  await t.test('calculates 100% accuracy correctly', () => {
    assert.strictEqual(calculateAccuracy(10, 0), 100);
  });

  await t.test('calculates exactly 50% accuracy correctly', () => {
    assert.strictEqual(calculateAccuracy(5, 5), 50);
  });

  await t.test('handles rounding properly (rounds up)', () => {
    // 2 / 3 = 66.666... -> 67
    assert.strictEqual(calculateAccuracy(2, 1), 67);
  });

  await t.test('handles rounding properly (rounds down)', () => {
    // 1 / 3 = 33.333... -> 33
    assert.strictEqual(calculateAccuracy(1, 2), 33);
  });
});
