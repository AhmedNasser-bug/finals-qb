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
