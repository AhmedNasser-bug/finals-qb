import { repairJson } from "../subject/subject-persistence"

/**
 * Scans a JSON string to locate the indices defining the boundary of the deformed
 * object or array enclosing the specified error position.
 * Uses a double-ended stack simulation to handle escaping and string boundaries.
 */
export function findDeformedBlockRange(json: string, errorPos: number): [number, number] {
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
    if (char === '\\') {
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
      continue;
    }

    if (char === '}' || char === ']') {
      const top = stack.pop()
      if (!top) continue;

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
}

/**
 * Splices a corrected code patch directly into the deformed JSON string block.
 * Strips formatting code blocks and straightens quotes on the patched block.
 */
export function applyBlockPatch(json: string, patch: string, errorPos: number): string {
  const [start, end] = findDeformedBlockRange(json, errorPos)
  
  // Clean and repair the patch itself (e.g. smart quotes, trailing commas, code fences)
  const cleanedPatch = repairJson(patch).repaired
  
  const before = json.slice(0, start)
  const after = json.slice(end)
  
  return before + cleanedPatch + after
}
