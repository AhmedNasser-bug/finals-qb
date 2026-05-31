import { test } from "node:test";
import assert from "node:assert";
import { shuffle } from "./crypto-utils.ts";

test("shuffle - should contain the same elements", () => {
  const input = [1, 2, 3, 4, 5];
  const output = shuffle(input);

  assert.strictEqual(output.length, input.length);
  assert.deepStrictEqual(output.sort((a, b) => a - b), input.sort((a, b) => a - b));
});

test("shuffle - should handle empty array", () => {
  const input: number[] = [];
  const output = shuffle(input);
  assert.deepStrictEqual(output, []);
});

test("shuffle - should handle single element array", () => {
  const input = [1];
  const output = shuffle(input);
  assert.deepStrictEqual(output, [1]);
});

test("shuffle - should return a new array", () => {
  const input = [1, 2, 3];
  const output = shuffle(input);
  assert.notStrictEqual(output, input);
});

test("shuffle - should eventually change order (probabilistic)", () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let changed = false;

  // Try up to 10 times to avoid flaky failures (though very unlikely for 10 elements)
  for (let i = 0; i < 10; i++) {
    const output = shuffle(input);
    if (JSON.stringify(output) !== JSON.stringify(input)) {
      changed = true;
      break;
    }
  }

  assert.strictEqual(changed, true, "Shuffle did not change the order of elements");
});
