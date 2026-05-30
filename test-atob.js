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
  if (typeof Buffer !== 'undefined') {
    // Need to convert to ArrayBuffer correctly
    const buf = Buffer.from(base64url, 'base64url');
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }

  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=")

  const binary = atob(base64)
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer
}

const largeBuffer = new Uint8Array(1024 * 1024 * 5); // 5MB
for (let i = 0; i < largeBuffer.length; i++) largeBuffer[i] = i % 256;
const base64 = Buffer.from(largeBuffer.buffer).toString('base64url');

console.time('Slow');
base64urlToArrayBufferSlow(base64);
console.timeEnd('Slow');

console.time('Fast');
base64urlToArrayBufferFast(base64);
console.timeEnd('Fast');
