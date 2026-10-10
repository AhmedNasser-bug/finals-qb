import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

describe("Microsoft Clarity Configuration & Script Verification", () => {
  const componentPath = path.join(process.cwd(), "components/analytics/clarity-analytics.tsx")
  const layoutPath = path.join(process.cwd(), "app/layout.tsx")
  const envLocalPath = path.join(process.cwd(), ".env.local")
  const envProdPath = path.join(process.cwd(), ".env.production")

  test("clarity-analytics component contains valid official script template and default project ID", () => {
    assert.ok(fs.existsSync(componentPath), "clarity-analytics.tsx must exist")
    const content = fs.readFileSync(componentPath, "utf-8")

    // Check project ID fallback
    assert.ok(
      content.includes('"yvia03evn3"'),
      "Component must contain default project ID yvia03evn3"
    )

    // Check official script bootstrap logic
    assert.ok(content.includes("https://www.clarity.ms/tag/"), "Script must reference official Clarity CDN")
    assert.ok(content.includes("(window, document, \"clarity\", \"script\""), "Script must initialize clarity queue")
    assert.ok(content.includes("strategy=\"afterInteractive\""), "Script must load with afterInteractive strategy")
    assert.ok(content.includes("attachFrictionDetector()"), "Component must mount friction detector on load")
  })

  test("root layout mounts MicrosoftClarity component with project ID yvia03evn3", () => {
    assert.ok(fs.existsSync(layoutPath), "layout.tsx must exist")
    const content = fs.readFileSync(layoutPath, "utf-8")

    assert.ok(
      content.includes('import { MicrosoftClarity } from "@/components/analytics/clarity-analytics"'),
      "layout.tsx must import MicrosoftClarity"
    )
    assert.ok(
      content.includes('<MicrosoftClarity projectId="yvia03evn3" />'),
      "layout.tsx must render MicrosoftClarity with projectId yvia03evn3"
    )
  })

  test("environment files document NEXT_PUBLIC_CLARITY_PROJECT_ID", () => {
    if (fs.existsSync(envLocalPath)) {
      const localContent = fs.readFileSync(envLocalPath, "utf-8")
      assert.ok(
        localContent.includes("NEXT_PUBLIC_CLARITY_PROJECT_ID=yvia03evn3"),
        ".env.local should define NEXT_PUBLIC_CLARITY_PROJECT_ID"
      )
    }

    if (fs.existsSync(envProdPath)) {
      const prodContent = fs.readFileSync(envProdPath, "utf-8")
      assert.ok(
        prodContent.includes("NEXT_PUBLIC_CLARITY_PROJECT_ID="),
        ".env.production should declare NEXT_PUBLIC_CLARITY_PROJECT_ID"
      )
    }
  })
})
