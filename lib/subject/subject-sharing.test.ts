import test from "node:test";
import assert from "node:assert";
import { buildShareUrl, SHARE_HASH_PREFIX } from "./subject-sharing";

test("buildShareUrl", async (t) => {
  await t.test("builds the correct url on the client side (window defined)", () => {
    const originalWindow = global.window;

    // Mock the window object
    // @ts-ignore
    global.window = {
      location: {
        protocol: "https:",
        host: "example.com"
      }
    };

    try {
      const encodedPayload = "test_payload_123";
      const result = buildShareUrl(encodedPayload);

      assert.strictEqual(
        result,
        `https://example.com/subjects${SHARE_HASH_PREFIX}${encodedPayload}`,
        "Should construct full URL using window.location properties"
      );
    } finally {
      // Restore the original window object
      global.window = originalWindow;
    }
  });

  await t.test("builds the correct relative url on the server side (window undefined)", () => {
    const originalWindow = global.window;

    // Explicitly make window undefined for this test
    // @ts-ignore
    delete global.window;

    try {
      const encodedPayload = "server_payload_456";
      const result = buildShareUrl(encodedPayload);

      assert.strictEqual(
        result,
        `/subjects${SHARE_HASH_PREFIX}${encodedPayload}`,
        "Should construct relative URL when window is undefined"
      );
    } finally {
      // Restore the original window object
      global.window = originalWindow;
    }
  });
});
