import { test } from "node:test"
import assert from "node:assert"
import { TOC_ITEMS, GAME_MODES, CITATIONS, GRADES, TIPS } from "@/lib/guide/guide-constants"

test("Guide TOC items contain all 10 required sections", () => {
  assert.strictEqual(TOC_ITEMS.length, 10)
  
  const expectedIds = [
    "overview",
    "quick-start",
    "game-modes",
    "the-science",
    "scoring",
    "flashcards",
    "ai-import",
    "shortcuts",
    "tips",
    "project-links"
  ]

  expectedIds.forEach((id, index) => {
    assert.strictEqual(TOC_ITEMS[index].id, id)
    assert.ok(TOC_ITEMS[index].label.length > 0)
    assert.ok(TOC_ITEMS[index].num.length === 2)
  })
})

test("Guide Game Modes definition matches 7 protocol modes", () => {
  assert.strictEqual(GAME_MODES.length, 7)
  const modeNames = GAME_MODES.map(m => m.mode)
  
  assert.ok(modeNames.includes("SPEEDRUN"))
  assert.ok(modeNames.includes("BLITZ"))
  assert.ok(modeNames.includes("HARDCORE"))
  assert.ok(modeNames.includes("SURVIVAL"))
  assert.ok(modeNames.includes("PRACTICE"))
  assert.ok(modeNames.includes("FULL REVISION"))
  assert.ok(modeNames.includes("FLASHCARDS"))
})

test("Guide Science citations contain Ebbinghaus and SuperMemo foundations", () => {
  assert.ok(CITATIONS.length >= 5)
  const titles = CITATIONS.map(c => c.title)
  
  assert.ok(titles.some(t => t.includes("Testing Effect")))
  assert.ok(titles.some(t => t.includes("Forgetting Curve")))
  assert.ok(titles.some(t => t.includes("SuperMemo")))
})

test("Guide Grade thresholds span S+ to F with accurate percentages", () => {
  assert.strictEqual(GRADES.length, 8)
  assert.strictEqual(GRADES[0].grade, "S+")
  assert.strictEqual(GRADES[0].min, "≥ 97%")
  assert.strictEqual(GRADES[7].grade, "F")
})

test("Guide Tips contain cognitive optimization strategies", () => {
  assert.ok(TIPS.length >= 5)
  TIPS.forEach(tip => {
    assert.ok(tip.label.length > 0)
    assert.ok(tip.body.length > 0)
  })
})
