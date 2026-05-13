import test from "node:test";
import assert from "node:assert";
import { formatLabel } from "./mold-types.ts";

test("formatLabel converts kebab-case to Title Case", () => {
  assert.strictEqual(formatLabel("finite-automata"), "Finite Automata");
  assert.strictEqual(formatLabel("hello"), "Hello");
  assert.strictEqual(formatLabel(""), "");
  assert.strictEqual(formatLabel("a-b-c"), "A B C");
  assert.strictEqual(formatLabel("a"), "A");
});
