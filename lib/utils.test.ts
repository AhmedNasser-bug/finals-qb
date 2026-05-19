import test from "node:test";
import assert from "node:assert";
import { cn } from "./utils.ts";

test("cn utility function", async (t) => {
  await t.test("merges basic classes", () => {
    assert.strictEqual(cn("px-2", "py-1"), "px-2 py-1");
  });

  await t.test("merges conflicting tailwind classes", () => {
    assert.strictEqual(cn("px-2 py-1", "px-4"), "py-1 px-4");
    assert.strictEqual(cn("bg-red-500", "bg-blue-500"), "bg-blue-500");
    assert.strictEqual(cn("text-sm", "text-lg"), "text-lg");
  });

  await t.test("handles falsy values", () => {
    assert.strictEqual(cn("px-2", null, undefined, false, "", "py-1"), "px-2 py-1");
  });

  await t.test("handles arrays", () => {
    assert.strictEqual(cn(["px-2", "py-1"], "bg-red-500"), "px-2 py-1 bg-red-500");
  });

  await t.test("handles objects", () => {
    assert.strictEqual(cn({ "px-2": true, "py-1": false }), "px-2");
  });

  await t.test("handles complex combinations", () => {
    assert.strictEqual(
      cn("text-sm", ["font-bold", { "text-red-500": true, "text-blue-500": false }], null, "text-lg"),
      "font-bold text-red-500 text-lg"
    );
  });
});
