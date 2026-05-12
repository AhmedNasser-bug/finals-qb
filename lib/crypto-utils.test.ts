import { test } from "node:test";
import assert from "node:assert";
import { shuffle } from "./crypto-utils.ts";

test("shuffle should return a new array with the same elements", () => {
  const original = [1, 2, 3, 4, 5];
  const shuffled = shuffle(original);

  assert.notStrictEqual(original, shuffled);
  assert.strictEqual(original.length, shuffled.length);
  assert.deepStrictEqual([...original].sort(), [...shuffled].sort());
});

test("shuffle should handle empty arrays", () => {
  const original: number[] = [];
  const shuffled = shuffle(original);
  assert.deepStrictEqual(original, shuffled);
  assert.notStrictEqual(original, shuffled);
});

test("shuffle should handle single-element arrays", () => {
  const original = [1];
  const shuffled = shuffle(original);
  assert.deepStrictEqual(original, shuffled);
  assert.notStrictEqual(original, shuffled);
});

test("shuffle should eventually produce a different order for larger arrays", () => {
  const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let different = false;

  for (let i = 0; i < 10; i++) {
    const shuffled = shuffle(original);
    if (JSON.stringify(original) !== JSON.stringify(shuffled)) {
      different = true;
      break;
    }
  }

  assert.strictEqual(different, true, "Array was not shuffled in 10 attempts");
});
