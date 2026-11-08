import { test, describe, afterEach } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import Clarity from "@microsoft/clarity"

describe("Microsoft Clarity NPM Package & Configuration Verification", () => {
  const componentPath = path.join(process.cwd(), "components/analytics/clarity-analytics.tsx")
  const layoutPath = path.join(process.cwd(), "app/layout.tsx")
  const envLocalPath = path.join(process.cwd(), ".env.local")
  const envProdPath = path.join(process.cwd(), ".env.production")

  const originalWindow = (globalThis as any).window
  const originalDocument = (globalThis as any).document

  afterEach(() => {
    if (originalWindow !== undefined) {
      ;(globalThis as any).window = originalWindow
    } else {
      delete (globalThis as any).window
    }
    if (originalDocument !== undefined) {
      ;(globalThis as any).document = originalDocument
    } else {
      delete (globalThis as any).document
    }
  })

  test("clarity-analytics component imports @microsoft/clarity and initializes with default project ID", async () => {
    assert.ok(fs.existsSync(componentPath), "clarity-analytics.tsx must exist")
    let content = '';
  for await (const chunk of fs.createReadStream(componentPath, { encoding: 'utf-8' })) {
    content += chunk;
  }

    assert.ok(
      content.includes('import Clarity from "@microsoft/clarity"'),
      "Component must import Clarity from @microsoft/clarity"
    )
    assert.ok(
      content.includes('"yvia03evn3"'),
      "Component must contain default project ID yvia03evn3"
    )
    assert.ok(
      content.includes("Clarity.init(clarityId)"),
      "Component must call Clarity.init(clarityId)"
    )
    assert.ok(
      content.includes("attachFrictionDetector()"),
      "Component must mount friction detector on load"
    )
  })

  test("Clarity.init from @microsoft/clarity injects the official script tag into DOM", async () => {
    const injectedScripts: any[] = []

    ;(globalThis as any).window = {}
    ;(globalThis as any).document = {
      getElementById: () => null,
      createElement: (tag: string) => ({ tag }),
      getElementsByTagName: () => [
        {
          parentNode: {
            insertBefore: (el: any) => {
              injectedScripts.push(el)
            },
          },
        },
      ],
    }

    Clarity.init("yvia03evn3")

    assert.equal(injectedScripts.length, 1, "Clarity.init should inject one script element")
    assert.equal(injectedScripts[0].tag, "script")
    assert.equal(injectedScripts[0].id, "clarity-script")
    assert.equal(injectedScripts[0].async, 1)
    assert.ok(
      injectedScripts[0].src.includes("https://www.clarity.ms/tag/yvia03evn3"),
      "Script source must target official clarity URL with project ID yvia03evn3"
    )
    assert.ok(
      injectedScripts[0].src.includes("ref=npm"),
      "Script source should reference npm attribution"
    )
  })

  test("root layout mounts MicrosoftClarity component with project ID yvia03evn3", async () => {
    assert.ok(fs.existsSync(layoutPath), "layout.tsx must exist")
    let content = '';
  for await (const chunk of fs.createReadStream(layoutPath, { encoding: 'utf-8' })) {
    content += chunk;
  }

    assert.ok(
      content.includes('import { MicrosoftClarity } from "@/components/analytics/clarity-analytics"'),
      "layout.tsx must import MicrosoftClarity"
    )
    assert.ok(
      content.includes('<MicrosoftClarity projectId="yvia03evn3" />'),
      "layout.tsx must render MicrosoftClarity with projectId yvia03evn3"
    )
  })

  test("environment files document NEXT_PUBLIC_CLARITY_PROJECT_ID", async () => {
    if (fs.existsSync(envLocalPath)) {
      let localContent = '';
  for await (const chunk of fs.createReadStream(envLocalPath, { encoding: 'utf-8' })) {
    localContent += chunk;
  }
      assert.ok(
        localContent.includes("NEXT_PUBLIC_CLARITY_PROJECT_ID=yvia03evn3"),
        ".env.local should define NEXT_PUBLIC_CLARITY_PROJECT_ID"
      )
    }

    if (fs.existsSync(envProdPath)) {
      let prodContent = '';
  for await (const chunk of fs.createReadStream(envProdPath, { encoding: 'utf-8' })) {
    prodContent += chunk;
  }
      assert.ok(
        prodContent.includes("NEXT_PUBLIC_CLARITY_PROJECT_ID="),
        ".env.production should declare NEXT_PUBLIC_CLARITY_PROJECT_ID"
      )
    }
  })
})
