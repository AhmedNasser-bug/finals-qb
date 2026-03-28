/**
 * Client-side URL shortener using shrtco.de free API.
 * No authentication required, CORS-enabled, works entirely in the browser.
 */

interface ShortenResult {
  ok: boolean
  result?: {
    code: string
    short_url: string
    full_short_link: string
    short_link: string
    original_link: string
  }
  error?: string
}

/**
 * Shorten a URL using the shrtco.de API.
 * Returns the full short URL (e.g., "shrtco.de/abc123") or an error message.
 *
 * @param longUrl The full URL to shorten
 * @returns Promise<{ shortUrl: string } | { error: string }>
 */
export async function shortenUrl(longUrl: string): Promise<{ shortUrl: string } | { error: string }> {
  try {
    const encoded = encodeURIComponent(longUrl)
    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${encoded}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    })

    if (!response.ok) {
      return { error: `API error: ${response.status}` }
    }

    const data = (await response.json()) as ShortenResult

    if (!data.ok || !data.result?.short_url) {
      return { error: data.error || "Failed to shorten URL" }
    }

    // shrtco.de returns "shrtco.de/xxx", we want the full link
    return { shortUrl: `https://${data.result.short_url}` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to shorten URL" }
  }
}
