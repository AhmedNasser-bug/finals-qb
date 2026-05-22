import test from "node:test";
import assert from "node:assert";
import { shortenUrl } from "./url-shortener.ts";

test("shortenUrl handles API error", async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => ({
      ok: false,
      status: 500
    } as Response);

    const result = await shortenUrl("http://example.com");
    assert.deepStrictEqual(result, { error: "API error: 500" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("shortenUrl handles fetch exception", async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => {
      throw new Error("Network error");
    };

    const result = await shortenUrl("http://example.com");
    assert.deepStrictEqual(result, { error: "Network error" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("shortenUrl handles response where data is not ok", async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        ok: false,
        error: "Invalid URL"
      })
    } as Response);

    const result = await shortenUrl("http://example.com");
    assert.deepStrictEqual(result, { error: "Invalid URL" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("shortenUrl handles response where data is ok but missing full_short_link", async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        result: {}
      })
    } as Response);

    const result = await shortenUrl("http://example.com");
    assert.deepStrictEqual(result, { error: "Failed to shorten URL" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("shortenUrl successfully shortens a URL", async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        result: {
          full_short_link: "https://shrtco.de/abc"
        }
      })
    } as Response);

    const result = await shortenUrl("http://example.com");
    assert.deepStrictEqual(result, { shortUrl: "https://shrtco.de/abc" });
  } finally {
    global.fetch = originalFetch;
  }
});
