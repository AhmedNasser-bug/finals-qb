import test from "node:test";
import assert from "node:assert";
import { cn } from "./utils.ts";

test("cn utility", async (t) => {
  await t.test("merges string class names", () => {
    assert.strictEqual(cn("px-2 py-1", "bg-red-500"), "px-2 py-1 bg-red-500");
  });

  await t.test("conditionally applies classes", () => {
    // Need to use any or exact boolean types if TypeScript complains, but these are pretty standard clsx patterns
    assert.strictEqual(cn("px-2 py-1", true && "bg-red-500", false && "text-white"), "px-2 py-1 bg-red-500");
  });

  await t.test("merges tailwind conflicts using twMerge", () => {
    assert.strictEqual(cn("px-2 py-1 bg-red-500", "bg-blue-500"), "px-2 py-1 bg-blue-500");
    assert.strictEqual(cn("text-sm", "text-lg"), "text-lg");
  });

  await t.test("handles arrays and objects correctly", () => {
    assert.strictEqual(
      cn(["px-2", "py-1"], { "bg-red-500": true, "text-white": false }),
      "px-2 py-1 bg-red-500"
    );
  });

  await t.test("handles undefined and null", () => {
    assert.strictEqual(cn("px-2", undefined, null, "py-1"), "px-2 py-1");
  });
});
