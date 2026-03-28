import type { FullSubjectData } from "@/lib/mold-types"
import { validateSubjectData } from "@/lib/subject-persistence"

// ─── Constants ────────────────────────────────────────────────────────────────

/** URL hash prefix that signals a shared payload is present. */
export const SHARE_HASH_PREFIX = "#share="

/**
 * Threshold (bytes) above which we warn that the URL may be unreliable.
 * Most browsers support URLs up to 2 MB but servers / link-shorteners often
 * truncate at 8 KB. We warn at 50 KB — acceptable for typical subject files.
 */
export const SHARE_SIZE_WARN_BYTES = 50_000

// ─── Encode ───────────────────────────────────────────────────────────────────

/**
 * Compress a FullSubjectData payload into a Base64url string suitable for
 * embedding in a URL hash. Uses the native CompressionStream (gzip) API.
 *
 * Returns { encoded, bytes } on success or { error } on failure.
 */
export async function encodeSubject(
  subject: FullSubjectData
): Promise<{ encoded: string; bytes: number } | { error: string }> {
  try {
    const json = JSON.stringify(subject)
    const bytes = new TextEncoder().encode(json)

    // gzip compress
    const cs = new CompressionStream("gzip")
    const writer = cs.writable.getWriter()
    writer.write(bytes)
    writer.close()

    const compressed = await new Response(cs.readable).arrayBuffer()
    const base64 = arrayBufferToBase64url(compressed)

    return { encoded: base64, bytes: compressed.byteLength }
  } catch (e) {
    return { error: `Encoding failed: ${e instanceof Error ? e.message : String(e)}` }
  }
}

/**
 * Decompress and validate a Base64url-encoded subject payload.
 *
 * Returns { subject } on success or { error } on failure.
 */
export async function decodeSubject(
  encoded: string
): Promise<{ subject: FullSubjectData } | { error: string }> {
  try {
    const compressed = base64urlToArrayBuffer(encoded)

    const ds = new DecompressionStream("gzip")
    const writer = ds.writable.getWriter()
    writer.write(new Uint8Array(compressed))
    writer.close()

    const decompressed = await new Response(ds.readable).arrayBuffer()
    const json = new TextDecoder().decode(decompressed)
    const raw: unknown = JSON.parse(json)

    const result = validateSubjectData(raw)
    if (!result.valid) {
      return { error: `Invalid subject data: ${result.errors.slice(0, 3).join("; ")}` }
    }

    return { subject: result.subject! }
  } catch (e) {
    return { error: `Decoding failed: ${e instanceof Error ? e.message : String(e)}` }
  }
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

/** Build the full shareable URL for a given encoded payload. */
export function buildShareUrl(encoded: string): string {
  const origin =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      : ""
  return `${origin}${SHARE_HASH_PREFIX}${encoded}`
}

/**
 * Detect whether the current page was loaded with a share hash.
 * Safe to call server-side (returns null).
 */
export function detectShareHash(): string | null {
  if (typeof window === "undefined") return null
  const hash = window.location.hash
  if (!hash.startsWith(SHARE_HASH_PREFIX)) return null
  const payload = hash.slice(SHARE_HASH_PREFIX.length)
  return payload.length > 0 ? payload : null
}

/** Remove the share hash from the browser URL without triggering a navigation. */
export function clearShareHash(): void {
  if (typeof window === "undefined") return
  const url = new URL(window.location.href)
  url.hash = ""
  window.history.replaceState(null, "", url.toString().replace(/#$/, ""))
}

// ─── File download fallback ───────────────────────────────────────────────────

/** Trigger a browser download of the subject as a raw .json file. */
export function downloadSubjectJson(subject: FullSubjectData): void {
  const blob = new Blob([JSON.stringify(subject, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${subject.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Internal Base64url ───────────────────────────────────────────────────────
// Uses Base64url (RFC 4648 §5) to avoid + / = characters in URLs.

function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function base64urlToArrayBuffer(base64url: string): ArrayBuffer {
  // Restore standard Base64 padding
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=")

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}
