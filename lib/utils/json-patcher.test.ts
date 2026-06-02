import { test, describe } from "node:test"
import assert from "node:assert"
import { findDeformedBlockRange, applyBlockPatch } from "./json-patcher"

describe("JSON Splicer & Brace Matching Tests", () => {
  test("findDeformedBlockRange: locates simple object boundaries", () => {
    const rawJson = '{"name": "MOLD", "data": {"key": "val"}}'
    // Error position inside the nested data object
    const errorIndex = rawJson.indexOf('"key"')
    const [start, end] = findDeformedBlockRange(rawJson, errorIndex)

    const isolatedBlock = rawJson.slice(start, end)
    assert.strictEqual(isolatedBlock, '{"key": "val"}')
  })

  test("findDeformedBlockRange: locates parent object boundaries around errors", () => {
    const rawJson = '{"questions": [{"id": "q1", "text": "A"}, {"id": "q2", "text": "B"}]}'
    const errorIndex = rawJson.indexOf('"q2"')
    const [start, end] = findDeformedBlockRange(rawJson, errorIndex)

    const isolatedBlock = rawJson.slice(start, end)
    assert.strictEqual(isolatedBlock, '{"id": "q2", "text": "B"}')
  })

  test("findDeformedBlockRange: ignores brace characters inside strings", () => {
    const rawJson = '{"text": "Ignore { braces } inside string", "id": "q1"}'
    const errorIndex = rawJson.indexOf('"q1"')
    const [start, end] = findDeformedBlockRange(rawJson, errorIndex)

    assert.strictEqual(start, 0)
    assert.strictEqual(end, rawJson.length)
  })

  test("applyBlockPatch: successfully replaces deformed block", () => {
    const rawJson = '{"questions": [{"id": "q1", "text": "A"}, {"id": "q2", "text": "B"}]}'
    const errorIndex = rawJson.indexOf('"q2"')
    const patch = '{"id": "q2", "text": "PATCHED"}'

    const result = applyBlockPatch(rawJson, patch, errorIndex)
    assert.strictEqual(
      result,
      '{"questions": [{"id": "q1", "text": "A"}, {"id": "q2", "text": "PATCHED"}]}'
    )
  })

  test("applyBlockPatch: auto-repairs smart quotes and trailing commas in patch", () => {
    const rawJson = '{"questions": [{"id": "q1"}]}'
    const errorIndex = rawJson.indexOf('"q1"')
    
    // Patch with smart quotes and trailing comma inside markdown block
    const patch = '```json\n{“id”: “patched”,}\n```'

    const result = applyBlockPatch(rawJson, patch, errorIndex)
    assert.strictEqual(
      result,
      '{"questions": [{"id": "patched"}]}'
    )
  })
})
