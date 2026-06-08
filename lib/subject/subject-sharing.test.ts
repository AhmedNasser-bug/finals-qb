import { describe, it, mock } from "node:test"
import assert from "node:assert"
import {
  SHARE_HASH_PREFIX,
  SHARE_SIZE_WARN_BYTES,
  encodeSubject,
  decodeSubject,
  buildShareUrl,
  detectShareHash,
  clearShareHash,
  downloadSubjectJson,
  downloadSubjectHtml
} from "./subject-sharing"
import type { FullSubjectData } from "@/lib/mold-types"

describe("subject-sharing", () => {
  const mockSubject: FullSubjectData = {
    id: "test-id",
    name: "Test Subject",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    gamesPlayed: 0,
    config: {
      title: "Title",
      description: "Desc",
    },
    questions: [
      {
        id: "q-1",
        type: "MCQ",
        difficulty: "Easy",
        category: "Cat",
        question: "Q?",
        answer: "A",
        options: [
          { id: "o1", label: "A", text: "Option A", isCorrect: true },
          { id: "o2", label: "B", text: "Option B", isCorrect: false }
        ]
      }
    ]
  }

  describe("encodeSubject and decodeSubject", () => {
    it("should successfully encode and decode a subject", async () => {
      const encodeResult = await encodeSubject(mockSubject)
      assert.ok(!("error" in encodeResult))
      assert.ok(typeof encodeResult.encoded === "string")
      assert.ok(encodeResult.bytes > 0)

      const decodeResult = await decodeSubject(encodeResult.encoded)
      assert.ok(!("error" in decodeResult))
      assert.deepStrictEqual(decodeResult.subject, mockSubject)
    })

    it("should return error for invalid base64 string during decoding", async () => {
      const decodeResult = await decodeSubject("invalid-base64")
      assert.ok("error" in decodeResult)
      assert.match(decodeResult.error, /Decoding failed:/)
    })
  })

  describe("buildShareUrl", () => {
    it("should build correct URL when window is not defined", () => {
      const url = buildShareUrl("encoded-payload")
      assert.strictEqual(url, "/subjects#share=encoded-payload")
    })

    it("should build correct URL when window is defined", () => {
      global.window = {
        location: {
          protocol: "https:",
          host: "example.com",
        }
      } as any
      const url = buildShareUrl("encoded-payload")
      assert.strictEqual(url, "https://example.com/subjects#share=encoded-payload")
      delete (global as any).window
    })
  })

  describe("detectShareHash", () => {
    it("should return null when window is not defined", () => {
      const result = detectShareHash()
      assert.strictEqual(result, null)
    })

    it("should return null if hash doesn't start with prefix", () => {
      global.window = { location: { hash: "#something" } } as any
      const result = detectShareHash()
      assert.strictEqual(result, null)
      delete (global as any).window
    })

    it("should return null if hash is exactly the prefix (no payload)", () => {
      global.window = { location: { hash: SHARE_HASH_PREFIX } } as any
      const result = detectShareHash()
      assert.strictEqual(result, null)
      delete (global as any).window
    })

    it("should return payload when hash has prefix and payload", () => {
      global.window = { location: { hash: `${SHARE_HASH_PREFIX}my-payload` } } as any
      const result = detectShareHash()
      assert.strictEqual(result, "my-payload")
      delete (global as any).window
    })
  })

  describe("clearShareHash", () => {
    it("should clear the hash and update history", () => {
      const mockReplaceState = mock.fn()
      global.window = {
        location: {
          href: "https://example.com/subjects#share=payload",
        },
        history: {
          replaceState: mockReplaceState
        }
      } as any
      global.URL = class extends URL {
        constructor(url: string) {
          super(url)
        }
      } as any

      clearShareHash()

      assert.strictEqual(mockReplaceState.mock.calls.length, 1)
      assert.strictEqual(mockReplaceState.mock.calls[0].arguments[0], null)
      assert.strictEqual(mockReplaceState.mock.calls[0].arguments[1], "")
      assert.strictEqual(mockReplaceState.mock.calls[0].arguments[2], "https://example.com/subjects")

      delete (global as any).window
    })
  })

  describe("downloadSubjectJson", () => {
    it("should create a blob, url, anchor and click it", () => {
      const mockCreateObjectURL = mock.fn()
      const mockRevokeObjectURL = mock.fn()
      const mockClick = mock.fn()

      global.URL.createObjectURL = mockCreateObjectURL
      global.URL.revokeObjectURL = mockRevokeObjectURL

      global.Blob = class Blob {
        constructor(content: any[], options: any) {
        }
      } as any

      const mockAnchor = {
        href: "",
        download: "",
        click: mockClick
      }

      global.document = {
        createElement: (tag: string) => {
          if (tag === "a") return mockAnchor
          return {}
        }
      } as any

      downloadSubjectJson(mockSubject)

      assert.strictEqual(mockCreateObjectURL.mock.calls.length, 1)
      assert.strictEqual(mockClick.mock.calls.length, 1)
      assert.strictEqual(mockRevokeObjectURL.mock.calls.length, 1)
      assert.strictEqual(mockAnchor.download, "test-id.json")

      delete (global as any).document
      delete (global as any).Blob
      delete (global as any).URL.createObjectURL
      delete (global as any).URL.revokeObjectURL
    })
  })

  describe("downloadSubjectHtml", () => {
    it("should create a blob, url, anchor and click it to download HTML", () => {
      const mockCreateObjectURL = mock.fn()
      const mockRevokeObjectURL = mock.fn()
      const mockClick = mock.fn()

      global.URL.createObjectURL = mockCreateObjectURL
      global.URL.revokeObjectURL = mockRevokeObjectURL

      global.Blob = class Blob {
        constructor(content: any[], options: any) {
        }
      } as any

      const mockAnchor = {
        href: "",
        download: "",
        click: mockClick
      }

      global.document = {
        createElement: (tag: string) => {
          if (tag === "a") return mockAnchor
          return {}
        }
      } as any

      downloadSubjectHtml(mockSubject)

      assert.strictEqual(mockCreateObjectURL.mock.calls.length, 1)
      assert.strictEqual(mockClick.mock.calls.length, 1)
      assert.strictEqual(mockRevokeObjectURL.mock.calls.length, 1)
      assert.strictEqual(mockAnchor.download, "test-id_revision_sheet.html")

      delete (global as any).document
      delete (global as any).Blob
      delete (global as any).URL.createObjectURL
      delete (global as any).URL.revokeObjectURL
    })
  })
})
