import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

describe("Navigation Bar Feedback Submission Form Integration", () => {
  const topNavPath = path.join(process.cwd(), "components/mold/home/top-nav-bar.tsx")
  const sideNavPath = path.join(process.cwd(), "components/mold/home/side-nav-bar.tsx")
  const targetUrl = "https://docs.google.com/forms/d/1LrdMb8QiGbB01tDw6DJd-tQl_ix3ldxaSND-4vkKJJc/edit"

  test("top-nav-bar.tsx includes feedback button targeting official Google Form", () => {
    assert.ok(fs.existsSync(topNavPath), "top-nav-bar.tsx must exist")
    const content = fs.readFileSync(topNavPath, "utf-8")
    const drawerPath = path.join(process.cwd(), "components/mold/home/top-nav-blocks/mobile-drawer.tsx")
    const drawerContent = fs.existsSync(drawerPath) ? fs.readFileSync(drawerPath, "utf-8") : ""
    const fullContent = content + drawerContent

    assert.ok(fullContent.includes(targetUrl), "TopNavBar must link to the specified feedback form URL")
    assert.ok(fullContent.includes('target="_blank"'), "Feedback link must open in a new tab")
    assert.ok(fullContent.includes('rel="noopener noreferrer"'), "Feedback link must include safe security rel attributes")
    assert.ok(fullContent.includes("FEEDBACK"), "Feedback button should render visible FEEDBACK text label")
    assert.ok(fullContent.includes("aria-label="), "Feedback link must have an accessible label")
  })

  test("side-nav-bar.tsx includes feedback link targeting official Google Form", () => {
    assert.ok(fs.existsSync(sideNavPath), "side-nav-bar.tsx must exist")
    const content = fs.readFileSync(sideNavPath, "utf-8")

    assert.ok(content.includes(targetUrl), "SideNavBar must link to the specified feedback form URL")
    assert.ok(content.includes('target="_blank"'), "Feedback link must open in a new tab")
    assert.ok(content.includes('rel="noopener noreferrer"'), "Feedback link must include safe security rel attributes")
    assert.ok(content.includes("FEEDBACK FORM"), "SideNavBar should render FEEDBACK FORM text")
  })
})
