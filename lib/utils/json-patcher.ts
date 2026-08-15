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

  const stack: { type: number; index: number }[] = []

  for (let i = 0; i < json.length; i++) {
    const code = json.charCodeAt(i)

    if (code === 34) { // '"'
      // Fast-forward past the string block using indexOf to prevent character-by-character string iteration
      let nextQuote = i + 1;
      while (nextQuote < json.length) {
        nextQuote = json.indexOf('"', nextQuote);
        if (nextQuote === -1) {
          i = json.length;
          break;
        }

        // Count trailing backslashes to see if it's escaped
        let backslashCount = 0;
        let p = nextQuote - 1;
        while (p >= 0 && json.charCodeAt(p) === 92) {
          backslashCount++;
          p--;
        }

        if (backslashCount % 2 === 0) {
          i = nextQuote;
          break;
        }
        nextQuote++;
      }
      continue;
    }

    if (code === 123 || code === 91) { // '{' or '['
      stack.push({ type: code, index: i })
    } else if (code === 125 || code === 93) { // '}' or ']'
      const top = stack.pop()
      if (top) {
        const matchingClose = code === 125 ? 123 : 91 // '}' matches '{', ']' matches '['
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
