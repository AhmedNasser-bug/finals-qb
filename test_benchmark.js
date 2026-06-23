function base64urlToArrayBufferSlow(base64url) {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=")

  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return bytes.buffer
}

function base64urlToArrayBufferFast(base64url) {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=")

  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

const largeStr = "a".repeat(100000);
const base64Str = btoa(largeStr);

console.time("Slow");
for(let i=0; i<100; i++) base64urlToArrayBufferSlow(base64Str);
console.timeEnd("Slow");

console.time("Fast");
for(let i=0; i<100; i++) base64urlToArrayBufferFast(base64Str);
console.timeEnd("Fast");
