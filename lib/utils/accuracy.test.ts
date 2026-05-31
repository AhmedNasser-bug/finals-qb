
import test from "node:test";
import assert from "node:assert";
import { calculateAccuracy } from "../types/mold-types.ts";

test("calculateAccuracy uses answeredCount as denominator", () => {
  // If it used total (20), accuracy would be 8/20 = 40%
  // Using answeredCount (10), accuracy is 8/10 = 80%

  assert.strictEqual(calculateAccuracy(8, 2), 80, "Should be 80% accuracy for 8 correct and 2 wrong");
  assert.strictEqual(calculateAccuracy(5, 5), 50, "Should be 50% accuracy for 5 correct and 5 wrong");
  assert.strictEqual(calculateAccuracy(0, 0), 0, "Should be 0% accuracy for 0 answers");
  assert.strictEqual(calculateAccuracy(10, 0), 100, "Should be 100% accuracy for 10 correct and 0 wrong");
});
