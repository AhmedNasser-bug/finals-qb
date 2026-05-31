import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { detectShareHash, SHARE_HASH_PREFIX } from "./subject-sharing.ts";

describe("detectShareHash", () => {
  let originalWindow: any;

  beforeEach(() => {
    // Save original window if it exists
    originalWindow = (globalThis as any).window;
  });

  afterEach(() => {
    // Restore original window
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }
  });

  test("returns null when window is undefined (server-side)", () => {
    delete (globalThis as any).window;
    assert.strictEqual(detectShareHash(), null);
  });

  test("returns null when window.location.hash is empty", () => {
    (globalThis as any).window = { location: { hash: "" } };
    assert.strictEqual(detectShareHash(), null);
  });

  test("returns null when hash does not start with SHARE_HASH_PREFIX", () => {
    (globalThis as any).window = { location: { hash: "#somethingelse" } };
    assert.strictEqual(detectShareHash(), null);
  });

  test("returns null when hash is only the prefix without payload", () => {
    (globalThis as any).window = { location: { hash: SHARE_HASH_PREFIX } };
    assert.strictEqual(detectShareHash(), null);
  });

  test("returns the payload when hash starts with prefix and has content", () => {
    const payload = "eyJmb28iOiJiYXIifQ=="; // Mock base64-like payload
    (globalThis as any).window = { location: { hash: `${SHARE_HASH_PREFIX}${payload}` } };
    assert.strictEqual(detectShareHash(), payload);
  });
});
