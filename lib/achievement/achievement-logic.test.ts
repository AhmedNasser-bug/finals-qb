import test from "node:test";
import assert from "node:assert";
import { evaluateCondition } from "./achievement-logic.ts";
import type { GameState, RunRecord, AchievementCondition } from "../types/mold-types.ts";

function createMockState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: "complete",
    mode: "practice",
    questions: [],
    currentIndex: 0,
    selectedOption: null,
    isRevealed: true,
    score: 0,
    streak: 0,
    bestStreak: 0,
    wrongAnswers: 0,
    answers: [],
    livesRemaining: 0,
    startTime: 0,
    elapsedSeconds: 0,
    perQuestionTimeLimit: 0,
    globalTimeLimit: 0,
    globalTimeRemaining: 0,
    hintsUsedTotal: 0,
    config: {} as any,
    ...overrides,
  };
}

function createMockRun(overrides: Partial<RunRecord> = {}): RunRecord {
  return {
    id: "run-1",
    subjectId: "subject-1",
    mode: "practice",
    score: 0,
    wrongAnswers: 0,
    totalQuestions: 10,
    timestamp: 0,
    elapsedSeconds: 0,
    bestStreak: 0,
    hintsUsed: 0,
    accuracy: 0,
    ...overrides,
  };
}

test("evaluateCondition: accuracy_gte", () => {
  const condition: AchievementCondition = { type: "accuracy_gte", value: 80 };

  // 8/10 correct = 80% accuracy (>= 80% is true)
  assert.strictEqual(
    evaluateCondition(condition, createMockState({ score: 8, wrongAnswers: 2 }), []),
    true
  );

  // 7/10 correct = 70% accuracy (>= 80% is false)
  assert.strictEqual(
    evaluateCondition(condition, createMockState({ score: 7, wrongAnswers: 3 }), []),
    false
  );

  // Edge case: missing value falls back to 0
  const conditionNoValue: AchievementCondition = { type: "accuracy_gte" } as any;
  assert.strictEqual(
    evaluateCondition(conditionNoValue, createMockState({ score: 0, wrongAnswers: 10 }), []),
    true
  );
});

test("evaluateCondition: streak_gte", () => {
  const condition: AchievementCondition = { type: "streak_gte", value: 10 };

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ bestStreak: 10 }), []),
    true
  );

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ bestStreak: 9 }), []),
    false
  );

  // Edge case: missing value falls back to 0
  const conditionNoValue: AchievementCondition = { type: "streak_gte" } as any;
  assert.strictEqual(
    evaluateCondition(conditionNoValue, createMockState({ bestStreak: 0 }), []),
    true
  );
});

test("evaluateCondition: mode_complete", () => {
  const condition: AchievementCondition = { type: "mode_complete", mode: "survival" };

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "survival" }), []),
    true
  );

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "practice" }), []),
    false
  );
});

test("evaluateCondition: speedrun_under", () => {
  const condition: AchievementCondition = { type: "speedrun_under", mode: "speedrun", seconds: 120 };

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "speedrun", elapsedSeconds: 119 }), []),
    true
  );

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "speedrun", elapsedSeconds: 120 }), []),
    true
  );

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "speedrun", elapsedSeconds: 121 }), []),
    false
  );

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "practice", elapsedSeconds: 100 }), []),
    false
  );

  // Edge case: missing seconds falls back to Infinity
  const conditionNoSeconds: AchievementCondition = { type: "speedrun_under", mode: "speedrun" } as any;
  assert.strictEqual(
    evaluateCondition(conditionNoSeconds, createMockState({ mode: "speedrun", elapsedSeconds: 999999 }), []),
    true
  );
});

test("evaluateCondition: no_hints", () => {
  const condition: AchievementCondition = { type: "no_hints", mode: "hardcore" };

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "hardcore", hintsUsedTotal: 0 }), []),
    true
  );

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "hardcore", hintsUsedTotal: 1 }), []),
    false
  );

  assert.strictEqual(
    evaluateCondition(condition, createMockState({ mode: "practice", hintsUsedTotal: 0 }), []),
    false
  );
});

test("evaluateCondition: runs_gte", () => {
  const condition: AchievementCondition = { type: "runs_gte", value: 3 };
  const runs = [createMockRun(), createMockRun(), createMockRun()];

  assert.strictEqual(
    evaluateCondition(condition, createMockState(), runs),
    true
  );

  assert.strictEqual(
    evaluateCondition(condition, createMockState(), runs.slice(0, 2)),
    false
  );

  // Edge case: missing value falls back to 0
  const conditionNoValue: AchievementCondition = { type: "runs_gte" } as any;
  assert.strictEqual(
    evaluateCondition(conditionNoValue, createMockState(), []),
    true
  );
});

test("evaluateCondition: all_categories", () => {
  const condition: AchievementCondition = { type: "all_categories" };

  const notEnoughPracticeRuns = [
    createMockRun({ mode: "practice" }),
    createMockRun({ mode: "practice" }),
    createMockRun({ mode: "survival" }),
  ];

  assert.strictEqual(
    evaluateCondition(condition, createMockState(), notEnoughPracticeRuns),
    false
  );

  const enoughPracticeRuns = [
    createMockRun({ mode: "practice" }),
    createMockRun({ mode: "practice" }),
    createMockRun({ mode: "practice" }),
    createMockRun({ mode: "survival" }),
  ];

  assert.strictEqual(
    evaluateCondition(condition, createMockState(), enoughPracticeRuns),
    true
  );
});

test("evaluateCondition: all_unlocked", () => {
  const condition: AchievementCondition = { type: "all_unlocked" };

  assert.strictEqual(
    evaluateCondition(condition, createMockState(), []),
    false // always returns false
  );
});

test("evaluateCondition: unknown type", () => {
  const condition = { type: "unknown_type_for_test" } as unknown as AchievementCondition;

  assert.strictEqual(
    evaluateCondition(condition, createMockState(), []),
    false // always returns false
  );
});
