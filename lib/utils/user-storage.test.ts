import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { loadRuns, saveRuns, RUNS_STORAGE_KEY } from "./user-storage.ts";
import type { RunRecord } from "../types/mold-types.ts";

describe("user-storage persistence", () => {
  let mockStorage: Record<string, string> = {};
  let originalLocalStorage: any;

  beforeEach(() => {
    mockStorage = {};
    originalLocalStorage = (globalThis as any).localStorage;
    (globalThis as any).localStorage = {
      getItem(key: string) { return mockStorage[key] || null; },
      setItem(key: string, value: string) { mockStorage[key] = value; },
      removeItem(key: string) { delete mockStorage[key]; }
    };
  });

  afterEach(() => {
    if (originalLocalStorage === undefined) {
      delete (globalThis as any).localStorage;
    } else {
      (globalThis as any).localStorage = originalLocalStorage;
    }
  });

  const dummyRun: RunRecord = {
    id: "run-123",
    date: "2026-06-01T00:00:00Z",
    mode: "speedrun",
    score: 95,
    correctAnswers: 19,
    totalQuestions: 20,
    timeTaken: 120,
    streak: 3,
    grade: "S"
  };

  test("loadRuns returns empty array if nothing stored", () => {
    const runs = loadRuns(null);
    assert.deepEqual(runs, []);
  });

  test("saveRuns writes to localStorage without userId (anonymous)", () => {
    saveRuns([dummyRun], null);
    assert.ok(mockStorage[RUNS_STORAGE_KEY]);
    const saved = JSON.parse(mockStorage[RUNS_STORAGE_KEY]);
    assert.strictEqual(saved.length, 1);
    assert.strictEqual(saved[0].id, "run-123");
  });

  test("saveRuns writes to localStorage with userId (authenticated)", () => {
    const userId = "user_9876";
    saveRuns([dummyRun], userId);
    const key = `${RUNS_STORAGE_KEY}_${userId}`;
    assert.ok(mockStorage[key]);
    const saved = JSON.parse(mockStorage[key]);
    assert.strictEqual(saved[0].id, "run-123");
  });

  test("loadRuns reads from localStorage with userId", () => {
    const userId = "user_9876";
    const key = `${RUNS_STORAGE_KEY}_${userId}`;
    mockStorage[key] = JSON.stringify([dummyRun]);
    
    const runs = loadRuns(userId);
    assert.strictEqual(runs.length, 1);
    assert.strictEqual(runs[0].id, "run-123");
  });

  test("saveRuns limits stored runs to the last 50 elements", () => {
    const runsArray: RunRecord[] = [];
    for (let i = 0; i < 60; i++) {
      runsArray.push({
        ...dummyRun,
        id: `run-${i}`
      });
    }

    saveRuns(runsArray, null);
    const saved = JSON.parse(mockStorage[RUNS_STORAGE_KEY]) as RunRecord[];
    assert.strictEqual(saved.length, 50);
    // Should contain the last 50 elements (index 10 to 59)
    assert.strictEqual(saved[0].id, "run-10");
    assert.strictEqual(saved[49].id, "run-59");
  });

  test("loadRuns handles parsing error gracefully", () => {
    mockStorage[RUNS_STORAGE_KEY] = "{ invalid json ";
    const runs = loadRuns(null);
    assert.deepEqual(runs, []);
  });
});
