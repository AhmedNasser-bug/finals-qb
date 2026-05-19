import assert from "node:assert"
import test from "node:test"
import { maskString, maskArgs } from "./logger"

test("maskString - email", () => {
    assert.strictEqual(maskString("Contact test@example.com for info"), "Contact [REDACTED_EMAIL] for info")
})

test("maskString - JWT", () => {
    assert.strictEqual(maskString("Token: eyJhbGciOiJIUzI1NiIsInR5cCI.eyJzdWIiOiIxMjM0NTY3ODkw.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"), "Token: [REDACTED_JWT]")
})

test("maskString - secrets", () => {
    assert.strictEqual(maskString("password=supersecret"), "password=[REDACTED]")
    assert.strictEqual(maskString('{"api_key": "12345"}'), '{"api_key": "[REDACTED]"}')
})

test("maskArgs - error", () => {
    const err = new Error("Failed with token: eyJhbGciOiJIUzI1NiIsInR5cCI.eyJzdWIiOiIxMjM0NTY3ODkw.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
    const masked = maskArgs([err])[0]
    assert.strictEqual(masked.message, "Failed with token: [REDACTED_JWT]")
})

test("maskArgs - object", () => {
    const obj = { email: "test@example.com" }
    const masked = maskArgs([obj])[0]
    assert.strictEqual(masked.email, "[REDACTED_EMAIL]")
})

test("maskArgs - circular reference", () => {
    const obj: any = { a: 1 }
    obj.b = obj
    const masked = maskArgs([obj])[0]
    assert.strictEqual(masked.b, "[Circular]")
    assert.strictEqual(masked.a, 1)
})

test("maskArgs - timestamps are not CCs in objects", () => {
    const obj = { time: 1715694200000 } // Number, not string
    const masked = maskArgs([obj])[0]
    assert.strictEqual(masked.time, 1715694200000)

    // Check it still redacts strings with 16 digits
    const obj2 = { cc: "1234567812345678" }
    const masked2 = maskArgs([obj2])[0]
    assert.strictEqual(masked2.cc, "[REDACTED_CC]")
})

test("maskArgs - preserves Custom Error Properties", () => {
    const err: any = new Error("Failed with token: eyJhbGciOiJIUzI1NiIsInR5cCI.eyJzdWIiOiIxMjM0NTY3ODkw.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
    err.status = 404
    err.path = "/api/test"
    const masked = maskArgs([err])[0]
    assert.strictEqual(masked.message, "Failed with token: [REDACTED_JWT]")
    assert.strictEqual(masked.status, 404)
    assert.strictEqual(masked.path, "/api/test")
})

test("maskArgs - preserves Dates without data loss", () => {
    const d = new Date()
    const obj = { date: d }
    const masked = maskArgs([obj])[0]
    assert.strictEqual(masked.date instanceof Date, true)
    assert.strictEqual(masked.date.getTime(), d.getTime())
})
