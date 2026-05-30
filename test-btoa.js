function arrayBufferToBase64urlSlow(buffer) {
  const bytes = new Uint8Array(buffer)
  const chunks = []
  const chunkSize = 8192
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    chunks.push(String.fromCharCode.apply(null, chunk))
  }
  const binary = chunks.join("")
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function arrayBufferToBase64urlFast(buffer) {
  // Use Buffer if available (Node.js) for huge speedup, otherwise fallback to chunking
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buffer).toString('base64url');
  }

  const bytes = new Uint8Array(buffer)
  const chunks = []
  const chunkSize = 8192
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    chunks.push(String.fromCharCode.apply(null, chunk))
  }
  const binary = chunks.join("")
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

const largeBuffer = new Uint8Array(1024 * 1024 * 5); // 5MB
for (let i = 0; i < largeBuffer.length; i++) largeBuffer[i] = i % 256;

console.time('Slow');
arrayBufferToBase64urlSlow(largeBuffer.buffer);
console.timeEnd('Slow');

console.time('Fast');
arrayBufferToBase64urlFast(largeBuffer.buffer);
console.timeEnd('Fast');
