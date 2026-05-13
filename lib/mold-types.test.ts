import test from 'node:test';
import assert from 'node:assert';
import { computeAggregateStats, type RunRecord } from './mold-types.ts';

test('computeAggregateStats - empty runs', () => {
  const result = computeAggregateStats([]);
  assert.deepStrictEqual(result, {
    totalRuns: 0,
    bestScore: 0,
    bestStreak: 0,
    averageScore: 0,
  });
});

test('computeAggregateStats - single run', () => {
  const runs: RunRecord[] = [
    {
      id: '1',
      date: '2025-03-20T10:00:00Z',
      mode: 'speedrun',
      score: 85,
      correctAnswers: 17,
      totalQuestions: 20,
      timeTaken: 150,
      streak: 5,
      grade: 'B+',
    },
  ];
  const result = computeAggregateStats(runs);
  assert.deepStrictEqual(result, {
    totalRuns: 1,
    bestScore: 85,
    bestStreak: 5,
    averageScore: 85,
  });
});

test('computeAggregateStats - multiple runs', () => {
  const runs: RunRecord[] = [
    {
      id: '1',
      date: '2025-03-20T10:00:00Z',
      mode: 'speedrun',
      score: 80,
      correctAnswers: 16,
      totalQuestions: 20,
      timeTaken: 150,
      streak: 5,
      grade: 'B+',
    },
    {
      id: '2',
      date: '2025-03-21T10:00:00Z',
      mode: 'blitz',
      score: 95,
      correctAnswers: 19,
      totalQuestions: 20,
      timeTaken: 100,
      streak: 12,
      grade: 'S',
    },
    {
      id: '3',
      date: '2025-03-22T10:00:00Z',
      mode: 'hardcore',
      score: 70,
      correctAnswers: 14,
      totalQuestions: 20,
      timeTaken: 200,
      streak: 4,
      grade: 'C+',
    },
  ];
  const result = computeAggregateStats(runs);
  // totalRuns: 3
  // bestScore: max(80, 95, 70) = 95
  // bestStreak: max(5, 12, 4) = 12
  // averageScore: round((80 + 95 + 70) / 3) = round(245 / 3) = round(81.666) = 82
  assert.deepStrictEqual(result, {
    totalRuns: 3,
    bestScore: 95,
    bestStreak: 12,
    averageScore: 82,
  });
});

test('computeAggregateStats - average score rounding', () => {
  const runs: RunRecord[] = [
    { score: 80, streak: 0 } as RunRecord,
    { score: 81, streak: 0 } as RunRecord,
  ];
  const result = computeAggregateStats(runs);
  // averageScore: round((80 + 81) / 2) = round(80.5) = 81 (in JS Math.round(80.5) is 81)
  assert.strictEqual(result.averageScore, 81);
});
