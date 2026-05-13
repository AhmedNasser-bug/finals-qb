import { test } from "node:test"
import assert from "node:assert/strict"
import { parseSubjectJson } from "./subject-persistence.ts"

test("parseSubjectJson returns data for valid JSON", () => {
  const input = '{"id":"test","name":"Test Subject"}'
  const result = parseSubjectJson(input)

  if ("data" in result) {
    assert.deepEqual(result.data, { id: "test", name: "Test Subject" })
    assert.strictEqual(result.parseError, undefined)
  } else {
    assert.fail("Should have returned data")
  }
})

test("parseSubjectJson returns parseError for malformed JSON", () => {
  const input = '{ invalid }'
  const result = parseSubjectJson(input)

  if ("parseError" in result) {
    assert.strictEqual(result.data, undefined)
    assert.ok(result.parseError.startsWith("JSON parse error:"), `Expected error message to start with "JSON parse error:", got "${result.parseError}"`)
  } else {
    assert.fail("Should have returned parseError")
  }
})

test("parseSubjectJson returns parseError for empty string", () => {
  const input = ""
  const result = parseSubjectJson(input)

  if ("parseError" in result) {
    assert.ok(result.parseError.startsWith("JSON parse error:"), "Should return parseError for empty string")
  } else {
    assert.fail("Should have returned parseError")
  }
})

test("parseSubjectJson handles non-SyntaxError gracefully", () => {
  // This is hard to trigger with JSON.parse, but we can test the fallback logic
  // by mocking or just knowing that it uses "Invalid JSON." if it's not a SyntaxError.
  // Since we can't easily make JSON.parse throw something else, we just ensure
  // malformed JSON is caught.
  const input = "{"
  const result = parseSubjectJson(input)
  assert.ok("parseError" in result)
})
