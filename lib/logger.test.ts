import { test } from "node:test";
import assert from "node:assert";
import { maskData } from "./logger.ts";

test("maskData masks email", () => {
    assert.strictEqual(maskData("hello test@example.com"), "hello [REDACTED]");
});

test("maskData masks unquoted numbers but wraps in quotes", () => {
    const data = { password: 1234 };
    const masked = maskData(JSON.stringify(data));
    assert.strictEqual(masked, '{"password":"[REDACTED]"}');
});

test("maskData masks complex unquoted secrets", () => {
    const data = `password=MyP@ssw0rd!`;
    const masked = maskData(data);
    assert.strictEqual(masked, 'password="[REDACTED]"');
});

test("maskData properly handles unquoted nested arrays without breaking JSON structure", () => {
    const data = { password: [1, 2, 3] };
    const masked = maskData(JSON.stringify(data));
    assert.strictEqual(masked, '{"password":[1,2,3]}');
});
