import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

describe("Top Navigation Bar Mobile Responsiveness & Utility Drawer", () => {
  const topNavPath = path.join(process.cwd(), "components/mold/home/top-nav-bar.tsx")

  test("top-nav-bar.tsx exists and is readable", () => {
    assert.ok(fs.existsSync(topNavPath), "top-nav-bar.tsx must exist")
  })

  test("top-nav-bar.tsx employs responsive horizontal padding", () => {
    const content = fs.readFileSync(topNavPath, "utf-8")
    assert.ok(
      content.includes("px-3 sm:px-6"),
      "Navbar container must use compact px-3 on mobile and sm:px-6 on tablet/desktop"
    )
  })

  test("top-nav-bar.tsx provides an accessible mobile drawer toggle", () => {
    const content = fs.readFileSync(topNavPath, "utf-8")
    assert.ok(content.includes('aria-controls="mobile-top-nav-drawer"'), "Toggle must have aria-controls pointing to drawer")
    assert.ok(content.includes("aria-expanded={mobileMenuOpen}"), "Toggle must declare aria-expanded state")
    assert.ok(content.includes("sm:hidden"), "Drawer toggle must only display on mobile (< sm)")
  })

  test("top-nav-bar.tsx renders all key utilities in the mobile drawer", () => {
    const content = fs.readFileSync(topNavPath, "utf-8")
    const drawerPath = path.join(process.cwd(), "components/mold/home/top-nav-blocks/mobile-drawer.tsx")
    const drawerContent = fs.existsSync(drawerPath) ? fs.readFileSync(drawerPath, "utf-8") : ""
    const fullContent = content + drawerContent

    assert.ok(fullContent.includes('id="mobile-top-nav-drawer"'), "Drawer element must have id matching aria-controls")
    assert.ok(fullContent.includes("AUDIO"), "Drawer must provide audio mute control")
    assert.ok(fullContent.includes("THEME"), "Drawer must provide light/dark theme control")
    assert.ok(fullContent.includes("PALETTES"), "Drawer must provide theme palette switcher")
    assert.ok(fullContent.includes("LAYOUT"), "Drawer must provide layout switcher")
    assert.ok(fullContent.includes("IMPORT JSON"), "Drawer must provide import JSON action")
    assert.ok(fullContent.includes("ANALYTICS LAB"), "Drawer must provide telemetry & analytics link")
    assert.ok(fullContent.includes("USER GUIDE & STRATEGIES"), "Drawer must provide user guide link")
    assert.ok(fullContent.includes("SUBMIT FEEDBACK"), "Drawer must provide feedback submission link")
  })

  test("top-nav-bar.tsx implements accessibility escape and click-outside listeners", () => {
    const content = fs.readFileSync(topNavPath, "utf-8")
    assert.ok(content.includes('e.key === "Escape"'), "Drawer must dismiss on Escape key press")
    assert.ok(content.includes("handleClickOutside"), "Drawer must dismiss when clicking outside")
  })
})
