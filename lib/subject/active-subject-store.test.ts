import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { setActiveSubject, getActiveSubject, clearActiveSubject } from "./active-subject-store.ts";
import type { FullSubjectData } from "../types/mold-types.ts";

describe("active-subject-store", () => {
  let mockStorage: Record<string, string> = {};
  let originalSessionStorage: any;

  beforeEach(() => {
    mockStorage = {};
    originalSessionStorage = (globalThis as any).sessionStorage;
    (globalThis as any).sessionStorage = {
      getItem(key: string) { return mockStorage[key] || null; },
      setItem(key: string, value: string) { mockStorage[key] = value; },
      removeItem(key: string) { delete mockStorage[key]; }
    };
  });

  afterEach(() => {
    if (originalSessionStorage === undefined) {
      delete (globalThis as any).sessionStorage;
    } else {
      (globalThis as any).sessionStorage = originalSessionStorage;
    }
  });

  const dummySubject: FullSubjectData = {
    id: "test-subject",
    name: "Test Subject",
    config: {
      title: "Test",
      description: "Desc"
    },
    questions: []
  };

  test("setActiveSubject writes to sessionStorage", () => {
    setActiveSubject(dummySubject);
    assert.ok(mockStorage["mold_v2_active_subject"]);
    const saved = JSON.parse(mockStorage["mold_v2_active_subject"]);
    assert.strictEqual(saved.id, "test-subject");
  });

  test("getActiveSubject reads from sessionStorage", () => {
    mockStorage["mold_v2_active_subject"] = JSON.stringify(dummySubject);
    const retrieved = getActiveSubject();
    assert.deepEqual(retrieved, dummySubject);
  });

  test("clearActiveSubject removes from sessionStorage", () => {
    mockStorage["mold_v2_active_subject"] = JSON.stringify(dummySubject);
    clearActiveSubject();
    assert.strictEqual(mockStorage["mold_v2_active_subject"], undefined);
  });

  test("getActiveSubject returns null if nothing is stored", () => {
    const retrieved = getActiveSubject();
    assert.strictEqual(retrieved, null);
  });

  test("getActiveSubject returns null if value cannot be parsed", () => {
    mockStorage["mold_v2_active_subject"] = "{ invalid json ";
    const retrieved = getActiveSubject();
    assert.strictEqual(retrieved, null);
  });

  test("handles undefined sessionStorage gracefully", () => {
    // Save the mocked storage
    const tempStorage = (globalThis as any).sessionStorage;

    // Simulate undefined sessionStorage
    delete (globalThis as any).sessionStorage;

    // These should not throw
    setActiveSubject(dummySubject);
    const retrieved = getActiveSubject();
    assert.strictEqual(retrieved, null);
    clearActiveSubject();

    // Restore the mocked storage for clean up
    (globalThis as any).sessionStorage = tempStorage;
  });

  test("setActiveSubject handles quota exceeded gracefully", () => {
    // Replace setItem to throw an error (simulating QuotaExceededError)
    (globalThis as any).sessionStorage.setItem = () => {
      throw new Error("QuotaExceededError");
    };

    // This should not throw
    assert.doesNotThrow(() => {
      setActiveSubject(dummySubject);
    });
  });
});
