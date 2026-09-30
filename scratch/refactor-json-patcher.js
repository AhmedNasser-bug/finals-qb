const fs = require('fs');

let content = fs.readFileSync('lib/utils/json-patcher.ts', 'utf-8');

const target = `export function findDeformedBlockRange(json: string, errorPos: number): [number, number] {
  if (errorPos < 0 || errorPos >= json.length) {
    return [0, json.length]
  }

  const stack: { type: "{" | "["; index: number }[] = []
  let inString = false
  let escaped = false

  for (let i = 0; i < json.length; i++) {
    const char = json[i]

    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }

    if (inString) continue;

    if (char === '{' || char === '[') {
      stack.push({ type: char, index: i })
    } else if (char === '}' || char === ']') {
      const top = stack.pop()
      if (top) {
        const matchingClose = char === '}' ? '{' : '['
        if (top.type === matchingClose && top.index <= errorPos && i >= errorPos) {
          return [top.index, i + 1]
        }
      }
    }
  }

  // If the block enclosing errorPos never closed (deformed/truncated JSON)
  // Search from the deepest/innermost stack item backwards
  for (let i = stack.length - 1; i >= 0; i--) {
    const item = stack[i]
    if (item.index <= errorPos) {
      return [item.index, json.length]
    }
  }

  return [0, json.length]
}`;

const replacement = `export function findDeformedBlockRange(json: string, errorPos: number): [number, number] {
  if (errorPos < 0 || errorPos >= json.length) {
    return [0, json.length]
  }

  const stack: { type: "{" | "["; index: number }[] = []
  let inString = false
  let escaped = false

  for (let i = 0; i < json.length; i++) {
    const char = json[i]

    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\\\') {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }

    if (inString) continue;

    if (char === '{' || char === '[') {
      stack.push({ type: char as "{" | "[", index: i })
      continue
    }

    if (char === '}' || char === ']') {
      const top = stack.pop()
      if (!top) continue

      const matchingClose = char === '}' ? '{' : '['
      if (top.type === matchingClose && top.index <= errorPos && i >= errorPos) {
        return [top.index, i + 1]
      }
    }
  }

  // If the block enclosing errorPos never closed (deformed/truncated JSON)
  // Search from the deepest/innermost stack item backwards
  for (let i = stack.length - 1; i >= 0; i--) {
    const item = stack[i]
    if (item.index <= errorPos) {
      return [item.index, json.length]
    }
  }

  return [0, json.length]
}`;

if (content.includes(target)) {
  fs.writeFileSync('lib/utils/json-patcher.ts', content.replace(target, replacement));
  console.log('json-patcher.ts patched successfully');
} else {
  console.log('json-patcher.ts target not found');
}
