function base64urlToArrayBufferBuffer(base64url) {
  if (typeof Buffer !== "undefined") {
    const b = Buffer.from(base64url, "base64url");
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  }
}

const largeStr = "a".repeat(100000);
const base64Str = Buffer.from(largeStr).toString("base64url");

console.time("Buffer");
for(let i=0; i<100; i++) base64urlToArrayBufferBuffer(base64Str);
console.timeEnd("Buffer");
