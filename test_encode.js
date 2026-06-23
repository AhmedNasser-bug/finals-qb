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
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  // Avoid chunks.push and apply
  let binary = ""
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function arrayBufferToBase64urlBuffer(buffer) {
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


const largeStr = "a".repeat(100000);
const buffer = new TextEncoder().encode(largeStr).buffer;

console.time("Slow");
for(let i=0; i<100; i++) arrayBufferToBase64urlSlow(buffer);
console.timeEnd("Slow");

console.time("Fast (String +=)");
for(let i=0; i<100; i++) arrayBufferToBase64urlFast(buffer);
console.timeEnd("Fast (String +=)");

console.time("Buffer");
for(let i=0; i<100; i++) arrayBufferToBase64urlBuffer(buffer);
console.timeEnd("Buffer");
