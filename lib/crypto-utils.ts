/**
 * Cryptographically secure UUID v4 generation using crypto.getRandomValues().
 * Fallback for environments where crypto.randomUUID() is unavailable
 * (e.g., non-secure contexts, certain Node.js versions).
 */
export function uuid(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // Set version 4 (random UUID)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  // Set variant (RFC 4122)
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

/**
 * Cryptographically secure shuffle using the Fisher-Yates algorithm and crypto.getRandomValues().
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  const randomValues = new Uint32Array(1)
  for (let i = a.length - 1; i > 0; i--) {
    crypto.getRandomValues(randomValues)
    const j = randomValues[0] % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
